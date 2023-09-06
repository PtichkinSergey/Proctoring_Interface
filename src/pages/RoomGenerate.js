import React, {useState} from "react";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
import {Box, Button, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import NavStruct from "../components/NavStruct";
//import {socket, host} from "../libs/webRTC";
//import axios from "axios";
import '../i18n';
import { useTranslation } from 'react-i18next';
import '../styles/ClientGenerate.css';
import SubjectForm from "../components/SubjectForm";
import dayjs from "dayjs";
import ErrorIcon from '@mui/icons-material/Error';


function createRoom(date, setLinkText, setErrorText){
    let title = document.getElementById("title").value;
    let name = document.getElementById("name").value;
    let link = document.getElementById("link").value;
    let subject = document.getElementById("subject").innerText;
    let linkCheck = true;
    if (link !== ""){
        let regexp = /http:\/\//;
        linkCheck = regexp.test(link);
        if (linkCheck === false){
            setErrorText("Ссылка должна начинаться с http://");
            return;
        }
    }
    //let duration = document.getElementById("duration").value;
    //let message = document.getElementById("message").value;
    if (subject !== '' && title !== '' && date !== ''){
        // axios.post('/api/service/room/generate',[subject, title, name, link, date, duration, message])
        // .then(res => {
        //     document.getElementById("subject").value = '';
        //     document.getElementById("title").value = '';
             setLinkText(process.env.Domain_Name + '/generateSession/');
        //     document.getElementById("link").value = '';
        setErrorText('');
        //     console.log(res.data);
        // });
    } else {
        if (linkCheck !== false){
            setErrorText('Вы не ввели данные');
        }

    }
}


export default function RoomGenerate(){
    const [date, setDate] = useState(dayjs(''))
    const [linkText, setLinkText] = useState('')
    const [t, i18n] = useTranslation();
    const [errorText, setErrorText] = useState("");
    function logDelta({name, id, delta}) {
        console.log(`RoomGenerate: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    return (
        <Box>
            <Box sx={{margin: '20px 0px 0px 50px'}}>
                <NavStruct/>
            </Box>
            <Box className="client_form" sx={{bgcolor: 'background.paper'}}>
                <Box sx={{margin: '30px', display: 'flex', flexDirection: 'row' }}>
                    <Box sx={{marginRight: '30px'}}>
                        <Box className="client_input">
                            <TextField
                                id="name" 
                                variant="outlined"
                                label={t("ФИО преподавателя")}
                                className="text_field"
                            />
                        </Box>
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
                        <Box className="client_input">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={date} onChange={v => setDate(v)} className="text_field"/>
                            </LocalizationProvider>
                        </Box>
                        <Button   
                            variant="contained"
                            className="client_accept"
                            onClick={() => createRoom(date.format('YYYY-MM-DD'), setLinkText, setErrorText)} 
                        >
                            {t("Создать сессию")}
                        </Button>
                    </Box>
                    <Box>
                        <Box className="client_input">
                            <TextField
                                id="duration" 
                                variant="outlined"
                                label={t("Приблизительная длительность(мин)")}
                                className="large_text_field"
                            />
                        </Box>
                        <Box className="client_input">
                            <TextField
                                id="link" 
                                variant="outlined"
                                label={t("Ссылка на работу")}
                                className="large_text_field"
                            />
                        </Box>
                        <Box className="client_input">
                            <TextField
                                id="message"
                                multiline
                                rows={5} 
                                variant="outlined"
                                label={t("Сообщение для студента")}
                                className="large_text_field"
                            />
                        </Box>
                        {errorText !== "" && <Box sx={{display: 'flex'}}>
                            <ErrorIcon color="error"/>
                            <Typography color="error" sx={{width: '18vw'}}>{errorText}</Typography>
                        </Box>}
                    </Box>
                </Box>
            </Box>
            <Box className="client_link" sx={{bgcolor: 'background.paper', width: '53vw'}}>
                <Box sx={{padding: '20px'}}>
                    {t("Ссылка на комнату")}: {linkText}
                </Box>
            </Box>
        </Box>
    );
}
