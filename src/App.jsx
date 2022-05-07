import React, {useState, useEffect} from "react";
import Form from "./components/form";

import "./main.css";

const App = () => {

    window.onscroll = (e) => {
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = windowScroll / height;

        if (scrolled >= 0.9 && !navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
            document.getElementById("submit-button").style.display = "block";
        } else {
            document.getElementById("submit-button").style.display = "none";
        }

        console.log(scrolled);
    }
    return (
        <div id = "wrapper">
            <Form />
        </div>
        
    )
}

export default App;