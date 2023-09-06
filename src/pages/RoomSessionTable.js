import React, {useEffect, useState } from "react";
import {host} from "../libs/webRTC";
import { Box } from "@mui/material";
import StudentsTable from "../components/studentslist/StudentsTable";
import axios from "axios";
import fronLogger from "../libs/logger";



export default function RoomSessionTable() {
    const [rowData, setRawData] = useState([]);

    let token = window.location.href.split('/').at(-1);

    useEffect(() => {
        axios
            .get(`${host}/studentData/room/${token}`)
            .then(res => {
                console.log(res.data);
                fronLogger(token, res.data, "ok", "RoomSessionTable.js");
                setRawData(res.data);
            })
            .catch(err => {
                console.log('err in student data', err);
                fronLogger(token, err, "error", "RoomSessionTable.js");
            });
    }, []);


    if (rowData.length > 0)
        return <Box>
            <StudentsTable rowData={rowData} mode={2}/>
        </Box>;
    else return <div/>;
}
