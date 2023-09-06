import React, { useState, useEffect } from "react";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
import StudentsTable from "../components/studentslist/StudentsTable";
import { Container, Button } from "react-bootstrap";
import axios from "axios";
import { host } from "../libs/webRTC";
import fronLogger from "../libs/logger";
import Modal from 'react-bootstrap/Modal';
import BootstrapTable from 'react-bootstrap-table-next';

function MyVerticallyCenteredModal(props) {

    const columnDefs = [
        {
            text: 'ФИО студента', dataField: 'full_name', sort: true,
            formatter: (cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{cell}</div>),
            headerStyle: (colum, colIndex) => {
                return {
                    width: '10%', textAlign: 'center', cursor: "pointer",
                    position: 'sticky', top: '0', backgroundColor: "white"
                };
            }
        },
        {
            text: 'Отсутсвует в кадре', dataField: 'isAbsent', sort: true, headerStyle: (colum, colIndex) => {
                return {
                    width: '5%', textAlign: 'center', cursor: "pointer",
                    position: 'sticky', top: '0', backgroundColor: "white",
                };
            }, formatter: (cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{cell}</div>),

        },

        {
            text: 'Посторонние в кадре', dataField: 'outsidersInTheFrame', sort: true, headerStyle: (colum, colIndex) => {
                return {
                    width: '5%', textAlign: 'center', cursor: "pointer",
                    position: 'sticky', top: '0', backgroundColor: "white",
                };
            }, formatter: (cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{cell}</div>),
        },

        {
            text: 'Не смотрел в монитор', dataField: 'isNotWatched', sort: true, headerStyle: (colum, colIndex) => {
                return {
                    width: '5%', textAlign: 'center', cursor: "pointer",
                    position: 'sticky', top: '0', backgroundColor: "white",
                };
            }, formatter: (cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{cell}</div>),
        },

    ];

    let rowData = [props.rowData];

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div>Нарушения веб-камеры</div>
                        <img src={rowData[0]["statusWebViolations"]} alt='image' width={"4%"} height={"4%"} style={{ marginLeft: "32px" }} />
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <BootstrapTable striped hover
                    keyField='ФИО студента'
                    data={rowData}
                    columns={columnDefs}
                >

                </BootstrapTable>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

function InfoDialog(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div>Информация по иконкам</div>
                        <img src="/pic/info.png" alt='image' width={"4%"} height={"4%"} style={{ marginLeft: "32px" }} />
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>
                        <img src={endWitOutViolation} alt='image' width={"4%"} height={"4%"} style={{ margin: "16px" }} />
                        - Нарушений нет ИЛИ Обработка видео завершена без ошибок<br />
                        <img src={endWithViolation} alt='image' width={"4%"} height={"4%"} style={{ margin: "16px" }} />
                        - Нарушения на видео обнаружены<br />
                        <img src={notStart} alt='image' width={"4%"} height={"4%"} style={{ margin: "16px" }} />
                        - Видео не будет обработано из-за ошибок<br />
                        <img src={procecingGif} alt='image' width={"4%"} height={"4%"} style={{ margin: "16px" }} />
                        - Идет поиск нарушений<br />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
}

const procecingGif = "/pic/progress.png";
const endWithViolation = "/pic/warning.png";
const endWitOutViolation = "/pic/check.png";
const notStart = "/pic/cross.png";
const infoPic = "/pic/info.png";

const selectStatusWebViolations = [
    { value: procecingGif, label: 'Еще не обработалось' },
    { value: endWitOutViolation, label: 'Нет нарушений' },
    { value: endWithViolation, label: 'Есть нарушения' },
    { value: notStart, label: 'Не обработалось' }
];

const selectProcessingStatus = [
    { value: endWitOutViolation, label: 'Готово' },
    { value: procecingGif, label: 'Отправлено в очередь' },
    { value: notStart, label: 'Не отправлено' }
];

export default function SimplifiedTable(props) {
    const [rowData, setRawData] = useState([]); // data of student
    // const [imageForWeb, setImageForWeb] = useState(0);
    const [openDialog, setOpenDialog] = useState(false); // should we open modal window
    const [rowIndex, setRowIndex] = useState(); //The index of the current row clicked on
    const [openInfoDialog, setOpenInfoDialog] = useState(false);

    const changeStateHandler = (index) => {
        setOpenDialog(!openDialog);
        setRowIndex(index);
    }

    useEffect(() => {
        axios.get(`${host}/studentData/`).then(res => {
            let data = res.data;
            let status = 0;
            let processingStatus = 0;
            // status = 0 - Not in quue. = 1 - No violation. = 2 - There are violations. 3 = in processing 
            for (let i in data) {
                let current = data[i];
                if (current["state"] === "Готово" &&
                    (current["isAbsent"] === '-' &&
                        current["isNotWatched"] === '-' &&
                        current["outsidersInTheFrame"] === '-')) status = endWitOutViolation;
                else if (current["state"] === "Отправлено в очередь") status = procecingGif;
                else if (current["state"] === "Готово") status = endWithViolation;
                else status = notStart;

                if(current["state"] === "Готово") processingStatus = endWitOutViolation;
                else if(current["state"] === "Не отправлено") processingStatus = notStart;
                else processingStatus = procecingGif;


                current['processingStatus'] = processingStatus;
                current['statusWebViolations'] = status;
            }

            setRawData(data);

        }).catch(err => {
            console.log('Error response in simplifiedTable,', err);
            fronLogger(err, "error", "SimplifiedTable.js");
        });
    }, []);
    function logDelta({name, id, delta}) {
        console.log(`SimplifiedTable: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    return (
        <div>
            {openDialog &&
                <div>
                    <MyVerticallyCenteredModal
                        show={openDialog}
                        onHide={() => setOpenDialog(false)}
                        rowData={rowData[(rowData.length - 1) - rowIndex]}
                    />
                </div>}
            <img src={infoPic} width={"32px"} height={"32px"} onClick={() => setOpenInfoDialog(true)} style={{display:"block", margin:"10px 10px 10px auto"}} />
            {openInfoDialog &&
                <div>
                    <InfoDialog
                        show={openInfoDialog}
                        onHide={() => setOpenInfoDialog(false)}
                    />
                </div>}
            <Container fluid>
                <StudentsTable rowData={rowData} mode={6} changeStateHandler={changeStateHandler} selectOptions={[selectStatusWebViolations,selectProcessingStatus]} />
            </Container>
        </div>
    );
}