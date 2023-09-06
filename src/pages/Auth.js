import React, {useState} from "react";
import '../styles/Auth.css';
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { Box } from "@mui/material";
import SwitchLocal from "../components/SwitchLocal";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';

export default function Auth() {
    const [passwordShown, setPasswordShown] = useState(false);
    const [registerType, setRegisterType] = useState("Sign in");

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const onSignUpClicked = () => {
        setRegisterType("Sign up");
    };

    const onSignInClicked = () => {
        setRegisterType("Sign in");
    };
    function logDelta({name, id, delta}) {
        console.log(`Auth: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    return (
        <Box sx={{height: '100vh', overflow: 'hidden'}}>
            <Box sx={{textAlign: 'right', margin: '5px 30px'}}>
                <SwitchLocal/>
            </Box>
            <Box className="AuthPage">
                {registerType === "Sign in" &&
                    <SignIn 
                        onSignUpClicked = {onSignUpClicked} 
                        togglePasswordVisibility = {togglePasswordVisibility}
                        passwordShown = {passwordShown}
                    />
                }
                {registerType === "Sign up" &&
                    <SignUp 
                        onSignInClicked = {onSignInClicked}
                        togglePasswordVisibility = {togglePasswordVisibility}
                        passwordShown = {passwordShown}
                    />
                }
            </Box>
        </Box>
    );
}