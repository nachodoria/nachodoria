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

  const projects = ["Linkeados", "Link-It","YouDetect", "$%$=%/&#$?%#%(#$?%#%#%?&#$/&$())" ]

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
            
            >about me</h1>
            <h2>i'm an IT Student</h2>
            <p>My name is Ignacio Doria, I am a high school student in Argentina. Fortunately I discovered the front-end development skills and started developing them at a young age. I started to learn these skills in 2020 and now I can tell that I know JS, React JS, CSS, HTML, Python, and some PHP for some back-end needs. I am open-minded to the process of learning.</p>
         </div>

        <div className='projects-section'>
            <h1
             data-scroll
             data-scroll-speed="-1.2"
            >projects</h1>
            <h2          
            >what do I do?</h2>
            

        </div>
      </div>
  </>
  );
}

export default App;
