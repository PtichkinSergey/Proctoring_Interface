import React, {useEffect, useState, useContext} from "react";
import {host, socket} from "../libs/webRTC";
import {Container, Jumbotron, Button} from "react-bootstrap";
import StudentsTable from "../components/studentslist/StudentsTable";
import axios from "axios";
import fronLogger from "../libs/logger";


export default function RoomTable(props) {
    const [rowData, setRawData] = useState([]);
    function request(){
        let token = document.getElementById("token").value;
        let message = document.getElementById("message").value;
        let file = document.getElementById("file").value;
        let date = document.getElementById("date").value;
        let error = document.getElementById("error").value;
        let source = document.getElementById("source").value;
        axios.post(`${host}/studentData/request`, [token, message, file, date, error, source])
        .then(res => {
            console.log(res.data.length)
            if (res.data.length > 0){
                setRawData(res.data);
            }
            
        });
    }

    useEffect(() => {
        axios
            .get(`${host}/studentData/log`)
            .then(res => {
                console.log(res.data);
                setRawData(res.data);
            })
            .catch(err => {
                console.log('err in student data', err);
                fronLogger(err, "error", "LogTable.js");
            });
    }, []);


    if (rowData.length > 0)
        return (<Container fluid>
            <input type="text" placeholder="token" id="token"/>
            <input type="text" placeholder="message" id="message"/>
            <input type="text" placeholder="file.name" id="file"/>
            <input type="date" id="date"/>
            <input type="text" placeholder="ok" id="error"/>
            <input type="text" placeholder="webcam" id="source"/>
            <Button onClick={() => request()} >
                    Отправить запрос
            </Button>
            <StudentsTable rowData={rowData} mode={4}/>
        </Container>);
    else return <div/>;
}
