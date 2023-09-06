import React from "react";
import {useForm} from 'react-hook-form';
import '../styles/Auth.css';
import BackendConnector from "../middleware/BackendConnector";
import GoogleLoginButton from "./GoogleLoginButton";
import { Button, Box, Typography, TextField, IconButton, Link } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '../i18n';
import { useTranslation } from 'react-i18next';

export default function SignUp({onSignInClicked, togglePasswordVisibility, passwordShown}){
    const {register, handleSubmit} = useForm();
    const [t, i18n] = useTranslation();
    const onSignUpSubmit = (data) => {
        console.log("Auth sign up data: ", data);
        const params = new Map();
        params.set("myTag", "signUp")
            .set("login", data.login)
            .set("password", data.password)
            .set("name", data.name);
        window.sessionStorage.setItem("enterType", "Sign in");
        BackendConnector.signInUp(params);
    };

    return(
        <Box sx={{
            bgcolor: 'background.paper',
            margin: 'auto',
            borderRadius: '15px',
            textAlign: 'center',
        }}>
            <Typography 
                variant="h5" marginTop="10px" color={'text.primary'}
            >
                {t("Регистрация")}
            </Typography>
            <form className="Auth" onSubmit={handleSubmit(onSignUpSubmit)}>
                <TextField
                    variant="outlined"
                    label={t("Имя")}
                    className="AuthInput"
                    {...register("name", {required: true})}
                />
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
                <Button className="regButton" variant="contained" onClick={handleSubmit(onSignUpSubmit)}>
                    {t("Зарегистрироваться")}
                </Button>
            </form>
            <p>{t("или")} <Link onClick={onSignInClicked} sx={{cursor: 'pointer'}} color='text.primary'>
                {t("Войти")}</Link>
            </p>
            <p>{t("или")}</p>
            <Box className="googleLoginWrapper">
                <GoogleLoginButton/>
            </Box>
        </Box>
    )
}