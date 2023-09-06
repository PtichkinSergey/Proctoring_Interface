import { Box, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import KeyboardDoubleArrowRightOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowRightOutlined';
import '../i18n';
import { useTranslation } from 'react-i18next';

export default function NavStruct(){
    let path = window.location.pathname;
    let parsed = path.split('/');
    const [t, i18n] = useTranslation();
    const interpretation = {mypage: 'Личный кабинет', faq: 'FAQ', generateSession: 'Для студентов', 
                            generateRoom: 'Ссылка на экзамен', sessionlist: 'Список сессий из файла',
                            lessonList: 'Список предметов', table: 'Таблица комнат', deleteSession: 'Удаление сессии', 
                            instruction: 'Инструкция', admin: 'Администрирование',
                            client: 'Запись экзамена', simplifiedTable: 'Таблица сессий', teach: 'Страница сессии',
                            other: 'Полная таблица сессий'}
    const Arrow = <KeyboardDoubleArrowRightOutlinedIcon sx={{marginRight: '10px'}}/>
    let compareLink = '';
    return(
        <Box sx={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap'
        }}>
            <IconButton component={Link} to={'/'} >
                <HomeOutlinedIcon />
            </IconButton>
            {parsed.map(e => {
                if (interpretation[e] !== undefined){
                    compareLink = compareLink + '/' + e;
                    return(<Box key={parsed.indexOf(e)}>{Arrow} 
                        <Typography variant= "h5" component={Link} to={compareLink} color='text.primary' sx={{marginRight: '10px'}}>
                            {t(interpretation[e])}
                        </Typography></Box>
                    );
                }
            })}
        </Box>
    )
}