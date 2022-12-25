import './App.css';
import React, { useState, useEffect } from 'react';
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
  


  const projects = ["link-it", "Portfolio V1", "Portfolio V2"];
  const projectsContent = [
    "Link-It is a MERN Stack project (React JS, Node JS, Angular and MongoDB) which helps people in enterprises to organize themselves and have a confortable space to comunicate. Project is in development."
    , "Personal Portfolio V1 was made in React and was one of my first React projects, it is a simplistic portfolio that shows information about my projects",
    "Personal Portfolio V2 is the project you are seeing right now. It was also made in React but with the attempt to practice dark and light mode, locomotive-scroll (shoutout to them) and better practices in ReactJS "];




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
            <h2
            >i'm an IT Student</h2>
            <p
            >My name is Ignacio Doria, I am a high school student in Argentina. Fortunately I discovered the Front-End and Ux/Ui enviroment and started venturing with it at a young age. I am open-minded and to the process of learning and I am pacient when it comes to solve issues.</p>
          </motion.div>

          <motion.div className='projects-section' >
            <AnimatedProjectTitle cs={"projects-section-subtitle"} text={"projects"}></AnimatedProjectTitle>
            <h2
            >my latest work</h2>
            <motion.div className='projects-container'  >
              {projects.map((i, a) => (
                <motion.div className='project' key={a} style={a % 2 ? { flexDirection: "row-reverse" } : { flexDirection: "row" }} >
                  <AnimatedProjectTitle
                    cs={"projects-section-subtitle"}
                    text={projects[a]}
                    style={a % 2 ? { minWidth: "200px", textAlign: "left" } : { minWidth: "200px", textAlign: "right" }}
                  ></AnimatedProjectTitle>
                  <p
                    style={a % 2 ? { marginRight: "300px" } : { marginLeft: "300px" }}> {projectsContent[a]}</p>
                </motion.div>
              ))}
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
