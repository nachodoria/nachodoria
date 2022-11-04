import './App.css';
import React, { useState, useEffect, useRef } from 'react';

import locomotiveScroll from "locomotive-scroll";



function App(){
  const scrollRef = useRef();

  useEffect(() => {
    const scroll = new locomotiveScroll({
      el: scrollRef.current,
      smooth: true
    });
  });

  const projects = ["LINKEADOS", "LINK-IT","YOUDETECT", "$#%(#$?%#%#)" ];



  return (
  <>
   <div className='scroll'  ref={scrollRef}>
      <div className="main" >
        <div className="App" >

          <h1 
          data-scroll
          data-scroll-speed="8"
          data-scroll-position="top"
          data-scroll-direction="horizontal">ignacio doria</h1>

          <div className='nave'
          data-scroll
          data-scroll-offset	="0,0"
          data-scroll-speed="10"
          data-scroll-direction="vertical"
         ></div>
        </div>
      </div>

        <div className="ab-me-section">
            <h1
            data-scroll
            data-scroll-speed="-1.2"
            data-scroll-offset	="0,10"

            >about me</h1>
            <h2>i'm an IT Student</h2>
            <p>My name is Ignacio Doria, I am a high school student in Argentina. Fortunately I discovered the front-end development skills and started developing them at a young age. I started to learn these skills in 2020 and now I can tell that I know JS, React JS, CSS, HTML, Python, and some PHP for some back-end needs. I am open-minded to the process of learning.</p>
         </div>

        <div className='projects-section'>
            <h1
             data-scroll
             data-scroll-speed="-1.2"
             data-scroll-offset	="10"

            >projects</h1>
            <h2          
            >what do I do?</h2>
            <div className='projects-container'>
            {projects.map(function(i, a){
                return (
                <div className='project' id= {a} style = {a%2 ? {flexDirection: "row-reverse" } : {flexDirection : "row"}}>
                  <h1 style = {a%2 ? {minWidth : "200px"} : {minWidth:"100px"}}
                  >{[i]}</h1>
                  <p style = {a%2 ? {marginRight : "300px"} : {marginLeft : "300px", textAlign: "right"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse </p>
                </div>)
              })}
            </div>
           
        </div>

      </div>
  </>
  );
}

export default App;
