import React, {useState, useEffect, useRef } from "react";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
import {joinRoom, stopSession} from "../libs/kurento";
import NavStruct from "../components/NavStruct";
//import {socket, host} from "../libs/webRTC";
import AlertError from "../components/Alert";
import fronLogger from "../libs/logger";
import { Typography, Box, Button, LinearProgress } from "@mui/material";
//import Bowser from "bowser";
//import axios from "axios";
import addNotification from 'react-push-notification';
import '../i18n';
import { useTranslation } from 'react-i18next';

// socket.on("send message", (data) => {
//     console.log("Frontend client page: ");
//     console.log(data);
// });

const START = "not started";
const IN_PROGRESS = "in progress";
const FINISH = "finished";

export default function Client(props) {
    const [recordButton, setButtonName] = useState("Начать запись");
    const [colorButton, setColorButton] = useState("success");
    const [disabledButton, setDisableButton] = useState(false);
    const [readyState, setReadyState] = useState(START);
    const [alertText, setAlertText] = useState("Шаг 1: Для начала экзамена нажмите кнопку \"Начать запись\"");
    const [showError, setError] = useState(false);
    const [teacherText, setTeacterText] = useState("");
    let path = window.location.href;
    const token = path.split('/').at(-1);
    //let sBrowser, sUsrAg = navigator.userAgent;
    const intervalRef = useRef(null);
    const [t, i18n] = useTranslation();
    const [stateProgress, setStateProgress] = useState('start');
    const [progress, setProgress] = useState(0);

    // if (sUsrAg.indexOf("Chrome") > -1) {
    // }
    // else{
    //     alert("Поменяйте браузер на Chrome или Chromium, в ином случае у вас не получится пройти экзамен");
    //     fronLogger(token, "Поменяйте браузер на Chrome или Chromium, в ином случае у вас не получится пройти экзамен", "warning", "Client.js");
    //     setDisableButton(true);
    // }
    useEffect(()=>{
        switch (stateProgress){
            case 'shureStart': setProgress(33); setAlertText("Шаг 2: Подождите, идет установка соединения..."); break;
            case 'waitComplete': setProgress(66); setAlertText("Шаг 3: Разрешение записи камеры и микрофона и демонстрации экрана"); break;
            case 'shureDevice': setProgress(100); setAlertText("Шаг 4: Вы можете приступать к выполнению экзамена"); break;
            case 'complete': setProgress(100); setAlertText("Экзамен успешно завершён!"); break;
        }
    }, [stateProgress]);

    useEffect(() => {
        // axios.get(`${host}/service/room/message/${token}`)
        //     .then(result => {
        //         console.log("frontend message", result.data);
        //         if (result.data["message"] !== ""){
        //             console.log("yes");
        //             setTeacterText(result.data["message"]);
        //         } else{
        //             console.log("NO");
        //         }
        //     });
    }, []);

    useEffect(() => {

        function beforeunload(event)
        {
            if(readyState === IN_PROGRESS && !window.reloadExpected)
            {
                event.preventDefault();
                return event.returnValue = 'Вы правда хотите закрыть страницу?';
            }
            window.reloadExpected = false;
        }

        function unload()
        {
            //sendStatLog(token, "Сессия завершена нажатием на крестик");  noo
            fronLogger(token, "Сессия завершена нажатием на крестик", "ok", "Client.js");
            setButtonName("Начать запись");
            setColorButton("success");
            setDisableButton(true);
            setAlertText("Экзамен успешно завершён!");
            if(readyState === IN_PROGRESS)
                //stopSession(token);
                setReadyState(FINISH);
        }

        window.reloadExpected = false;
        window.addEventListener("beforeunload", beforeunload);
        window.addEventListener("unload", unload);
        return () =>{
            window.removeEventListener("beforeunload", beforeunload);
            window.removeEventListener("unload", unload);
        };
    }, [readyState]);


    useEffect(() => {
        fronLogger(token, readyState, "ok", "Client.js");
        if (readyState === IN_PROGRESS) {
            let timer = setTimeout(function () {
                if (readyState === IN_PROGRESS) {
                    setError(true);
                }
            }, 60 * 1000);
            return () => clearTimeout(timer);
        }
    }, [readyState]);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // useEffect(() => {
    //     fetch(`${host}/users/` + token)
    //     .then(res => res.json())
    //     .then(result => {
    //         fronLogger(token, result.status, "ok", "Client.js");
    //         if (result.status === "-")
    //             setDisableButton(false);
    //         else setDisableButton(true);
    //     }, err => {
    //         setAlertText("Экзамен не был начат. Обратитесь к преподавателю.");
    //         playError();
    //         console.error(err);
    //         fronLogger(token, err, "error", "Client.js");
    //     });

    // }, []);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            addNotification({
                title: 'Внимание!',
                message: 'Запись НЕ начата!',
                native: true
            });
        }, 300000); // every 5 minutes
        return () => clearInterval(intervalRef.current);
    }, []);

    function playError()
    {
        const audio = new Audio("https://www.pacdv.com/sounds/interface_sound_effects/sound1.mp3");
        audio.play();
    }

    function startRecording() {
        //let browser= Bowser.getParser(navigator.userAgent);
        //fronLogger(token, "Browser for token " + token + " name: "+ browser.getBrowser().name + ", version: " + browser.getBrowser().version, "ok", "Client.js");

        if (recordButton === "Начать запись")
        {
             fronLogger(token, "Пользовать нажал начать запись", "ok", "Client.js");
             let needStart = window.confirm(t("Уверены, что хотите начать запись?"));
             if (needStart) {
                 fronLogger(token, "Пользовать уверен, что хочет начать запись", "ok", "Client.js");
                 setReadyState(START);
                 setStateProgress('shureStart')
            //     fetch(`${host}/users/` + token+"?flag=START", { method: 'POST'})
            //         .then(res => res.json)
            //         .then(result => console.log(result))
            //         .catch(err => {
            //             playError();
            //             console.error(err);
            //             fronLogger(token, err, "error", "Client.js");
            //         });

                 setButtonName("Остановить");
                 setColorButton("error");
                 let userName = "user-"+token;
                 setReadyState(IN_PROGRESS);

                //generate random timeout
                let min = 0;
                let max = 20;
                let timeout = Math.floor(Math.random() * (max - min + 1)) + min; //Generate random value from 0 to 20 inclusively
                fronLogger(token,  "Установлен таймаут", timeout, " c", "ok", "Client.js");
                sleep(timeout*1000).then(() => {
                    setStateProgress('waitComplete')
                    joinRoom(userName, token, "webcam", setReadyState, setStateProgress); // token is the same as roomname
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
            //         document.querySelector("link[rel='icon']").href = "/session_logo.png";
            //         axios.get(`${host}/openLink/${token}`).then(res => {
            //             console.log(res.data["link"]);
            //             if (res.data["link"] !== ""){
            //                 // setTimeout(function () {
            //                 window.open(res.data["link"],  '_blank');
            //                 // }, 80000);
            //             }
            //         });
                 });
             }
        }
        else
        {
            fronLogger(token, "Пользовать остановил запись", "ok", "Client.js");
            let needStop = window.confirm(t("После нажатия OK начать новую сессию будет нельзя. Вы уверены, что хотите закончить?"));
            if (needStop) {
                fronLogger(token, "Пользовать уверен, что хочет остановить запись", "ok", "Client.js");
                setButtonName("Начать запись");
                setStateProgress('complete')
                setColorButton("success");
                setDisableButton(true);
                setReadyState(FINISH);
            //     fetch(`${host}/users/` + token + "?flag=FINISH", { method: 'POST'})
            //         .then(res => res.json)
            //         .then(result => console.log(result))
            //         .catch(err => {
            //             console.error(err);
            //             //sendStatLog(token, err);
            //             fronLogger(token, err, "error", "Client.js");
            //         });
                 stopSession(token);
            }
        }
    }

    const refreshPage = ()=>{
        setReadyState(FINISH);
        window.reloadExpected = true;
        window.location.reload();
    };

    let error = <div/>;
    if (showError) {

        playError();
        error = <AlertError showAlert={showError}/>;
        //fronLogger(token, `Client showError: Долгое создание соединения - ${error}`, "error", "Client.js");
        setAlertText("Экзамен не был начат. Обратитесь к преподавателю.");
        
        // fetch(`${host}/failed/sessions/` + token, { method: 'POST'})
        //             .then(res => res.json)
        //             .then(result => console.log(result))
        //             .catch(err => {
        //                 playError();
        //                 console.error(err);
        //                 fronLogger(token, err, "error", "Client.js");
        //             });

        setButtonName("Начать запись");
        setColorButton("success");
        setReadyState(START);
        setDisableButton(false);
        setReadyState(FINISH);
        window.reloadExpected = true;
        refreshPage();
    }
    function logDelta({name, id, delta}) {
        console.log(`Client: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    return (
        <Box sx={{height: '100vh'}}>
            <Box sx={{margin: '20px 0px 0px 50px'}}>
                <NavStruct/>
            </Box>
            <Box className="client_form" sx={{bgcolor: 'background.paper'}}>
                <Box sx={{margin: '30px'}}>
                    <Typography variant="h5" color={'text.primary'} sx={{width: '52vw'}}>{t(alertText)}</Typography>
                    {error}
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between', 
                            width: '51vw', marginTop: '30px'}}>
                        <Typography variant="h5" color={'text.primary'}>{t('Шаг')} 1</Typography>
                        <Typography variant="h5" color={'text.primary'}>{t('Шаг')} 2</Typography>
                        <Typography variant="h5" color={'text.primary'}>{t('Шаг')} 3</Typography>
                        <Typography variant="h5" color={'text.primary'}>{t('Шаг')} 4</Typography>
                    </Box>
                    <Box sx={{margin: '20px 0px 20px 30px'}}>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            color={'primary'}
                            sx={{
                                width: '47vw'
                            }}
                        />
                    </Box>
                    <Button color={colorButton} variant="contained" className="client_accept"  onClick={() => startRecording()} disabled={disabledButton}>
                        {t(recordButton)}
                    </Button>
                </Box>         
            </Box>
            <Box className="client_message" sx={{bgcolor: 'background.paper'}}>
                <Box sx={{padding: '10px 30px 10px 30px'}}>
                    <Typography sx={{width: '52vw'}}>{t("Сообщение от преподавателя:")} {teacherText}</Typography>
                </Box>
            </Box>
        </Box>
    );
}
