import React, {useState, useEffect, createRef } from "react";
import { useLocation } from "react-router-dom";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
import {CAMERA_SOUND_VIOLATION, CHEATING_VIOLATION, OTHER_VIOLATION} from "../components/timeline/js/Marker";
//import Timeline from "../components/timeline";
//import VideoApp from "../components/VideoApp";
//import "video.js/dist/video-js.css";
import queryString from "query-string";
import {set, startOfToday} from "date-fns";
//import EventScale from "../components/EventScale";
//import EventScaleScreen from "../components/EventScaleScreen";
import SummaryDataMarkup from "../components/SummaryDataMarkup";
import SuspiciousApp from "../components/SuspiciousApp";
//import {host, socket} from "../libs/webRTC";
//import axios from "axios";
//import moment from "moment";
//import "moment/locale/ru";
//import fronLogger from "../libs/logger";
import { Row, Col } from "react-bootstrap";
import { Box, Typography, Link, Button, TextField, Table, TableHead, TableCell, TableBody, TableRow } from "@mui/material";
import NavStruct from "../components/NavStruct"
import '../i18n';
import { useTranslation } from 'react-i18next';

window.dialogOpenValue = false;
let screenTimeForLink = '';
let webTimeForLink = '';


export default function Watch() {
    let timelineRef = createRef();
    let location = useLocation();
    const [t, i18n] = useTranslation();
    let token = location.pathname.split('/').at(-1);
    console.log("Token: ", token);
    // const webcamJsOptions = {
    //   src: `${host}/links/webcam/${token}`
    // };

    async function setTimeWeb(time) {
        if (time === 0) {
            await setViolationWeb(0);
            await setViolationWeb(1);
        } else {
            await setViolationWeb(0);
            await setViolationWeb(time);
        }
        await setViolationScreen(0);
    }

    async function setTimeScreen(time) {
        if (time === 0) {
            await setViolationScreen(0);
            await setViolationScreen(1);
        } else {
            await setViolationScreen(0);
            await setViolationScreen(time);
        }
        await setViolationWeb(0);
    }

    useEffect(() => {
        let parsed = queryString.parse(location.search);
        for (let i in parsed) {
            if (i === "webTime") {
                if (parseInt(parsed[i]) > 0) {// && parseInt(parsed[i]) < moment.duration(rowData["webcamDuration"]).asSeconds()){
                    let time = parsed[i];    //
                    setViolationWeb(time);
                }
            } else if (i === "screenTime") {
                if (parseInt(parsed[i]) > 0) {// parseInt(parsed[i]) < moment.duration(rowData["screenDuration"]).asSeconds()){
                    let time = parsed[i];   //
                    setViolationScreen(time);
                }
            }
        }
    }, [location.search]);


    // const windowJsOptions = {
    //   src: `${host}/links/window/${token}`
    // };

    const weblink = `/api/links/webcam/${token}`;
    const screenlink = `/api/links/window/${token}`;
    const weblinkrec = `/api/links/res_webcam/${token}`;
    const screenlinkrec = `/api/links/res_window/${token}`;

    const [rowData, setRawData] = useState();
    const [markup, setMarkup] = useState([]);
    const [violationWeb, setViolationWeb] = useState(0);
    const [screenCastMarkup, setScreenCastMarkup] = useState([]);
    const [timeInfo, setTimeInfo] = useState("");
    const [violationScreen, setViolationScreen] = useState(0);
    const [sizeScreenMlcards, setSizeScreenMlcards] = useState(0);
    const [sizeWebcamMlcards, setsizeWebcamMlcards] = useState(0);

    const [showForm, setFormStatus] = useState(false);
    const [queryTime, setQueryTime] = useState(window.location.origin + window.location.pathname);

    let linkHolder = document.getElementById('link');

    function changeLinkTime(event) {
        if (/^\d+$/.test(event.target.value)) { // is number?

            if (event.target.id === "screenLink") screenTimeForLink = event.target.value;
            if (event.target.id === "webLink") webTimeForLink = event.target.value;

            setQueryTime(window.location.origin + window.location.pathname + "?webTime=" + webTimeForLink + '&' + "screenTime=" + screenTimeForLink);

        } else {
            linkHolder.innerHTML = "Введите целочисленное положительное число... "
        }
    }

    // //Function that finds the height of the video
    function resizeMlCards() {
        let heightWebVid = 0;
        //let heightScreenVid = document.getElementById('screenCol').clientHeight;
        if (rowData && rowData['presenceWebcamAndMicrophone']) {
            document.getElementById('presenceWebcam').style.display = "none";
        } else {
            //heightWebVid = document.getElementById('webcamCol').clientHeight;
        }

        //setSizeScreenMlcards(heightScreenVid);
        setsizeWebcamMlcards(heightWebVid);
    }

    // //Hook that, when changing the screen size,
    // //changes the height value for the block with ml cards
    useEffect(() => {
        resizeMlCards();
        window.addEventListener("resize", resizeMlCards, false);
    });


    function getImages() {
    //     axios.get(`${host}/ml/markup/` + token)
    //         .then(result => {
    //             fronLogger(token, result, "ok", "Watch.js");
    //             axios.post(`${host}/videoMarkupPictures`, [token, "webcam", result]).then(alert("webcam ready!"));
    //         });

    //     axios.get(`${host}/ml/screencastMarkup/` + token)
    //         .then(result => {
    //             fronLogger(token, result, "ok", "Watch.js");
    //             axios.post(`${host}/videoMarkupPictures`, [token, "window", result]).then(alert("window ready!"));
    //         });
    }

    function setLink() {
        linkHolder.innerHTML = queryTime;
    }

    function linkForVideo() {

        const viewData = () => {
            if (showForm) setFormStatus(false);
            else setFormStatus(true);
        };

        return (
            <Box sx={{padding: '30px 30px 20px 30px'}}>
                <Button onClick={viewData} variant="contained" sx={{marginBottom: '10px'}}>Ссылка с точным временем</Button>
                {showForm && (
                    <Box>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <TextField
                                id="webLink" 
                                variant="outlined"
                                label="Запись веб-камеры(сек)"
                                onChange={changeLinkTime}
                                sx={{width: '250px'}}
                            />
                            <TextField
                                id="screenLink" 
                                variant="outlined"
                                label="Запись экрана(сек)"
                                onChange={changeLinkTime}
                                sx={{width: '250px'}}
                            />
                            <Button onClick={setLink} type="submit" variant="contained">Сгенерировать</Button>
                        </Box>
                        <p id="link"></p>
                    </Box>
                )}
            </Box>
        );
    }

    // useEffect(() => {
    //     fetch(`${host}/ml/markup/` + token)
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 setMarkup(result);
    //             },
    //             (err) => {
    //                 console.log("Ошибки вывода markup", err);
    //                 fronLogger(token, err, "error", "Watch.js");
    //             }
    //         );
    // }, []);

    // useEffect(() => {
    //     fetch(`${host}/ml/screencastMarkup/` + token)
    //         .then(res => res.json())
    //         .then(
    //             (result) => {
    //                 setScreenCastMarkup(result);
    //             },
    //             (err) => {
    //                 console.log(err);
    //                 fronLogger(token, err, "error", "Watch.js");
    //             }
    //         );
    // }, []);

    // useEffect(() => {
    //     axios
    //         .get(`${host}/studentData/`)
    //         .then(res => {
    //             let count = 0;
    //             while (res.data[count]["_id"] !== String(token)) {
    //                 count += 1;
    //             }
    //             setRawData(res.data[count]);
    //         })
    //         .catch(err => {
    //             console.log('err in student data', err);
    //             fronLogger(token, err, "error", "Watch.js");
    //         });
    // }, []);

    // useEffect(() => {
    //     fetch(`${host}/user/info/` + token)
    //         .then(res => res.json())
    //         .then(result => {
    //            setTimeInfo({start: parseTime(result.start), end: parseTime(result.end)});
    //         });
    // });

    //Style for ml cards from screencast and webcam
    const screenMlCardsStyle = {
        width: '100%',
        overflow: 'auto',
        height: sizeScreenMlcards,
    };

    const webcamMlCardsStyle = {
        width: '100%',
        overflow: 'auto',
        height: sizeWebcamMlcards,
    };


    function parseTime(date) {
        //return moment(date).format("LLL");
    }

    function closeDialog() {
        const modal = document.querySelector("#item_dialog");
        modal.close();
        window.dialogOpenValue = !window.dialogOpenValue;
    }

    // //TimeLine func
    function getMarkersForWeb() {
        let violationMarkupForLine = [];

        for (let i in markup.result) {
            let date = new Date(0);
            date.setSeconds(markup.result[i].start_time); // specify value for SECONDS here
            let timeStart = date.toISOString().substr(11, 8);
            date.setSeconds(markup.result[i].end_time); // specify value for SECONDS here
            let timeEnd = date.toISOString().substr(11, 8);
            timeStart = timeStart.split(":");
            timeEnd = timeEnd.split(":");


            let violationWeb = '';
            for (let j in markup.result[i].anomalies) {
                if (markup.result[i].anomalies[j]) {
                    violationWeb += ` ${j}`;
                }
            }
            violationMarkupForLine.push(
                {
                    violation: i % 2 === 0 ? CAMERA_SOUND_VIOLATION : CHEATING_VIOLATION,
                    currentViolation: violationWeb,
                    source: {
                        value: set(startOfToday(), {
                            hours: timeStart[0],
                            minutes: timeStart[1],
                            seconds: timeStart[2]
                        })
                    },
                    target: {value: set(startOfToday(), {hours: timeEnd[0], minutes: timeEnd[1], seconds: timeEnd[2]})}
                }
            );
        }


        return violationMarkupForLine;
    }

    // function getMarkersForScreen() {
    //     let violationMarkupForLine = [];

    //     for (let i in screenCastMarkup.result) {
    //         let date = new Date(0);
    //         date.setSeconds(screenCastMarkup.result[i].start_time); // specify value for SECONDS here
    //         let timeStart = date.toISOString().substr(11, 8);
    //         date.setSeconds(screenCastMarkup.result[i].end_time); // specify value for SECONDS here
    //         let timeEnd = date.toISOString().substr(11, 8);
    //         timeStart = timeStart.split(":");
    //         timeEnd = timeEnd.split(":");


    //         let violationWeb = '';
    //         for(let j in screenCastMarkup.result[i].warn) {
    //             violationWeb += ` ${screenCastMarkup.result[i].warn[j]}`;
    //         }
    //         violationMarkupForLine.push(
    //             {
    //                 violation: i % 2 === 0 ? CAMERA_SOUND_VIOLATION : CHEATING_VIOLATION,
    //                 currentViolation: violationWeb,
    //                 source: {
    //                     value: set(startOfToday(), {
    //                         hours: timeStart[0],
    //                         minutes: timeStart[1],
    //                         seconds: timeStart[2]
    //                     })
    //                 },
    //                 target: {value: set(startOfToday(), {hours: timeEnd[0], minutes: timeEnd[1], seconds: timeEnd[2]})}
    //             }
    //         );
    //     }


    //     return violationMarkupForLine;
    // }


    function getCurrentTime() {
        return startOfToday();
    }

    function duratationToSec(time) {
        let seconds = 0;
        time = time.split(":");
        if (time.length !== 1) {
            if (time.length === 2) {
                time.unshift(0);
            }
            seconds = 3600 * time[0] + 60 * time[1] + time[2] / 1;
        }
        return seconds;
    }


    // function getTimeLineInterval() {
    //     const startTime = startOfToday();
    //     const endTime = set(startTime, {seconds: rowData && duratationToSec(rowData["webcamDuration"])});
    //     return [startTime, endTime];
    // }

    // //end Time line func

    function isStart(){
        return ((rowData && !(rowData["pressedStartButton"] === "Нет")));
    }
    function logDelta({name, id, delta}) {
        console.log(`Watch: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    const start = true;////////////////////////////////////////////nooooooooooooooooooo
    return (
        <Box sx={{ height: '100vh'}}>
            <dialog id="item_dialog">
                <img id="image_dialog_markup" src=""/>
                <Button onClick={closeDialog}>Закрыть </Button>
            </dialog>
            <Box sx={{margin: '20px 0px 20px 50px'}}>
                <NavStruct/>
            </Box>
            <Box sx={{bgcolor: 'background.paper', borderRadius: '20px', width: '80vw', marginLeft: '50px'}}>
                <Typography variant="h5" color="text.primary" sx={{padding: '20px 0px 0px 20px'}}>{rowData && rowData["full_name"]}</Typography>
                <Table sx={{width: '75vw', margin: '30px'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{t("Начало сессии")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{t("Окончание сессии")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{textAlign: 'center'}}>{t("Дата и время")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{timeInfo.start}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{timeInfo.end}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{t("Скринкаст")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{t("Веб-камера")}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{textAlign: 'center'}}>{t("Статус перекодирования")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{rowData && rowData["encode"]["screencastStatus"]}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{rowData && rowData["encode"]["webcamStatus"]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{textAlign: 'center'}}>{t("Длительность")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{rowData && rowData["encode"]["screencastDuration"]}сек.</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{rowData && rowData["encode"]["webcamDuration"]}сек.</TableCell>
                        </TableRow>
                        {start && <TableRow>
                            <TableCell sx={{textAlign: 'center'}}>{t("Ссылка на первоначальные видео")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}><Link href= {weblink}> Камера </Link></TableCell>
                            <TableCell sx={{textAlign: 'center'}}><Link href= {screenlink}> Экран </Link></TableCell>
                        </TableRow>}
                        {start && <TableRow>
                            <TableCell sx={{textAlign: 'center'}}>{t("Ссылки на видео с ползунком")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}><Link href= {weblinkrec}> Камера </Link></TableCell>
                            <TableCell sx={{textAlign: 'center'}}><Link href= {screenlinkrec}> Экран </Link></TableCell>
                        </TableRow>}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{t("Отправка")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{t("Проверка")}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{textAlign: 'center'}}>{t("Дата и время")}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{rowData && parseTime(rowData["dateSendInQueue"])}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{rowData && parseTime(rowData["endDateSendInQueue"])}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {/* {rowData && (rowData["presenceWebcamAndMicrophone"] === true ? <></> : */}
                    <Box sx={{marginLeft: '30px'}}>
                        <SummaryDataMarkup rowData={rowData}/>
                    </Box>
                {/* )} */}
                {start &&<Button onClick={getImages} variant="contained" sx={{margin: '20px 0px 0px 30px'}}>Генерировать изображения с нарушениями</Button>}
                <Box>
                    <div id={"presenceWebcam"}>
                        <Row>
                            <Col>
                                <Box sx={{margin: '30px 0px 0px 30px'}}>
                                    <div id={"webcamCol"}>
                                        {/* {start && <VideoApp {...webcamJsOptions} pureMarkup={markup} violationTime={violationWeb}/>} */}
                                        {!start && <h1 style={{display: "flex", justifyContent: "center", border: "1px solid", height: "12em", alignItems: "center",background: "rgba(0,0,0, 0.1)"}}><p>Студент не начал запись</p></h1>}
                                    </div>
                                    {/* {(rowData && rowData["webcamDuration"]) && markup.result &&
                                        <Timeline
                                            context={{componentParent: this}}
                                            markers={getMarkersForWeb()}
                                            value={getCurrentTime()}
                                            ref={timelineRef}
                                            timelineInterval={getTimeLineInterval()}
                                            setViolation={setTimeWeb}
                                        />
                                    } */}  
                                </Box>
                            </Col>
                            <Col xs="6" md="2">
                                {/* {markup.result &&
                                    <h2 style={webcamMlCardsStyle}>
                                        <EventScale markup={markup} setViolation={setTimeWeb} token={token}/>
                                    </h2>
                                } */}
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col>
                            <Box sx={{margin: '30px 0px 0px 30px'}}>
                                {/* <div id={"screenCol"}>
                                {start && <VideoApp {...windowJsOptions} pureMarkup={markup} violationTime={violationScreen}/>}
                                </div> */}
                                {/* {(rowData && rowData["webcamDuration"]) && screenCastMarkup.result &&
                                    <Timeline
                                        context={{componentParent: this}}
                                        markers={getMarkersForScreen()}
                                        value={getCurrentTime()}
                                        ref={timelineRef}
                                        timelineInterval={getTimeLineInterval()}
                                        setViolation={setTimeScreen}
                                    />
                                } */}
                            </Box>
                        </Col>
                        <Col xs="6" md="2">
                            {/* {screenCastMarkup.result &&
                                <h2 style={screenMlCardsStyle}>
                                    <EventScaleScreen screenCastMarkup={screenCastMarkup} setViolation={setTimeScreen}
                                                        token={token}/>
                                </h2>
                            } */}
                        </Col>
                    </Row>
                    {start && linkForVideo()}
                </Box>
            </Box>
            <Box sx={{margin: '30px 0px 0px 50px'}}>
                <SuspiciousApp />
            </Box>
        </Box>
    ); 
}
