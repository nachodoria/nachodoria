import React, {createContext, useState} from "react";

const LightModeContext = createContext();

function LightModeProvider(props){
    const [lightMode, setLightMode] = useState(true);
    const toggleLightMode = () =>{
        setLightMode(!lightMode);
    };
    return(
        <>
            <LightModeProvider value ={{lightMode, toggleLightMode}}>
                {props.children}
            </LightModeProvider>
        
        </>
    )
};

export {LightModeContext, LightModeProvider}