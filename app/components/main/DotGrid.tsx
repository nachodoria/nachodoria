"use client";

import { useEffect, useRef } from "react";

// --- Base grid + spotlight (size follows the cursor). Contained to its own canvas/container. ---
const GRID_GAP = 28;
const BASE_RADIUS = 1.3;
const MAX_RADIUS = 9;
const INFLUENCE_RADIUS = 150;
const DOT_MIN_RADIUS = 0.3;

// --- Shockwave on click: each dot gets an (offset, velocity) pushed by passing rings,
// then springs back to 0. A bold, springy kick: a wide, Gaussian-shaped push and an
// underdamped spring that overshoots before it settles. Rings expand at WAVE_SPEED and
// weaken (fade) as they travel. ---
const MAX_WAVES = 6;
const WAVE_SPEED = 400; // px/s
const WAVE_BAND = 200; // px — beyond this the Gaussian kick is negligible, skip the dot
const WAVE_GAUSSIAN_SIGMA = 70; // px — width of the kick's Gaussian falloff
const WAVE_KICK = 900; // px/s outward kick at the ring's center
const OFFSET_STIFFNESS = 60;
const OFFSET_DAMPING = 9;
const SHOCKWAVE_GROW = 1.4; // size multiplier at the peak of a ring passing through
const OFFSET_REST_EPSILON = 0.05;
const MAX_DT = 1 / 30;

// Idle dots sit at --dot-idle; dots lit by the spotlight or a passing wave blend
// toward --accent — solid tints, not opacity, so nothing turns grayish on --paper.
const DOT_IDLE_FALLBACK: RGB = [232, 165, 169]; // --dot-idle
const DOT_ACCENT_FALLBACK: RGB = [208, 32, 42]; // --accent
const COLOR_STEPS = 10; // buckets the idle→accent blend is quantized into per frame

// --- Cage: the spotlight itself is the thing pressed against the wall. Inside the box it's
// centered on the cursor as always; outside, its center glides to P, the closest point on
// the edge (CSS px, no inset), so it's sliced in half by the wall and slides along it. Full
// size right at the edge, easing down — never shaking, never bouncing — the farther out the
// cursor goes, down to a floor so it never disappears while still outside. Every smoothed
// value (center, size, lean) uses the same slow, calm lerp — no snapping, no jump when the
// cursor crosses in or out. ---
const SPOT_SMOOTH_BASE = 0.0005;
const STRENGTH_FALLOFF_DISTANCE = 700; // px
const STRENGTH_MIN = 0.45;
const LEAN_DISTANCE = 10; // px — how far a lit dot reaches toward the cursor
const LEAN_STIFFNESS = 120;
const LEAN_DAMPING = 22; // critically damped for stiffness 120 (2*sqrt(120) ≈ 22) — no overshoot

// --- Runtime efficiency only — none of this changes what's drawn. The loop pauses
// whenever the canvas is offscreen or the tab is hidden, and stops entirely once every
// spring/lerp has settled below these thresholds and no wave is left — a frame that would
// render pixel-identically to the last one is simply never drawn. Pointer movement or a
// click wakes it back up. ---
const SETTLE_EPS_PX = 0.05;
const SETTLE_EPS_SCALAR = 0.002;
const RESIZE_DEBOUNCE_MS = 120;

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

