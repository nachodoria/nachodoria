interface StackLabelProps {
    label: string;
    /** "default" for the sidebar drawer nav, "fast" for marquee pills (View, See All Projects…). */
    speed?: "default" | "fast";
}

export default function StackLabel({ label, speed = "default" }: StackLabelProps) {
    return (
        <span className={`stack-label${speed === "fast" ? " stack-label--fast" : ""}`}>
            <span className="stack-label__row">{label}</span>
            <span className="stack-label__row" aria-hidden="true">{label}</span>
        </span>
    );
}
