import React, {useState} from "react";
import {FormControl, Select, MenuItem, InputLabel} from "@mui/material";
//import {host} from "../libs/webRTC";
//import axios from "axios";
import '../i18n';
import { useTranslation } from 'react-i18next';

export default function SubjectForm(){
    const [t, i18n] = useTranslation();
    const [lessons, setLessons] = useState(['lesson1', 'lesson2', 'lesson3']);/////////////////////////////////////////////////////////
    let [subject, setChooseSubject] = useState('')
    if(lessons == null){
    //     axios.get(`${host}/lessons`).then((res) => {
    //         setLessons(res.data.map(e => e.name));
    //     });
    } 
    return(
        <FormControl sx={{ width: '20vw' }}>
            <InputLabel>{t("Предмет")}</InputLabel>
            <Select
                value={subject}
                onChange={event => setChooseSubject(event.target.value)}
                autoWidth
                label="Предмет"
                id="subject"
            >
            {lessons === null 
                ? "..." 
                : lessons.map(e => (
                    <MenuItem key={lessons.indexOf(e)} value={e} sx={{ width: '20vw' }}>{e}</MenuItem>
                ))
            }
            </Select>
        </FormControl>
    )
}