import React, {useState, useEffect} from "react";
import {Container, Jumbotron, Button} from "react-bootstrap";
import axios from "axios";
import {host} from "../libs/webRTC";
import AdminsTable from "../components/studentslist/AdminsTable";

function deleteAdminFromBd() {
    console.log("delete", document.getElementById("email").value);
    axios.post(`${host}/usersdb`, ["delete", document.getElementById("email").value]).then(res => {
        alert(res.data);
        window.location.reload();
    });
}

function addInDbAsAdmin() {
    console.log("add", document.getElementById("email").value)
    axios.post(`${host}/usersdb`, ["add", document.getElementById("email").value]).then(res => {
        alert(res.data);
        window.location.reload();
    });
}

export default function Admin(props) {

    const [rowData, setRawData] = useState([]);
    console.log(props);

    useEffect(() => {
        axios.post(`${host}/usersdb`, ["get"]).then(res => {
            setRawData(res.data);
        });
    }, []);

    return (
        <div>
            <Jumbotron>
                <Container>
                    <text>
                        Управление правами доступа
                    </text>
                    <input type="text" placeholder="Type something..." id="email"/>
                    <Button onClick={() => addInDbAsAdmin()}>
                        Добавить
                    </Button>
                    <Button onClick={() => deleteAdminFromBd()}>
                        Удалить
                    </Button>
                </Container>
                <Container>
                </Container>
                <AdminsTable rowData={rowData}/>
            </Jumbotron>
        </div>
    );
}
        

