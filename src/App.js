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
                <AnimatedTitle text={"I'm"}></AnimatedTitle>
                <AnimatedTitle text={"Ignacio"}></AnimatedTitle>
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
            >I have a great passion for technology and programming, and I greatly enjoy developing web applications. I graduated from ORT Argentina Belgrano High School, where I majored in Information and Communication Technology. This year 2023, I will be able to make one of my most cherished dreams come true: to study Computer Science in one of the most recognized countries in this field worldwide, specifically at York University in Toronto, Canada. 💻
</p>
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
                    style={{ marginRight: "300px" }}>Personal Portfolio V1, one of my early projects utilizing React, is a simple portfolio website that displays information about my various projects. It was constructed using React.
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
                    style={{ marginRight: "300px" }}>The Personal Portfolio V2, the current version you are viewing, is constructed using React. This iteration was created with the intent to practice implementing a dark and light mode feature and to improve upon best practices in ReactJS. 
                    </p>
                </motion.div>

                <motion.div className='project' style={{ flexDirection: "row" }} >
                  <AnimatedProjectTitle
                  href='https://galaxy-generator-peach.vercel.app/'
                  rel="noreferrer" target="_blank"
                    cs={"projects-section-subtitle"}
                    style={{ minWidth: "200px", textAlign: "right" }}
                    text={"Galaxy Generator"}
                  ></AnimatedProjectTitle>
                  
                  <p
                    style={{ marginLeft: "212px" }}> This Galaxy Generator is a project made fully in THREEJS with the help of Bruno Simon's course "Three Js Journey". 
                    </p>
                </motion.div>

                <motion.div className='project' style={{ flexDirection: "row" }} >
                  <AnimatedProjectTitle
                  href='https://threejs-journey-portalscene.vercel.app/'
                  rel="noreferrer" target="_blank"
                    cs={"projects-section-subtitle"}
                    style={{ minWidth: "200px", textAlign: "right" }}
                    text={"Golden Portal"}
                  ></AnimatedProjectTitle>
                  
                  <p
                    style={{ marginLeft: "300px" }}>This Golden Portal is the second project I made following Bruno Simon's course "Three Js Journey", this project is made in fully THREEJS with Blender 3D Software.
                    </p>
                </motion.div>

            </motion.div>
          </motion.div>

          <AnimatedDivider></AnimatedDivider>
          <motion.div className='social-media-container' >
            <motion.div className='mail-logo'>
              <span>Reach out for collaboration or say hi at <br></br><span className='mail' onClick={() => window.location = 'mailto:ignaciodoriaoberman@gmail.com'}>ignaciodoriaoberman@gmail.com</span></span>
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
