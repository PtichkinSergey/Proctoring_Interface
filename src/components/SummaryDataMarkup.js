import { Typography } from "@mui/material";
import React from "react";

export default function SummaryDataMarkup({rowData}) {
    return (
        <>
            <Typography variant="h4" color={'text.primary'}>Суммарные данные о нарушениях:</Typography>
            {/* <Typography>Отсутсвует в кадре - {rowData["isAbsent"]}</Typography>
            <Typography>Посторонние в кадре - {rowData["outsidersInTheFrame"]}</Typography>
            <Typography>Не смотрел в монитор - {rowData["isNotWatched"]}</Typography> */}
        </> 
    ); 
}
