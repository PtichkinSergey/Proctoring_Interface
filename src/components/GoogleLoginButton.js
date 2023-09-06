import React from "react";
import GoogleLogin from 'react-google-login';
import BackendConnector from "../middleware/BackendConnector";
import '../styles/GoogleAuth.css'

export default function GoogleLoginButton(){

    const handleGoogleSignIn = (res) => {
        const params = new Map();
        params.set("myTag", "googleLogin")
            .set("login", res.profileObj.email)
            .set("name", res.profileObj.name);

        BackendConnector.signInUp(params);
        window.sessionStorage.setItem("image", res.profileObj.imageUrl);
    };

    const failHandlerGoogleSignIn = (res) => {
        //alert(JSON.stringify(res))
        window.sessionStorage.setItem("signin_error_text", JSON.stringify(res));
    };

    return(
        <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={handleGoogleSignIn}
            onFailure={failHandlerGoogleSignIn}
            cookiePolicy={'single_host_origin'}
            className="outlineBtn"
        />
    );
}
