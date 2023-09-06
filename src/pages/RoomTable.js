import React, {useEffect, useState } from "react";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
import {host} from "../libs/webRTC";
import { Box } from "@mui/material";
import StudentsTable from "../components/studentslist/StudentsTable";
import axios from "axios";
import fronLogger from "../libs/logger";


export default function RoomTable() {
    const [rowData, setRowData] = useState([]);
    useEffect(() => {
        axios
            .get(`${host}/studentData/room`)
            .then(res => {
                res.data.shift();
                console.log(res.data);
                setRowData(res.data);
            })
            .catch(err => {
                console.log('err in student data', err);
                fronLogger(err, "error", "RoomTable.js");
            });
    }, []);
    function logDelta({name, id, delta}) {
        console.log(`RoomTable: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    if (rowData.length > 0)
        return (
            <Box>
                <StudentsTable rowData={rowData} mode={1}/>
            </Box>
        );
    else 
        return <div/>;
}
