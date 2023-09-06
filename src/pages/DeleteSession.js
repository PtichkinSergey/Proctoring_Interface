import React, {useState, useContext, useEffect} from "react";
import axios from "axios";
import {host} from "../libs/webRTC";
import {Container, Jumbotron, Button} from "react-bootstrap";
import '../styles/DeleteSession.css';
import fronLogger from "../libs/logger";

import StudentsTable from "../components/studentslist/StudentsTable";

let tableData = [];
let lengthDB = 0;
let timeout = null;
let intervalID;

function delete_from_bd() {
    let sessionsToDelete = [];
    let token = document.getElementById("token").value;
    fronLogger(token, "Удалена сессия", "ok", "DeleteSession.js");
    sessionsToDelete.push(token);
    axios.post(`${host}/service/token/delete`, [sessionsToDelete])
        .then(res=>{
            alert(`Удалена сессия: ${res.data["tokens"].toString()}`);
            document.getElementById("token").value = "";
        });
}

export function delete_by_token(token){
    let sessionsToDelete = [];
    if (window.confirm(`Вы уверены что хотите удалить сессию с токеном - ${token} ?`)) {
        sessionsToDelete.push(token);
        fronLogger(token, "Добавлен в список удаления", "ok", "DeleteSession.js");
        axios.post(`${host}/service/token/delete`, [sessionsToDelete])
            .then(res=>{
                alert(`Удалена сессия: ${res.data["tokens"].toString()}`);
                fronLogger(token, "Удалена сессия", "ok", "DeleteSession.js");
                document.getElementById("token").value = "";
                window.location.reload();
            });
    }
}


async function deleteNotSentSessions() {
    let sessionsToDelete = [];
    try {
        const res = await axios.get(`${host}/studentData/`);
        for (let i = 0; i < res.data.length; i++) {
            if (res.data[i]["state"] === "Не отправлено") {
                sessionsToDelete.push(res.data[i]["_id"]);
            }
        }
    } catch (err) {
        console.log(err);
        fronLogger(err, "error", "DeleteSession.js");
    }

    try {
        await axios.post(`${host}/service/token/delete`, [sessionsToDelete])
            .then(res => {
                alert(`Удалены ${sessionsToDelete.length} сессий. Сессии: ${sessionsToDelete}`);
                fronLogger(0, "Удалены" + sessionsToDelete, "ok", "DeleteSession.js");
            });
    } catch (err) {
        console.log(err);
        fronLogger(err, "error", "DeleteSession.js");
    }
}

function deleteRoom() {
    let token = document.getElementById("token").value;
    axios.get(`${host}/service/token/delete/${token}`).then(res=>{
        alert(`Удалена сессия: ${res.data["tokens"].toString()}`);
        fronLogger(token, "Удалена комната", "ok", "DeleteSession.js");
        document.getElementById("token").value = "";
    });
}



export function getDataTable(data){
    fronLogger(0, "Проверка списка сессий для удаления - пришел из запроса" + data, "ok", "DeleteSession.js"); //ToDo: fix it
    tableData = data;
    fronLogger(0, "Проверка списка сессий для удаления" + tableData, "ok", "DeleteSession.js"); //ToDo: fix it
    return tableData;
}

function TimerAndDeleteButton(){
    const [isDelete, setIsDelete]= useState(false);
    const [timer, setTimer]= useState(0);
    let showDeleteButton = true;
    const delete_all_sessions_in_table = async () =>{
        if(timeout === null){
            if(tableData.length === lengthDB){
                alert("Нельзя удалить всю базу данных сессий!\n");
                fronLogger(0, "Пользователь пытался удалить всю базу данных", "warning", "DeleteSession.js");
                return;
            }
            let arrForDelete = tableData;
            fronLogger(0, "Составлен список сессий для удаления по кнопке" + arrForDelete, "ok", "DeleteSession.js");
            if(window.confirm(` Вы хотите удалить все отфильтрованные сессии?\n Количество сессий которые будут удалены - ${arrForDelete.length}`)){
                await setIsDelete(true);
                let t =0;
                setTimer(0);
                showDeleteButton = false;
                intervalID = setInterval(() => {
                    if(t !== 11){
                        t += 1;
                        setTimer(t);
                        setIsDelete(true);
                    }

                }, 1000);
                timeout = setTimeout(() =>{
                    setIsDelete(false);
                    let sessionsToDelete = [];
                    for(let i in arrForDelete){
                        sessionsToDelete.push(arrForDelete[i]._id);
                        fronLogger(arrForDelete[i]._id, "Сессия удалена!", "info", "DeleteSession.js");
                    }

                    console.log("ses: ",sessionsToDelete);
                    axios.post(`${host}/service/token/delete`, [sessionsToDelete])
                        .then(res=>{
                            alert(`Удалено ${arrForDelete.length} сессии`);
                            window.location.reload();
                        });

                    clearInterval(intervalID);
                    clearTimeout(timeout);
                    timeout = null;
                }, 11000);
            }
        }else{
            alert("Идёт удаление сессий!");
        }
    };

    const stopDelete = () =>{
        setIsDelete(false);
        clearInterval(intervalID);
        clearTimeout(timeout);
        timeout = null;
    };

    const showDialogToCancelDelete = () => {
        return(
            <div style={{display:"flex",
                flexDirection: "column",
                alignItems: "center"}}>
                <p style={{background: "palegoldenrod",
                    borderRadius: "6px",
                    padding: "8px"}}>
                    Отменить удаление можно в течение 10 секунд - {timer}
                </p>
                <div>
                    <Button onClick={stopDelete}>Не удалять</Button>
                </div>
            </div>
        );
    }

    return(
        <div style={{display:"flex",
            alignItems: "flex-end",
            flexDirection: "column",
            margin: "22px"}}>
            {isDelete && showDialogToCancelDelete()}
            {!isDelete && (timeout === null) && <Button variant={"danger"} onClick={delete_all_sessions_in_table}>Удалить данные из таблицы ниже</Button>}
        </div>
    );
}



export default function DeleteSession(props) {
    const [rowData, setRawData] = useState([]);
    const [lengthRowData, setlengthRowData]= useState(0);


    useEffect(() => {
        axios.get(`${host}/studentData/`).then(res => {
            for(let i in res.data){
                res.data[i]['encode'] = `${res.data[i]['encode'].screencastStatus}/${res.data[i]['encode'].webcamStatus}`;
            }

            setRawData(res.data);
            setlengthRowData(res.data.length);
        }).catch(err => {
            fronLogger(err, "error", "DeleteSession.js");
        });
    }, []);

    lengthDB = lengthRowData;

    return (
        <div>
            <Jumbotron>
                <Container>
                    <input type="text" placeholder="Type token..." id="token"/>
                    <Button className="session_delete"  onClick={() => delete_from_bd()} >
                        Удалить сессию
                    </Button>
                    <Button className="notsended_delete" onClick={() => deleteNotSentSessions()} >
                        Удалить неотправленные сессии
                    </Button>
                    <Button className="room_delete" onClick={() => deleteRoom()} >
                        Удалить комнату
                    </Button>
                </Container>
                <Container>
                </Container>
            </Jumbotron>
            <TimerAndDeleteButton/>
            <Container fluid>
                <StudentsTable rowData={rowData} mode={5}/>
            </Container>
        </div>
    );
}
