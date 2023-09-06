import React, { useEffect, useState, Profiler} from "react";
import { AppBar, Box, Button, Toolbar, Typography, Switch} from "@mui/material";
import BackendConnector from "../middleware/BackendConnector";
import { LightMode, Nightlight } from "@mui/icons-material";
import { Link } from "react-router-dom";
import GoogleAuth from "./GoogleAuth";
import NavbarButton from "./NavbarButton";
import Cookies from "js-cookie";
import '../i18n';
import { useTranslation } from 'react-i18next';
import SwitchLocal from "./SwitchLocal";

export default function MainNavbar({changeMode, mode}) {
    const [access, setAccess] = useState(null);
    const [t, i18n] = useTranslation();
    const Light = {background: '#05336e', left: '0', width: '100vw'}
    const Dark = {background: 'black', left: '0', width: '100vw'}

    useEffect(() => {
        BackendConnector.getPageAccessList(setAccess);
    }, []);
    return (
        <AppBar position="sticky" style={mode == 'dark' ? Dark : Light}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                    <Box>
                       <Typography
                            style={{ color: 'white', fontWeight: 'bold' }}
                            component={Link}
                            to="/"
                        >
                            Proctoring
                        </Typography> 
                    </Box>
                    <Button
                        component={Link}
                        to="/"
                        style={{ color: 'white', fontWeight: 'normal' }}
                    >
                        {t('Главная')}
                    </Button>
                    <NavbarButton access = {access} path="/mypage">
                        {t("Личный кабинет")}
                    </NavbarButton>
                    <NavbarButton access={access} path="/generateSession">
                        {t("Для студентов")}
                    </NavbarButton>
                    <NavbarButton access={access} path="/generateRoom">
                        {t("Ссылка на экзамен")}
                    </NavbarButton>
                    <NavbarButton access={access} path="/lessonList">
                        {t("Список предметов")}
                    </NavbarButton>
                    <NavbarButton access={access} path="/table">
                        {t("Таблица")}
                    </NavbarButton>
                    <NavbarButton access={access} path="/instruction">
                        {t("Инструкция")}
                    </NavbarButton>
                    <Button
                        component={Link}
                        to="/faq"
                        style={{ color: 'white', fontWeight: 'normal' }}
                    >
                        FAQ
                    </Button>
                </Box>
                <Box style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                    <LightMode />
                    <Switch color="default" 
                        checked={mode == 'dark'}
                        onChange={changeMode}
                    />
                    <Nightlight />
                </Box>
                <Box style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                    <SwitchLocal/>
                    <GoogleAuth />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
