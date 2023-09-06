import React, { useState } from "react";
import {useForm} from 'react-hook-form';
import '../styles/Auth.css';
import BackendConnector from "../middleware/BackendConnector";
import GoogleLoginButton from "./GoogleLoginButton";
import { Button, Box, Typography, TextField, IconButton, Link } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorIcon from '@mui/icons-material/Error';
import '../i18n';
import { useTranslation } from 'react-i18next';

export default function SignIn({onSignUpClicked, togglePasswordVisibility, passwordShown}){
    const [t, i18n] = useTranslation();
    const {register, handleSubmit} = useForm();
    const [errorText, setErrorText] = useState("")

    const onSignInSubmit = (data) => {
        const params = new Map();
        params.set("myTag", "signIn")
            .set("login", data.login)
            .set("password", data.password);
        window.sessionStorage.setItem("enterType", "Sign in");
        console.log("Auth sign in data: ", data);
        BackendConnector.signInUp(params, setErrorText);
    };

    return(
        <Box sx ={{
            bgcolor: 'background.paper',
            margin: 'auto',
            borderRadius: '15px',
            textAlign: 'center'
        }}>
            <Typography 
                variant="h5" marginTop="10px" color={'text.primary'}
            >
                {t("Авторизация")}
            </Typography>
            <form className="Auth" onSubmit={handleSubmit(onSignInSubmit)}>
                <TextField
                    variant="outlined"
                    label={t("Логин")}
                    className="AuthInput"
                    {...register("login", {
                        required: true,
                        pattern: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i
                    })}
                />
                <Box className="passWrapper">
                    <TextField
                        variant="outlined"
                        label={t("Пароль")}
                        className="AuthInput"
                        type={passwordShown ? "text" : "password"} 
                        {...register("password", {required: true})}
                    />
                    {!passwordShown ? 
                    <IconButton className="password_icon" onClick={togglePasswordVisibility} color="info">
                        <VisibilityOutlinedIcon/>
                    </IconButton>
                    :
                    <IconButton className="password_icon" onClick={togglePasswordVisibility} color="info">
                        <VisibilityIcon/>
                    </IconButton>
                    }   
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <Button className="confirmButton" variant="contained" onClick={handleSubmit(onSignInSubmit)}>
                            {t("Войти")}
                        </Button>
                        {errorText !== "" && <Box sx={{display: 'flex', marginLeft: '10px'}}>
                            <ErrorIcon color="error"/>
                            <Typography color="error" sx={{width: '10vw'}}>{errorText}</Typography>
                        </Box>} 
                    </Box>
                    <p>{t("или")} <Link onClick={onSignUpClicked} sx={{cursor: 'pointer'}} color='text.primary'>
                        {t("Зарегистрироваться")}</Link>
                    </p>
                </Box>
            </form>
            <p>{t("или")} </p>
            <Box className="googleLoginWrapper" >
                <GoogleLoginButton/>
            </Box>
        </Box>
    )
}