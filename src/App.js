import './App.css';
import React, { useState} from 'react';
import { motion } from 'framer-motion';
import AnimatedTitle from './animatedText/AnimatedTitle';
import AnimatedSubtitle from './animatedText/AnimatedSubtitle';
import AnimatedProjectTitle from './animatedText/AnimatedProjectTitle';
import AnimatedDivider from './animatedText/AnimtedDivider';

function App() {


  const [theme, settheme] = useState("light")
  document.body.dataset.theme = theme

  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    settheme(newTheme)
    document.body.dataset.theme = theme
  }
  
  return (
    <>

        <motion.div className='scroll' >
          <motion.div className="main" >
            <motion.div className="start"  >
              <motion.div>
                <AnimatedTitle text={"ignacio"}></AnimatedTitle>
                <AnimatedTitle text={"doria"}></AnimatedTitle>
              </motion.div>
              <motion.div className='nave'
                initial={{
                  opacity: 0,
                }}
                whileInView={{
                  opacity: 1,
                  transition: {
                    delay: 0.5,
                    duration: 0.8
                  }
                }}
                onClick={handleToggle}
              ></motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="ab-me-section" >
            <AnimatedSubtitle  cs={"ab-me-subtitle"} text={"about"}></AnimatedSubtitle>
            <h2>i'm an IT Student</h2>
            <p
            >I am Ignacio Doria, a high school student residing in Argentina. I am pleased to say that I have discovered the field of Front-End and User Experience/User Interface Design at a young age and have begun to explore it. I possess an open-minded attitude towards learning and am patient when faced with challenges and issues to resolve.</p>
          </motion.div>

          <motion.div className='projects-section' >
            <AnimatedProjectTitle cs={"projects-section-subtitle"} text={"projects"}></AnimatedProjectTitle>
            <h2
            >my latest work</h2>
            <motion.div className='projects-container'  >

                <motion.div className='project' style={{ flexDirection: "row-reverse" }} >
                    <AnimatedProjectTitle
                     href='https://v0-ejp4yfx7r-nachodoria.vercel.app/'
                     rel="noreferrer" target="_blank"
                    cs={"projects-section-subtitle"}
                    style={{ minWidth: "200px", textAlign: "left" }}
                    text={"Portfolio V1"}
                  ></AnimatedProjectTitle>
                  <p
                    style={{ marginRight: "300px" }}>Personal Portfolio V1 was made in React and was one of my first React projects, it is a simplistic portfolio that shows information about my projects
                    </p>
                </motion.div>

                <motion.div className='project' style={{ flexDirection: "row" }} >
                
                  <AnimatedProjectTitle
                  href='https://japan-alpha.vercel.app/'
                  rel="noreferrer" target="_blank"
                    cs={"projects-section-subtitle"}
                    style={{ minWidth: "200px", textAlign: "right" }}
                    text={"J@pan"}
                  ></AnimatedProjectTitle>
         
                  <p
                    style={{ marginLeft: "300px" }}>J@pan is my first framer-motion project which I personally enojoyed the process of learning one of the best libraries for React
                    </p>
                </motion.div>

                <motion.div className='project' style={{ flexDirection: "row-reverse" }} >
                  <AnimatedProjectTitle
                  href='https://nachodoria.vercel.app/'
                  rel="noreferrer" target="_blank"
                    cs={"projects-section-subtitle"}
                    style={{ minWidth: "200px", textAlign: "left" }}
                    text={"Portfolio V2"}
                  ></AnimatedProjectTitle>
                  
                  <p
                    style={{ marginRight: "300px" }}>Personal Portfolio V2 is the project you are seeing right now. It was also made in React but with the attempt to practice dark and light mode and better practices in ReactJS 
                    </p>
                </motion.div>

                <motion.div className='project' style={{ flexDirection: "row" }} >
                  <AnimatedProjectTitle
                  href='https://the-earthly-decor.vercel.app/'
                  rel="noreferrer" target="_blank"
                    cs={"projects-section-subtitle"}
                    style={{ minWidth: "200px", textAlign: "right" }}
                    text={"The Earthly Décor"}
                  ></AnimatedProjectTitle>
                  
                  <p
                    style={{ marginLeft: "300px" }}>The Earthly Décor🌱 is my latest project. It is a landing about a furniture shop. I loved the natural colors in this project and enjoyed doing it. 
                    </p>
                </motion.div>

            </motion.div>
          </motion.div>

          <AnimatedDivider></AnimatedDivider>
          <motion.div className='social-media-container' >
            <motion.div className='mail-logo'>
              <span>Reach out for collaboration or say hi at <br></br><span className='mail' onClick={() => window.location = 'mailto:ignaciodoriaoberman@gmail.com'}>@ignaciodoriaoberman@gmail.com</span></span>
            </motion.div>
            <motion.div
              className='social-logos'>
              <a
                className='instagram'
                rel="noreferrer" target="_blank" href='https://www.instagram.com/nacho.doria/'></a>
              <a
                className='twitter'
                rel="noreferrer" target="_blank" href='https://twitter.com/NachoDoria_'></a>
              <a
                className='github'
                rel="noreferrer" target="_blank" href="https://github.com/nachodoria"></a>
            </motion.div>
          </motion.div>

        </motion.div>
    </>
  );
}

export default App;
