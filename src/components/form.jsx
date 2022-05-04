import React, { useEffect, useState } from "react";

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
    writeToFirebase = false;

const Form = () => {

    const [nameData, setNameData] = useState("");
    const [ldNumberData, setLdNumberData] = useState("");
    const [emailData, setEmailData] = useState("");

    useEffect(() => {
        return;
    }, [emailData], [nameData], [ldNumberData]);

    const readUserData = (email, ld_number, username) => {
        const dbRef = ref(getDatabase());

        get(child(dbRef, `users/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const dataSnapshot = snapshot.val();

                for (const data in dataSnapshot) {

                    if (dataSnapshot[data].username.indexOf(username.toLowerCase()) !== -1) {
                        userFlag = false;
                    } else if (dataSnapshot[data].email.indexOf(email.toLowerCase()) !== -1 ) {
                        emailFlag = false;
                    } else if (dataSnapshot[data].ld_number.indexOf(ld_number) !== -1) {
                        numberFlag = false;
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
                    let form = document.getElementById("LD-form");
                    form.addEventListener("submit", (e) => {e.preventDefault()});
                    document.getElementById("server-status").innerHTML = "Your Life design account has already been submitted";
                    document.getElementById("submit-button").style.backgroundColor = "#ff0000";
                }
            } else {
                // console.log("no data");
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
            email: email.toLowerCase()
        });

        writeToFirebase = true;
    }

    const convertToLower = (e, input) => {
        for (var i = 0; i < e.target.value.length; i++) {
            if (e.target.value.charAt(i)) {
                let str = e.target.value.toUpperCase();
                console.log(str);

                if (str.charAt(i) === "I") {
                    let newLetter = str.charAt(i).toLowerCase();
                    for (var x = 0; x < str.length; x++) {
                        if (str.charAt(x) === "I")  {
                            let newStr = str.replace(/I/g, newLetter);
                            input.value = newStr;
                        }
                        
                    }
                }
            }
        }
    }

    //SCREEN CAPTURE SCRIPT
    // const screenCapture = () => {
    //     let test = document.getElementById("LD-form");

    //     html2canvas(test).then((canvas) => {
    //         document.getElementById("test-capture").appendChild(canvas);
    //     });
    // }

    const handleSubmit = () => {

        if (nameData.length === 0 || emailData.length === 0 || ldNumberData === 0) {
            // console.error("empty field");

            if (emailData.indexOf("@") === -1) {
                document.getElementById("submit-button").style.opacity = "0.5";

                setTimeout(() => {
                    document.getElementById("submit-button").style.opacity = "1";
                }, 2000);
            }

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
            <div id = "test-capture"></div>
            <header> <img className = "rotate" id = "LD-LOGO" src = {LD_LOGO}/> </header>
            <form id = "LD-form" 
            onSubmit={(e) => {
                handleSubmit(e);
                e.preventDefault();
            }}
            >
                <div id = "form-container">
                <label htmlFor = "name" onClick={() => {document.getElementById("name-input").focus({preventScroll: true})}}> MY NAME iS: </label>
                <input autoComplete = "off" required type = "text" id = "name-input" name = "name" 
                onChange={(e) => {
                    setNameData(e.target.value);
                    convertToLower(e, document.getElementById("name-input"));
                }}
                />
                {/* <br /> */}

                <label htmlFor = "ld-number" onClick={() => {document.getElementById("ld-number-input").focus({preventScroll: true})}}> LD NUMBER: </label>
                <input autoComplete = "off" required type="number" id="ld-number-input" name="ld-number" 
                    onChange={(e) => {setLdNumberData(e.target.value)}}
                    onKeyDown={(e) => {
                        if (e.target.value.length >= 4) {
                            console.log("too big");
                            e.target.value = e.target.value.substring(0, 3);
                        }

                        if (parseInt(ldNumberData) < 20){
                            console.log("ld number too low");
                            document.getElementById("ld-number-input").style.border = "3px solid #ff0000";
                            document.getElementById("ld-number-input").style.borderRadius = "10px";

                            if (ldNumberData.length >= 2 && parseInt(ldNumberData) < 20) {
                                if (e.key !== "Backspace") alert("Number must be above 200!");
                            } 
                        } else {
                            document.getElementById("ld-number-input").style.border = "3px solid #fff"; 
                            document.getElementById("ld-number-input").style.borderRadius = "10px";
                        }
                    }}
                />
                {/* <br /> */}

                <label htmlFor = "email" onClick={() => {document.getElementById("email-input").focus({preventScroll: true})}}> UUUU CAN EMAiL ME AT: </label>
                <input autoComplete = "off" required type = "email" id = "email-input" name = "email" onChange={(e) => {
                    setEmailData(e.target.value);
                    convertToLower(e, document.getElementById("email-input"));
                }}
                />

                <h3 id = "server-status"></h3>
            
                <input type = "submit" id = "submit-button" 
                    onMouseDown={() => handleSubmit()} 
                    onMouseEnter={() => handleSubmit()}
                /> 
                </div>
            </form>
        </React.Fragment>
    )
}

export default Form;