import React, { useState } from "react"
import {TextField , Button, Box, Typography } from "@mui/material";
import SubjectForm from "./SubjectForm";
import '../i18n';
import { useTranslation } from 'react-i18next';
import ErrorIcon from '@mui/icons-material/Error';

export default function ClientFormFull({createSession, error}){
    const [t, i18n] = useTranslation();
    const [errorText, setErrorText] = useState("");
    return(
        <Box className="client_form" sx={{bgcolor: 'background.paper'}}>
            <Box sx={{margin: '30px', display: 'flex' }}>
                <Box>
                    <Box className="client_input">
                        <TextField
                            id="name" 
                            variant="outlined"
                            label={t("ФИО")}
                            className="text_field"
                        />
                    </Box>
                    <Box className="client_input">
                        <TextField
                            id="group" 
                            variant="outlined"
                            label={t("Группа")}
                            className="text_field"
                        />
                    </Box>
                    <Button 
                        variant="contained"
                        className="client_accept"
                        onClick={() => createSession("000000000000000000000000", setErrorText)}
                    >
                        {t("Создать сессию")}
                    </Button>
                </Box>
                <Box sx={{marginLeft: '30px'}}>
                    <Box className="client_input">
                        <SubjectForm/>
                    </Box>
                    <Box className="client_input">
                        <TextField
                            id="title" 
                            variant="outlined"
                            label={t("Название работы")}
                            className="text_field"
                        />
                    </Box>
                    {errorText !== "" && <Box sx={{display: 'flex'}}>
                        <ErrorIcon color="error"/>
                        <Typography color="error" sx={{width: '18vw'}}>{errorText}</Typography>
                    </Box>}
                </Box>
            </Box>
        </Box> 
    )
}