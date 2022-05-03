import React, { useEffect, useState } from "react";

import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {get, getDatabase, ref, set, child} from "firebase/database";

import "../form.css";

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
    numberFlag = true;

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

                    if (dataSnapshot[data].username.indexOf(username) !== -1) {
                        userFlag = false;
                    } else if (dataSnapshot[data].email.indexOf(email) !== -1 ) {
                        emailFlag = false;
                    } else if (dataSnapshot[data].ld_number.indexOf(ld_number) !== -1) {
                        numberFlag = false;
                    }
                }

                if (userFlag === true && emailFlag === true && numberFlag === true) {
                    writeUserData(username, email, ld_number);
                } else {
                    // console.log("FAIL");
                    alert("You have already submitted your Life design information");
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
            username: name,
            ld_number: number,
            email: email
        });
    }

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

            document.getElementById("submit-button").style.backgroundColor = "#39D077";

            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

    return (
        <React.Fragment>
            <form id = "LD-form" onSubmit={(e) => {
                handleSubmit(e);
                e.preventDefault();
            }}>
                <label htmlFor = "name" onClick={() => {document.getElementById("name-input").focus({preventScroll: true})}}> MY NAME IS </label>
                <input autoComplete = "off" required type = "text" id = "name-input" name = "name" 
                onChange={(e) => setNameData(e.target.value)}
                />
                {/* <br /> */}

                <label htmlFor = "ld-number" onClick={() => {document.getElementById("ld-number-input").focus({preventScroll: true})}}> LD NUMBER: </label>
                <input autoComplete = "off" required type="number" id="ld-number-input" name="ld-number" 
                    onChange={(e) => setLdNumberData(e.target.value)}
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

                <label htmlFor = "email" onClick={() => {document.getElementById("email-input").focus({preventScroll: true})}}> UUUU CAN EMAIL ME AT </label>
                <input autoComplete = "off" required type = "email" id = "email-input" name = "email" onChange={(e) => setEmailData(e.target.value)}/>
                <label>, REPORTING FOR DUTY </label>
                {/* <br /> */}
            
                <input type = "submit" id = "submit-button" 
                    onMouseDown={() => handleSubmit()} 
                    onMouseEnter={() => handleSubmit()}
                /> 
            </form>
        </React.Fragment>
    )
}

export default Form;