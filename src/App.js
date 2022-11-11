import './App.css';
import "./locomotive-scroll.css"
import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import LocomotiveScroll from 'locomotive-scroll';


function App() {
  const scrollRef = useRef();


  AOS.init();

  useEffect(() => {

    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });



  });


  const projects = ["linkea2", "link-it", "youdetect", "random"];


  const [theme, settheme] = useState("dark")
  document.body.dataset.theme = theme

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    settheme(newTheme)
    document.body.dataset.theme = theme
  }



  return (
    <>
      <div className='scroll' ref={scrollRef}>
        <div className="main" data-scroll-container >
          <div className="start" data-scroll-section data-scroll-section-id="section1" >
            <h1
              data-scroll
              data-scroll-speed="4"
              data-scroll-direction="horizontal"
              data-scroll-position="top"



            >ignacio doria</h1>

            <div className='nave'
              data-scroll
              data-scroll-speed="-4"
              data-scroll-direction="horizontal"
              data-scroll-position="top"


              onClick={handleToggle}
            ></div>
          </div>
        </div>

        <div className="ab-me-section" data-scroll-section data-scroll-section-id="section2"  >
          <h1
            data-scroll
            data-scroll-direction="vectical"
            data-scroll-position="top"
            data-scroll-speed="2">about me</h1>
          <h2
            data-scroll
            data-scroll-direction="vectical"
            data-scroll-position="top"
            data-scroll-delay="0.1"

            data-scroll-speed="1">i'm an IT Student</h2>
          <p
            data-scroll
            data-scroll-speed="2"
            data-scroll-direction="vectical"

          >My name is Ignacio Doria, I am a high school student in Argentina. Fortunately I discovered the front-end development skills and started developing them at a young age. I started to learn these skills in 2020 and now I can tell that I know JS, React JS, CSS, HTML, Python, and some PHP for some back-end needs. I am open-minded to the process of learning.</p>
        </div>

        <div className='projects-section' data-scroll-section data-scroll-section-id="section3" >
          <h1 data-scroll
            data-scroll-direction="vectical"
            data-scroll-position="top"
            data-scroll-speed="2"
          >projects</h1>
          <h2
            data-scroll
            data-scroll-direction="vectical"
            data-scroll-position="top"
            data-scroll-delay="0.1"
            data-scroll-speed="1"
          >what do I do?</h2>
          <div className='projects-container'  >
            {projects.map(function (i, a) {
              return (
                <div className='project' key={a} style={a % 2 ? { flexDirection: "row-reverse" } : { flexDirection: "row" }} >
                  <h1
                    data-scroll
                    data-scroll-speed="4"
                    data-scroll-direction="vectical"


                    style={a % 2 ? { minWidth: "200px" } : { minWidth: "100px" }}
                  >{[i]}</h1>
                  <p data-scroll
                    data-scroll-speed="1"
                    data-scroll-direction="vectical"
                    



                    style={a % 2 ? { marginRight: "300px" } : { marginLeft: "300px", textAlign: "right" }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse </p>
                </div>)
            })}
          </div>
        </div>
        <div className='social-media-container' data-scroll-section data-scroll-section-id="section4" >
          <svg
            data-scroll
            data-scroll-speed="4"
            data-scroll-direction="vectical"
            className='instagram'
            rel="noreferrer" target="_blank" href='https://www.instagram.com/nacho.doria/'></svg>
          <svg
            data-scroll
            data-scroll-speed="3"
            data-scroll-direction="vectical"
            className='twitter'
            rel="noreferrer" target="_blank" href='https://twitter.com/NachoDoria_'></svg>
          <svg
            data-scroll
            data-scroll-speed="2"
            data-scroll-direction="vectical"
            className='github'
            rel="noreferrer" target="_blank" href='https://github.com/nachodoria'></svg>
          <svg
            data-scroll
            data-scroll-speed="1"
            data-scroll-direction="vectical"
            onClick={() => window.location = 'mailto:ignaciodoriaoberman@gmail.com'}
            className='mail'></svg>

        </div>


      </div>
    </>
  );
}

export default App;
