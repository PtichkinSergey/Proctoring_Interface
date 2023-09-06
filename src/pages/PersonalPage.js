import React from "react";
import '../styles/PersonalPage.css';
import BackendConnector from "../middleware/BackendConnector";
import { Box, Button, Avatar, Typography } from "@mui/material";
import NavStruct from "../components/NavStruct";
import '../i18n';
import { useTranslation } from 'react-i18next';
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';

export default function PersonalPage() {
    function logDelta({name, id, delta}) {
        console.log(`PersonalPage: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    const [t, i18n] = useTranslation();
    const changeName = () => {
        let ans = prompt(t("Пожалуйста, введите новое имя"));
        if (ans !== "" && ans !== null) {
            const params = new Map([
                ["name", ans]
            ]);
            BackendConnector.changeName(params);
        }
    };

    return (
        <Box>
            <Box sx={{margin: '20px 0px 0px 50px'}}>
                <NavStruct/>
            </Box>
            <Box className="whiteBoard" sx={{bgcolor: 'background.paper'}}>
                <Box className="profileWrapper">
                    <Typography sx={{fontSize: 30}}>{window.sessionStorage.getItem("name")}</Typography>
                    <Typography sx={{fontSize: 25}}>Email: {window.sessionStorage.getItem("email")}</Typography>
                    <Button className="changeNameBtn" sx={{marginTop: '10px'}} variant="contained" onClick={changeName}>
                        {t("Изменить имя")}
                    </Button>
                </Box>
                {!!window.sessionStorage.getItem("image") ?  
                <Avatar src={window.sessionStorage.getItem("image")} className="avatar"/>
                :
                <Avatar className="avatar"/>}
            </Box>
        </Box>
    );
}