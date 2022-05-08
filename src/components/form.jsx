import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";

import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {get, getDatabase, ref, set, child} from "firebase/database";

import "../form.css";
import LD_LOGO from "../media/LD_FLOWER.png";

const firebaseConfig = {
    apiKey: "AIzaSyAJDQNNmSpwplbJfN8vWTFP5gXbIpHNeOA",
    authDomain: "ld-form.firebaseapp.com",
    projectId: "ld-form",
    storageBucket: "ld-form.appspot.com",
    messagingSenderId: "464989672762",
    appId: "1:464989672762:web:e74cc8a009b0809a462c03",
    measurementId: "G-NEKTS0E7WC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let userFlag = true,
    emailFlag = true,
    numberFlag = true,
    writeToFirebase = false,
    serverStatus = "",
    click = 0,
    base64Img

const Form = () => {

    const [nameData, setNameData] = useState("");
    const [ldNumberData, setLdNumberData] = useState("");
    const [emailData, setEmailData] = useState("");
    const [screenShotData, setScreenShotData] = useState("");

    useEffect(() => {
        return;
    }, [emailData], [nameData], [ldNumberData]);

    const readUserData = (email, ld_number, username) => {
        const dbRef = ref(getDatabase());

        get(child(dbRef, "users/")).then((snapshot) => {

            if (!snapshot.exists()) {
                console.log("no data");
                writeUserData(username, email, ld_number);

            } else if (snapshot.exists()) {
                const dataSnapshot = snapshot.val();

                for (const data in dataSnapshot) {

                    if (dataSnapshot[data].username.indexOf(username.toLowerCase()) !== -1) {
                        userFlag = false;
                        serverStatus = "name already exists";
                    } else if (dataSnapshot[data].email.indexOf(email.toLowerCase()) !== -1 ) {
                        emailFlag = false;
                        serverStatus = "email already exists"
                    } else if (dataSnapshot[data].ld_number.indexOf(ld_number) !== -1) {
                        numberFlag = false;
                        console.log(ld_number);
                        serverStatus = "number already exists";
                    }
                }

                if (userFlag === true && emailFlag === true && numberFlag === true) {
                    writeUserData(username, email, ld_number);

                    if (writeToFirebase === true) {
                        document.getElementById("server-status").innerHTML = "Your life design info has been stored succesfully!";
                        document.getElementById("submit-button").style.backgroundColor = "#39D077";
                    } 
                } else {
                    // console.log("FAIL");
                    alert(serverStatus);
                    document.getElementById("server-status").innerHTML = "";
                    document.getElementById("submit-button").style.backgroundColor = "#ff0000";
                }
            } else {
                writeUserData(username, email, ld_number);
            }
        }).catch((error) => {
            console.error(error);
        })
    }

    const writeUserData = (name, email, number) => {
        const db = getDatabase();

        set(ref(db, "users/" + name), {
            username: name.toLowerCase(),
            ld_number: number,
            email: email.toLowerCase(),
        });

        writeToFirebase = true;

        if (writeToFirebase === true) screenCapture();
    }

    const writeScreenShotData = (name, email, base64Img) => {
        const db = getDatabase();

        set(ref(db, "screenshots/" + name), {
           name: name,
           email: email,
           baseURI:  base64Img
        });
    }

    const convertToLower = (input) => {
        console.log(input.value);
        let str = input.value;
        let char = "";

        for (let i = 0; i < str.length; i++) {
            char = str.charAt(i);
            console.log(char * 1);
            if (!isNaN(char * 1)) {
                console.log("integer");
            } else {
                if (char == char.toUpperCase() && char === "I" || char === "i") {
                    input.value = input.value.replace(/I/g, "i");
                } else if (char == char.toLowerCase() && char !== "I") {
                    let newChar = char.toUpperCase();
                    input.value = input.value.replace(char, newChar);
                }
            }
        }

        if (input.id === "name-input") document.getElementById("name-capture").innerHTML = input.value;
        if (input.id === "ld-number-input") document.getElementById("number-capture").innerHTML = input.value;
    }

    //SCREEN CAPTURE SCRIPT
    const screenCapture = () => {
        let LD_FORM = document.querySelector("body");
        
        html2canvas(LD_FORM, {
            useCORS: true,
            letterRendering: true,
            allowTaint: false,
            width: LD_FORM.height,
            height: LD_FORM.width

        }).then((canvas) => {
            let base64Img = canvas.toDataURL("image/png");

            let screenshot = new Image();
            screenshot.setAttribute("src", base64Img);
            console.log(screenshot.src);
            
            setScreenShotData(screenshot.src);
            console.log(screenShotData);

            // document.body.appendChild(screenshot);

            writeScreenShotData(nameData, emailData, base64Img);
        })
    }
    
    const handleSubmit = (e) => {

        if (nameData.length === 0 
            || emailData.length === 0 
            || ldNumberData === 0 
            || emailData.indexOf("@") === -1 ) {
            // console.error("empty field");
            document.getElementById("submit-button").style.opacity = "0.5";

            setTimeout(() => {
                document.getElementById("submit-button").style.opacity = "1";
                alert("you have not filled all the inputs");
                window.location.reload();
            }, 2000);

        } else {
            document.getElementById("name-input").value = "";
            document.getElementById("email-input").value = "";
            document.getElementById("ld-number-input").value = "";

            readUserData(emailData, ldNumberData, nameData);

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

    return (
        <React.Fragment>
            <header> <img className = "rotate" id = "LD-LOGO" src = {LD_LOGO}/> </header>
            <div id = "capture-container">
                <form id = "LD-form" 
                onSubmit={(e) => {
                    handleSubmit(e);
                    e.preventDefault();
                }}
                >
                    <div id = "form-container">
                        <label htmlFor = "name" onClick={() => {document.getElementById("name-input").focus({preventScroll: true})}}> MY NAME iS: </label>
                        <h1 id ="name-capture"></h1>
                        <input class = "capture-content" autoComplete = "off" required type = "text" id = "name-input" name = "name" 
                        onChange={(e) => {
                            setNameData(e.target.value);
                            convertToLower(document.getElementById("name-input"));
                        }}
                        ></input>
                        <br />

                        <label htmlFor = "ld-number" onClick={() => {document.getElementById("ld-number-input").focus({preventScroll: true})}}> LD NUMBER: </label>
                        <h1 id = "number-capture"></h1>
                        <input class = "capture-content" autoComplete = "off" required type="number" id="ld-number-input" name="ld-number" 
                            onWheel={(e) => e.target.blur()}
                            onChange={(e) => {
                                console.log(e.target.value);
                                convertToLower(document.getElementById("ld-number-input"));

                                if (e.target.value.length >= 4) {
                                    e.target.value = e.target.value.substring(0, 3);
                                }

                                if (Number(e.target.value) < 200){
                                    document.getElementById("ld-number-input").style.border = "3px solid #ff0000";
                                    document.getElementById("ld-number-input").style.borderRadius = "10px";

                                    if (e.target.value.length > 2 && e.target.value < 200 && e.key !== "Backspace") {
                                        numberFlag = false;
                                        e.preventDefault();
                                        alert("Number must be above 200!");
                                    } else {
                                        numberFlag = true;
                                    }
                                } else if (Number(e.target.value) >= 200){
                                    
                                    document.getElementById("ld-number-input").style.border = "3px solid #87ceeb"; 
                                    document.getElementById("ld-number-input").style.borderRadius = "10px";
                                    setLdNumberData(e.target.value);
                                    console.log(ldNumberData);
                                }
                            }}
                            onBlur = {(e) => {
                                if (e.target.value.length > 1 && e.target.value < 200) {
                                    numberFlag = false;
                                    alert("Number must be above 200");
                                } else {
                                    e.target.style.border = "3px solid #fff";
                                }
                            }}
                        />
                        {/* <br /> */}

                        <label htmlFor = "email" style={{fontSize: 7 + "vw"}} onClick={() => {document.getElementById("email-input").focus({preventScroll: true})}}> UUUU CAN EMAiL ME AT: </label>
                        <input style={{marginTop: -15 + "px"}}autoComplete = "off" required type = "email" id = "email-input" name = "email" onChange={(e) => {
                            setEmailData(e.target.value);
                            convertToLower(document.getElementById("email-input"));
                            
                        }}

                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                document.getElementById("name-input").style.opacity = "0";
                                document.getElementById("name-capture").style.opacity = "1";
                                document.getElementById("ld-number-input").style.opacity = "0";
                                document.getElementById("number-capture").style.opacity = "1";

                                if (numberFlag === false) {
                                    console.log("invalid");
                                    alert("number is not greater than 200");
                                    window.location.reload();
                                } else {
                                    console.log("hit");
                                    handleSubmit();
                                }
                                
                            }
                        }}
                        />

                        <h3 id = "server-status"></h3>
                    
                        {/* <input type = "submit" id = "submit-button"
                            onSubmit={() => {
                                document.getElementById("name-input").style.opacity = "0";
                                document.getElementById("name-capture").style.opacity = "1";
                                document.getElementById("ld-number-input").style.opacity = "0";
                                document.getElementById("number-capture").style.opacity = "1";
                                
                                screenCapture();
                                handleSubmit();
                            }}
                        />  */}
                    </div>
                </form>

                
                <button id = "submit-button" onMouseDown={(e) => {
                    document.getElementById("name-input").style.opacity = "0";
                    document.getElementById("name-capture").style.opacity = "1";
                    document.getElementById("ld-number-input").style.opacity = "0";
                    document.getElementById("number-capture").style.opacity = "1";

                    handleSubmit();

                }}
                
                > SUBMIT </button>
            </div>
        </React.Fragment>
    )
}

export default Form;