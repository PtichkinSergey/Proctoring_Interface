import React, {useEffect, useState} from "react";
import {host, socket} from "../libs/webRTC";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
import StudentsTable from "../components/studentslist/StudentsTable";
import axios from "axios";
import fronLogger from "../libs/logger";
import { Box } from "@mui/material";


export default function SessionTable(props) {
    const [rowData, setRawData] = useState([]);
    useEffect(() => {
        axios
            .get(`${host}/studentData/`)
            .then(res => {
                setRawData(res.data);
                let count = 0;
                while (count < res.data.length) {
                    if (res.data[count]["session_Processing_End"]) {
                        // sendStatLog(res.data[count]["_id"], `${res.data[count]["full_name"]} session_processing_end!`);
                    }
                    count += 1;
                }
            })
            .catch(err => {
                console.log('err in student data', err);
                fronLogger(err, "error", "SessionTable.js");
            });
    }, []);
    function logDelta({name, id, delta}) {
        console.log(`FullSessionTable: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    return (
        <Box>
            <StudentsTable rowData={rowData} mode={3}/>
        </Box>
    );
}
