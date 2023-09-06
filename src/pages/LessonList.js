import React, { useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import NavStruct from "../components/NavStruct";
import '../styles/LessonList.css'
import '../i18n';
import { useTranslation } from 'react-i18next';
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
//import {socket, host} from "../libs/webRTC";
//import axios from 'axios';

let allDeleted = [];
// Ty Dexter
function isNullOrWhitespace( input ) {

    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '').length < 1;
}

export default function LessonList() {
    const [list, updateList] = useState([{name: 'lesson1'}, {name: 'lesson2'}, {name: 'lesson3'}, {name: 'lesson4'}]);
    const [t, i18n] = useTranslation();
    function logDelta({name, id, delta}) {
        console.log(`LessonList: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    if(list == null)
    {
        // axios.get(`${host}/lessons`).then((res) => {
        //     updateList(res.data);
        // });
    }
    function LessonListItem(a,i,arr) {
        function remove()
        {
            if(!window.confirm(`Вы действительно хотите удалить предмет "${a.name}"?`)) 
                return;
            
            const res = [];
            for(let j = 0; j < arr.length; ++j)
            {
                if(i === j) continue;
                res.push(arr[j]);
            } 

            allDeleted.push(a);
            updateList(res);
        }
        return (
            <TableRow key={i}>
                <TableCell>{a.name}</TableCell>
                <TableCell><IconButton onClick={remove} className="deleteBtn"><DeleteIcon/></IconButton></TableCell>
            </TableRow>
        );
    }
    function save()
    {
        const inserted = list.filter(o => !o._id);
        const deleted  = allDeleted.filter(o => o._id); 
        // axios.post(`${host}/lessons/update`, { inserted, deleted })
        //     .then((res) => {
        //         console.log(res);
        //         if(res.status === 200)
        //         {
        //             allDeleted = [];

        //             window.alert("Данные успешно обновлены!");
        //             // reload from db
        //             updateList(null);
        //         }
        //     })
        //     .catch(ex => {
        //         console.log(ex);
        //     });
    }

    function addOne()
    {
        let input = document.getElementById('lesson_name');
        let text  = input.value;
        if(isNullOrWhitespace(text))
        {
            return alert("Нужно ввести название предмета!");
        }

        const res = [...list, { name : text}];
        updateList(res);
        //input.value = "";
    }
    return (
        <Box>
            <Box sx={{margin: '20px 0px 0px 50px'}}>
                <NavStruct/>
            </Box>
            <Box sx={{ display: 'flex', margin: '20px 0px 0px 50px'}}>
                <Box sx={{bgcolor: 'background.paper', borderRadius: '20px', width: '300px', marginRight: '50px'}}>
                    <Table sx={{margin: '20px', width: '250px'}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("Название предмета")}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list === null ? "Загрузка..." : list.map(LessonListItem)}
                        </TableBody>
                    </Table>
                </Box>
                <Box sx={{ bgcolor: 'background.paper', borderRadius: '20px', display: 'flex', flexDirection: 'column', height: '160px'}}>
                    <Box sx={{margin: '30px 30px 10px 30px', display: 'flex', alignItems: 'center'}}>
                        <TextField
                            id="lesson_name" 
                            variant="outlined"
                            label={t("Название предмета")}
                            sx={{width: '20vw'}}
                        />
                        <Button variant="contained" onClick={addOne} className="addOneBtn" sx={{marginLeft: '10px'}}>{t("Добавить")}</Button>
                    </Box>
                    <Button variant="contained" color="success" onClick={save} className="saveBtn" sx={{margin: '0px 0px 30px 30px'}}>{t("Сохранить изменения")}</Button>
                </Box>
            </Box>
        </Box>
    );
}
