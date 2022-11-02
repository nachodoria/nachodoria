import './App.css';
import React, { useState, useEffect } from 'react';
import Aos from "aos";


function App(){
  

  useEffect(()=> {
    Aos.init({duration : 1000});
}, [])

const [darkMode, setDarkMode] = useState(true);

let root = document.documentElement;
let nave = document.documentElement;
if (!darkMode){
  root.style.setProperty('--mode-background', "white");
  root.style.setProperty('--mode-letter', "black");
  root.style.setProperty('--mode-stroke', "2px #484848 ");
  nave.style.setProperty("background-image", "url(./assets/nave2.svg)")
}

else if (darkMode){
  root.style.setProperty('--mode-background', "black");
  root.style.setProperty('--mode-letter', "white");
  root.style.setProperty('--mode-stroke', "2px #ffffff ");
  nave.style.setProperty("background-image", "url(./assets/nave1.svg)")
}


  return (
  <>
    <div className='main' data-aos="fade-down" >
      <div className="App">
        <h1>ignacio doria</h1>
        <div className='nave' onClick={setDarkMode(!darkMode)}></div>
      </div>
    </div>

      <div className='ab-me-section' data-aos="fade-left">
          <h1>about me</h1>
          <h2>i'm an IT Student</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>

      <div className='projects-section' data-aos="fade-right">
          <h1>projects</h1>
          <h2>what do I do?</h2>
      

      </div>
  </>
  );
}

export default App;
