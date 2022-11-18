import './App.css';
import "./locomotive-scroll.css"
import React, { useState, useEffect, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import LocomotiveScroll from 'locomotive-scroll';


function App() {
  const scrollRef = useRef();

  useEffect(() => {
    setTimeout(()=>{
      const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
    });
    },4000);
    
  },[]);




  const [theme, settheme] = useState("light")
  document.body.dataset.theme = theme

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    settheme(newTheme)
    document.body.dataset.theme = theme
  }

  
  const [title, setTitle] = useState("#%#%$&#%/&/(&/)=)(=????¡*¨*[]_::_;$");

  useEffect(() => {
    function makeid(length) {
      var result = '';
      var characters = '/%$/%/%()&()&(&&#%#%$&#%/&/(&/)=)(=????¡*¨*[]_::_;$"%$&"#!"$';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      return result
    }
    setTitle(makeid(10));
    
   
  }, [title])


  const projects = ["linkea2", "link-it", "v1", "v2"];
  const projectsContent = ["Linkea2 is an HTML-CSS-JS-PHP based virtual campus for school purposes, in the web application, professors can upload tasks and files, and students can upload their homeworks and take notes of the class in the campus",
   "Link-It is a MERN Stack project (React JS, Node JS, Angular and MongoDB) which helps people in enterprises to organize themselves and have a confortable space to comunicate. Project is in development."
  , "Personal Portfolio V1 was made in React and was one of my first React projects, it is a simplistic portfolio that shows information about my projects",
   "Personal Portfolio V2 is the project you are seeing right now. It was also made in React but with the attempt to practice dark and light mode, locomotive-scroll(shoutout to them) and better practices in React "];


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3900);
  }, []);
 



  return (
    <>
    {loading ? (
        <div className="loader-container">
      	  <h1 className="txt-loader" onClick={handleToggle}>{title}</h1>
        </div>
        ) : (
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
            {projects.map( (i, a)=> (
                <div className='project' key={a} style={a % 2 ? { flexDirection: "row-reverse" } : { flexDirection: "row" }} >
                  <h1
                    data-scroll
                    data-scroll-speed="4"
                    data-scroll-direction="vectical"


                    style={a % 2 ? { minWidth: "200px", textAlign:"left" } : { minWidth: "200px", textAlign:"right" }}
                  >{projects[a]}</h1>
                  <p data-scroll
                    data-scroll-speed="1"
                    data-scroll-direction="vectical"




                    style={a % 2 ? { marginRight: "300px" } : { marginLeft: "300px" }}>{projectsContent[a]} </p>
                </div>
               ))}
         </div>
        </div>

         <div className='divider' data-scroll-section data-scroll-section-id="section3.5"></div>

        <div className='social-media-container' data-scroll-section data-scroll-section-id="section4" >
              <div data-scroll
                  data-scroll-speed="1"
                  data-scroll-direction="vertical" className='mail-logo'>
                  <span>Reach out for collaboration or say hi at <br></br><span className='mail' onClick={() => window.location = 'mailto:ignaciodoriaoberman@gmail.com'}>@ignaciodoriaoberman@gmail.com</span></span>
              </div>
                <div data-scroll
                  data-scroll-speed="2"
                  data-scroll-direction="vertical"
                  className='social-logos'>
                <a
                  className='instagram'
                  rel="noreferrer" target="_blank" href='https://www.instagram.com/nacho.doria/'></a>
                <a
                  className='twitter'
                  rel="noreferrer" target="_blank" href='https://twitter.com/NachoDoria_'></a>
                <a
                  className='github'
                  rel="noreferrer" target="_blank" href  = "https://github.com/nachodoria"></a>
              </div>
        </div>
      
      </div>
      )}
    </>
  );
}

export default App;