function smoothstep(t: number) {
    return t * t * (3 - 2 * t);
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

type RGB = [number, number, number];

// Reads a color custom property once via a throwaway probe element so the browser
// resolves whatever format it holds (hex, named, etc.) into actual r/g/b numbers.
function readRgb(varName: string, fallback: RGB): RGB {
    const probe = document.createElement("span");
    probe.style.color = `var(${varName})`;
    probe.style.display = "none";
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    document.body.removeChild(probe);

    const channels = computed.match(/[\d.]+/g);
    if (!channels || channels.length < 3) return fallback;
    return [Number(channels[0]), Number(channels[1]), Number(channels[2])];
}

function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

// Precomputes the idle→accent blend as solid "r, g, b" strings, COLOR_STEPS + 1 of
// them (t = 0, 1/COLOR_STEPS, … 1), so a frame only ever needs to pick a bucket.
function buildColorSteps(idle: RGB, accent: RGB): string[] {
    const steps: string[] = [];
    for (let i = 0; i <= COLOR_STEPS; i += 1) {
        const t = i / COLOR_STEPS;
        const r = Math.round(lerp(idle[0], accent[0], t));
        const g = Math.round(lerp(idle[1], accent[1], t));
        const b = Math.round(lerp(idle[2], accent[2], t));
        steps.push(`${r}, ${g}, ${b}`);
    }
    return steps;
}

interface Wave {
    x: number;
    y: number;
    r: number;
}

export default function DotGrid() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const targetRef = useRef({ x: -9999, y: -9999 });
    const wavesRef = useRef<Wave[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const physicsEnabled = !reduceMotion;
        const idleRgb = readRgb("--dot-idle", DOT_IDLE_FALLBACK);
        const accentRgb = readRgb("--accent", DOT_ACCENT_FALLBACK);
        const colorSteps = buildColorSteps(idleRgb, accentRgb);

        // CSS-pixel dimensions (from getBoundingClientRect), never canvas.width/height —
        // those are DPR-scaled and only the drawing transform below should know about DPR.
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        // The canvas's viewport position — cached, refreshed only on resize/scroll, never
        // read inside the pointermove handler itself.
        let rectLeft = 0;
        let rectTop = 0;
        // Last known pointer/touch position in viewport coordinates — kept so a scroll
        // (which moves rectLeft/rectTop but fires no pointermove) can recompute targetRef
        // instead of leaving the spotlight behind at its old on-page position.
        let lastClientX: number | null = null;
        let lastClientY: number | null = null;
        let rafId: number | null = null;
        let resizeTimeoutId: number | null = null;
        let running = false;
        let isIntersecting = true;
        let isTabVisible = document.visibilityState === "visible";
        let pointerInWindow = true;

        let cols = 0;
        let rows = 0;
        let offsetX = new Float32Array(0);
        let offsetY = new Float32Array(0);
        let velX = new Float32Array(0);
        let velY = new Float32Array(0);
        // The "wants to come out" lean — a critically damped spring per dot.
        let leanOffX = new Float32Array(0);
        let leanOffY = new Float32Array(0);
        let leanVelX = new Float32Array(0);
        let leanVelY = new Float32Array(0);

        let lastTime: number | null = null;

        // Smoothed spotlight state: center glides to the cursor (or to P outside), size
        // eases with distance, cageAmount is how much we're in "outside" mode at all —
        // every one of these uses the exact same slow lerp.
        let spotX = 0;
        let spotY = 0;
        let strength = 1;
        let cageAmount = 0;

        const updateRectPosition = () => {
            const rect = canvas.getBoundingClientRect();
            rectLeft = rect.left;
            rectTop = rect.top;
            if (lastClientX !== null && lastClientY !== null) {
                targetRef.current = { x: lastClientX - rectLeft, y: lastClientY - rectTop };
                startLoop();
            }
        };

        // Reads size from the CONTAINER, not the canvas itself — the canvas's own CSS
        // box is JS-pinned (see below) and so isn't a reliable source of "what size
        // should this be now" during a resize. dpr is re-read every time so monitor
        // drags and browser zoom (which the DPR-change watcher below triggers this
        // from) pick up the new density, not just CSS-size changes.
        const resize = () => {
            const rect = container.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            rectLeft = rect.left;
            rectTop = rect.top;
            dpr = Math.min(window.devicePixelRatio || 1, 2);

            // Setting canvas.width/height always clears the bitmap and resets the 2D
            // context transform, so the explicit setTransform below must come after.
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (targetRef.current.x === -9999) {
                targetRef.current = { x: width / 2, y: height / 2 };
            }
            spotX = targetRef.current.x;
            spotY = targetRef.current.y;

            cols = Math.ceil(width / GRID_GAP) + 1;
            rows = Math.ceil(height / GRID_GAP) + 1;
            // Float32Array zero-fills by default, so every dot's offset/velocity/lean
            // starts at rest — nothing carries over and jumps after a rebuild.
            offsetX = new Float32Array(cols * rows);
            offsetY = new Float32Array(cols * rows);
            velX = new Float32Array(cols * rows);
            velY = new Float32Array(cols * rows);
            leanOffX = new Float32Array(cols * rows);
            leanOffY = new Float32Array(cols * rows);
            leanVelX = new Float32Array(cols * rows);
            leanVelY = new Float32Array(cols * rows);

            // Ripple rings carry (x, y) in the old canvas's coordinate space — keeping
            // them across a rebuild would animate them from positions that no longer
            // mean anything relative to the new grid.
            wavesRef.current = [];
        };

        // Accumulates into one of COLOR_STEPS + 1 shared paths (by color bucket) rather
        // than filling per dot — the frame still ends in a handful of fills, not one per
        // dot. moveTo first so each circle starts its own subpath instead of connecting
        // to the previous one.
        const addDotToPath = (path: Path2D, px: number, py: number, r: number) => {
            if (r < DOT_MIN_RADIUS) return;
            path.moveTo(px + r, py);
            path.arc(px, py, r, 0, Math.PI * 2);
        };

        const drawFrame = (time: number) => {
            const previousTime = lastTime;
            const dt = previousTime === null ? 1 / 60 : Math.min((time - previousTime) / 1000, MAX_DT);
            lastTime = time;

            const { x: tx, y: ty } = targetRef.current;

            const outsideX = Math.max(0 - tx, 0, tx - width);
            const outsideY = Math.max(0 - ty, 0, ty - height);
            const distOutside = Math.hypot(outsideX, outsideY);
            const isOutside = distOutside > 0;

            // The spotlight's goal center: the cursor itself inside the box, or the closest
            // point on the edge (no inset) once it's outside — one clamp covers both.
            const goalX = clamp(tx, 0, width);
            const goalY = clamp(ty, 0, height);
            const strengthTarget = pointerInWindow ? clamp(1 - distOutside / STRENGTH_FALLOFF_DISTANCE, STRENGTH_MIN, 1) : 0;
            const cageAmountTarget = pointerInWindow && isOutside ? 1 : 0;

            const smooth = physicsEnabled ? 1 - Math.pow(SPOT_SMOOTH_BASE, dt) : 1;
            spotX += (goalX - spotX) * smooth;
            spotY += (goalY - spotY) * smooth;
            strength += (strengthTarget - strength) * smooth;
            cageAmount += (cageAmountTarget - cageAmount) * smooth;

            const diagonal = Math.hypot(width, height);

            if (physicsEnabled) {
                for (const wave of wavesRef.current) {
                    wave.r += WAVE_SPEED * dt;
                }
                wavesRef.current = wavesRef.current.filter((wave) => wave.r <= diagonal);
            }

            ctx.clearRect(0, 0, width, height);
            const colorPaths: Path2D[] = colorSteps.map(() => new Path2D());

            let anyDotActive = false;

            for (let row = 0; row < rows; row += 1) {
                for (let col = 0; col < cols; col += 1) {
                    const index = row * cols + col;
                    const hx = col * GRID_GAP + GRID_GAP / 2;
                    const hy = row * GRID_GAP + GRID_GAP / 2;

                    const spotDist = Math.hypot(spotX - hx, spotY - hy);
                    const spotlightT = easeOutCubic(clamp(1 - spotDist / INFLUENCE_RADIUS, 0, 1));
                    const radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * spotlightT * strength;

                    let ox = offsetX[index];
                    let oy = offsetY[index];
                    let vx = velX[index];
                    let vy = velY[index];
                    let ringBoost = 0;

                    if (physicsEnabled) {
                        let kickX = 0;
                        let kickY = 0;

                        for (const wave of wavesRef.current) {
                            const ddx = hx - wave.x;
                            const ddy = hy - wave.y;
                            const d = Math.hypot(ddx, ddy);
                            if (d <= 0) continue;
                            const diff = Math.abs(d - wave.r);
                            if (diff >= WAVE_BAND) continue;

                            const fade = Math.pow(Math.max(0, 1 - wave.r / diagonal), 2);
                            const gaussian = Math.exp(-Math.pow(diff / WAVE_GAUSSIAN_SIGMA, 2));
                            const strengthKick = gaussian * fade;
                            kickX += (ddx / d) * WAVE_KICK * strengthKick;
                            kickY += (ddy / d) * WAVE_KICK * strengthKick;
                            ringBoost = Math.max(ringBoost, strengthKick);
                        }

                        const atRest =
                            kickX === 0 &&
                            kickY === 0 &&
                            Math.abs(ox) < OFFSET_REST_EPSILON &&
                            Math.abs(oy) < OFFSET_REST_EPSILON &&
                            Math.abs(vx) < OFFSET_REST_EPSILON &&
                            Math.abs(vy) < OFFSET_REST_EPSILON;

                        if (!atRest) {
                            anyDotActive = true;

                            // The wide Gaussian band keeps a dot "in" the kick for many
                            // frames, so the kick is applied as a continuous force
                            // (dt-scaled) rather than a raw per-frame add.
                            vx += kickX * dt;
                            vy += kickY * dt;

                            const ax = -ox * OFFSET_STIFFNESS - vx * OFFSET_DAMPING;
                            const ay = -oy * OFFSET_STIFFNESS - vy * OFFSET_DAMPING;
                            vx += ax * dt;
                            vy += ay * dt;
                            ox += vx * dt;
                            oy += vy * dt;

                            offsetX[index] = ox;
                            offsetY[index] = oy;
                            velX[index] = vx;
                            velY[index] = vy;
                        }
                    }

                    const easedRingBoost = ringBoost > 0 ? smoothstep(Math.min(ringBoost, 1)) : 0;
                    const drawRadius = ringBoost > 0 ? radius * (1 + (SHOCKWAVE_GROW - 1) * easedRingBoost) : radius;

                    // How far this dot sits along the idle→accent blend: whichever is
                    // stronger, being near the spotlight or being hit by a passing wave.
                    const glow = clamp(Math.max(spotlightT * strength, easedRingBoost), 0, 1);
                    const colorBucket = Math.round(glow * COLOR_STEPS);

                    // "Wants to come out": a lit dot leans toward the real cursor direction
                    // while outside — a critically damped spring, so it settles with no
                    // overshoot or wobble.
                    const dirX = tx - hx;
                    const dirY = ty - hy;
                    const dirLen = Math.hypot(dirX, dirY);
                    const nx = dirLen > 0 ? dirX / dirLen : 0;
                    const ny = dirLen > 0 ? dirY / dirLen : 0;
                    const leanTargetX = nx * LEAN_DISTANCE * spotlightT * cageAmount;
                    const leanTargetY = ny * LEAN_DISTANCE * spotlightT * cageAmount;

                    let lvx = leanVelX[index];
                    let lvy = leanVelY[index];
                    let lox = leanOffX[index];
                    let loy = leanOffY[index];

                    if (physicsEnabled) {
                        const lax = (leanTargetX - lox) * LEAN_STIFFNESS - lvx * LEAN_DAMPING;
                        const lay = (leanTargetY - loy) * LEAN_STIFFNESS - lvy * LEAN_DAMPING;
                        lvx += lax * dt;
                        lvy += lay * dt;
                        lox += lvx * dt;
                        loy += lvy * dt;
                        leanVelX[index] = lvx;
                        leanVelY[index] = lvy;
                        leanOffX[index] = lox;
                        leanOffY[index] = loy;

                        if (
                            Math.abs(lox) >= SETTLE_EPS_PX ||
                            Math.abs(loy) >= SETTLE_EPS_PX ||
                            Math.abs(lvx) >= SETTLE_EPS_PX ||
                            Math.abs(lvy) >= SETTLE_EPS_PX
                        ) {
                            anyDotActive = true;
                        }
                    }

                    // Never crosses the edge — the dot's center stays at least its own
                    // radius inside the box.
                    const drawX = clamp(hx + ox + lox, drawRadius, Math.max(drawRadius, width - drawRadius));
                    const drawY = clamp(hy + oy + loy, drawRadius, Math.max(drawRadius, height - drawRadius));

                    addDotToPath(colorPaths[colorBucket], drawX, drawY, drawRadius);
                }
            }

            for (let i = 0; i <= COLOR_STEPS; i += 1) {
                ctx.fillStyle = `rgb(${colorSteps[i]})`;
                ctx.fill(colorPaths[i]);
            }

            // Nothing left moving and nothing waiting to settle — a further frame would
            // render identically to this one, so stop rather than redraw it forever.
            const settled =
                wavesRef.current.length === 0 &&
                !anyDotActive &&
                Math.abs(goalX - spotX) < SETTLE_EPS_PX &&
                Math.abs(goalY - spotY) < SETTLE_EPS_PX &&
                Math.abs(strengthTarget - strength) < SETTLE_EPS_SCALAR &&
                Math.abs(cageAmountTarget - cageAmount) < SETTLE_EPS_SCALAR;

            if (settled) {
                running = false;
                rafId = null;
                return;
            }

            rafId = requestAnimationFrame(drawFrame);
        };

        const startLoop = () => {
            if (running || !isIntersecting || !isTabVisible) return;
            running = true;
            lastTime = null;
            rafId = requestAnimationFrame(drawFrame);
        };

        const stopLoop = () => {
            running = false;
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        const syncRunState = () => {
            if (isIntersecting && isTabVisible) startLoop();
            else stopLoop();
        };

        resize();
        startLoop();

        // Tracked on the window, not just the container — the cage needs to know where the
        // cursor is even while it's outside the canvas. Uses the cached rect position, never
        // getBoundingClientRect() directly.
        const handlePointerMove = (event: PointerEvent) => {
            lastClientX = event.clientX;
            lastClientY = event.clientY;
            targetRef.current = { x: event.clientX - rectLeft, y: event.clientY - rectTop };
            pointerInWindow = true;
            startLoop();
        };
        const handlePointerLeaveWindow = () => {
            pointerInWindow = false;
        };
        const handlePointerDown = (event: PointerEvent) => {
            if (!physicsEnabled) return;
            wavesRef.current.push({ x: event.clientX - rectLeft, y: event.clientY - rectTop, r: 0 });
            if (wavesRef.current.length > MAX_WAVES) wavesRef.current.shift();
            startLoop();
        };
        // Touch has no hover, so a finger landing on the page only ever fires
        // pointerdown — never a pointermove first — and once the browser recognizes the
        // drag as a scroll it cancels pointer events entirely and stops sending
        // pointermove. touchmove keeps firing throughout the gesture regardless, so it's
        // what actually tracks "every finger movement" on phone; touchstart covers the
        // very first touch so the spotlight snaps there before any movement.
        const handleTouchTrack = (event: TouchEvent) => {
            const touch = event.touches[0];
            if (!touch) return;
            lastClientX = touch.clientX;
            lastClientY = touch.clientY;
            targetRef.current = { x: touch.clientX - rectLeft, y: touch.clientY - rectTop };
            pointerInWindow = true;
            startLoop();
        };
        const handleTouchRelease = () => {
            pointerInWindow = false;
        };
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("touchstart", handleTouchTrack, { passive: true });
        window.addEventListener("touchmove", handleTouchTrack, { passive: true });
        window.addEventListener("touchend", handleTouchRelease, { passive: true });
        window.addEventListener("touchcancel", handleTouchRelease, { passive: true });
        window.addEventListener("scroll", updateRectPosition, { passive: true });
        // Lenis drives scroll from its own rAF loop, which can update the page's
        // scroll position between native "scroll" events — listen to Lenis
        // directly too so the cached rect never lags behind during a scroll.
        const unsubscribeLenisScroll = window.__lenis?.on("scroll", updateRectPosition);
        document.addEventListener("pointerleave", handlePointerLeaveWindow);
        // The canvas itself is pointer-events-none, so the click listener lives on its
        // container instead.
        container.addEventListener("pointerdown", handlePointerDown, { passive: true });

        const intersectionObserver = new IntersectionObserver((entries) => {
            isIntersecting = entries[entries.length - 1].isIntersecting;
            syncRunState();
        });
        intersectionObserver.observe(container);

        const handleVisibilityChange = () => {
            isTabVisible = document.visibilityState === "visible";
            syncRunState();
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // ResizeObserver already fires at most once per frame and the rebuild is a
        // handful of small Float32Arrays, so there's no need to debounce it — doing so
        // left the canvas stale/clipped for the whole duration of a window drag or phone
        // rotation. startLoop() after resize() redraws one frame immediately if the loop
        // had stopped at rest — resize() zeroes every offset/velocity, so that frame
        // settles right back out unless something else (pointer motion, a click) is also
        // active.
        const resizeObserver = new ResizeObserver(() => {
            resize();
            startLoop();
        });
        resizeObserver.observe(container);

        // A pure devicePixelRatio change (zoom, dragging to another monitor) doesn't
        // touch CSS size, so the ResizeObserver above misses it — debounced separately
        // here since there's no per-frame signal to hang it off. matchMedia's
        // `resolution` query fires once when the current dpr stops matching; it's
        // re-created for the new dpr each time so the next change is still caught.
        const scheduleResize = () => {
            if (resizeTimeoutId !== null) window.clearTimeout(resizeTimeoutId);
            resizeTimeoutId = window.setTimeout(() => {
                resizeTimeoutId = null;
                resize();
                startLoop();
            }, RESIZE_DEBOUNCE_MS);
        };

        let dprMediaQuery: MediaQueryList | null = null;
        const handleDprChange = () => {
            scheduleResize();
            watchDpr();
        };
        const watchDpr = () => {
            dprMediaQuery?.removeEventListener("change", handleDprChange);
            dprMediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
            dprMediaQuery.addEventListener("change", handleDprChange);
        };
        watchDpr();

        return () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            if (resizeTimeoutId !== null) window.clearTimeout(resizeTimeoutId);
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("touchstart", handleTouchTrack);
            window.removeEventListener("touchmove", handleTouchTrack);
            window.removeEventListener("touchend", handleTouchRelease);
            window.removeEventListener("touchcancel", handleTouchRelease);
            window.removeEventListener("scroll", updateRectPosition);
            unsubscribeLenisScroll?.();
            document.removeEventListener("pointerleave", handlePointerLeaveWindow);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            container.removeEventListener("pointerdown", handlePointerDown);
            dprMediaQuery?.removeEventListener("change", handleDprChange);
            intersectionObserver.disconnect();
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative h-full w-full select-none overflow-hidden">
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
        </div>
    );
}
