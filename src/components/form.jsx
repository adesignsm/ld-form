import React, { useEffect, useState } from "react";

import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getDatabase, ref, set} from "firebase/database";

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

const Form = () => {

    const [nameData, setNameData] = useState("");
    const [ldNumberData, setLdNumberData] = useState("");
    const [emailData, setEmailData] = useState("");

    useEffect(() => {
        return;
    }, [emailData], [nameData], [ldNumberData]);

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
            console.error("empty field");
        } else {
            document.getElementById("name-input").value = "";
            document.getElementById("email-input").value = "";
            document.getElementById("ld-number-input").value = "";

            writeUserData(nameData, emailData, ldNumberData);
        }
    }

    return (
        <React.Fragment>
            <form id = "LD-form" onSubmit={() => {handleSubmit()}}>
                <label htmlFor = "name"> Name </label>
                <input required type = "text" id = "name-input" name = "name" onChange={(e) => setNameData(e.target.value)}/>
                <br />
                <label htmlFor = "ld-number"> Ld number </label>
                <input required 
                    placeholder="Any number 200 - 1000" 
                    type="number" 
                    // maxLength="4" 
                    id="ld-number-input" 
                    name="ld-number" 
                    onKeyDown={(e) => {
                        if (e.target.value.length >= 4) {
                            console.log("too big");
                            e.target.value = e.target.value.substring(0, 3);
                        }
                    }}
                    onChange={(e) => setLdNumberData(e.target.value)}
                />
                <br />
                <label htmlFor = "email"> Email </label>
                <input required type = "email" id = "email-input" name = "email" onChange={(e) => setEmailData(e.target.value)}/>
                <br />
                <input type = "submit" id = "submit-button" onMouseDown={() => handleSubmit()} /> 
            </form>
        </React.Fragment>
    )
}

export default Form;