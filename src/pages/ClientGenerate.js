import React from "react";
//import {host} from "../libs/webRTC";
//import axios from "axios";
import '../styles/ClientGenerate.css';
import { Box, CircularProgress } from "@mui/material";
import ClientFormFull from "../components/ClientFormFull";
import ClientFormShort from "../components/ClientFormShort";
import NavStruct from "../components/NavStruct";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
//import fronLogger from "../libs/logger";

function postData(group, photo, name, subject, title, room, link) {
    window.location = '/generateSession/client/123';
    // axios.post('/api/service/session/generate',[group, photo, name, subject, title, room, link])
    //         .then(res=>{
    //             console.log(res.data);
    //             window.location = (`/generateSession/client/${res.data}`);
    //         });
}


function createSession(room, setErrorText){
    let name = document.getElementById("name").value;
    let groupRe = /\d\d\d\d/;
    let group = document.getElementById("group").value;
    let groupReCheck  = groupRe.test(group);
    if (groupReCheck === true){
        let photo = null;
        if (window.sessionStorage.getItem("photo") === "true"){
            photo = window.sessionStorage.getItem("image");
        }
        let generateMode = window.sessionStorage.getItem('generateMode');
        //console.log(generateMode);
        if (generateMode === 1 || generateMode === "1"){
            // axios.get(`/api/service/session/generate/${room}`).then(res => {
            //     fronLogger(room, `link - ${res.data}, ${res.data["link"]}`, "ok", "ClientGenerate.js");
                //postData(group, photo, name, res.data["subject"], res.data["title"], room, res.data["link"]);

            // });
        } else{
            let title = document.getElementById("title").value;
            let subject = document.getElementById("subject").innerText;
            postData(group, photo, name, subject, title, room, "");
        }
    } else {
        setErrorText("Номер группы должен состоять из 4 цифр!");
    }
}

export default function ClientGenerate() {
    let path = window.location.href;
    function logDelta({name, id, delta}) {
        console.log(`ClientGenerate: ${name} matching ID ${id} changed by ${delta}`);
    }
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    getFCP(logDelta);
    // if (window.sessionStorage.getItem("photoChecked") === "false") {
    //     console.log("checked");
    //     axios.post(`${host}/photoLinkChecker`, [window.sessionStorage.getItem('image')])
    //         .then(res => {
    //             console.log("res", res.data);
    //             if (res.data === true) {
    //                 window.sessionStorage.setItem("photo", true);
    //             } else {
    //                 window.sessionStorage.setItem("photo", false);
    //             }
    //             window.sessionStorage.setItem("photoChecked", true);

    //             window.location.reload();
    //         });
    // }

    // let photo = window.sessionStorage.getItem('photo');
    // console.log(photo);
    let parsed = path.split('/')
    if (parsed.indexOf('generateSession') === parsed.length - 1){
        //if (window.sessionStorage.getItem("photoChecked") === "true"){
        if(true){
            window.sessionStorage.setItem("generateMode", 2);
            return (
                <Box>
                    <Box sx={{margin: '20px 0px 0px 50px'}}>
                        <NavStruct/>
                    </Box>
                    <ClientFormFull createSession={createSession}/>
                </Box>
            );
        } else{
            return(<Box sx={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size="15rem"/>
            </Box>);
        }
    } 
    else{
        console.log(parsed.at(-1));
        window.sessionStorage.setItem("generateMode", 1);
        return (
            <Box>
                <Box sx={{margin: '20px 0px 0px 50px'}}>
                    <NavStruct/>
                </Box>
                <ClientFormShort room = {parsed.at(-1)} createSession={createSession}/>
            </Box>
        );
    }
}
