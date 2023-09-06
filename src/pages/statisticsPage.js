import React, {useEffect, useState} from "react";
import {Container, Jumbotron} from "react-bootstrap";
import {Link} from "react-router-dom";
import {host, socket} from "../libs/webRTC";
import axios from "axios";
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment';
import filterFactory, {dateFilter} from '../libs/filter/index';

export default function Statistic(props) {
    const [db, setDataDb] = useState([]);
    // moment.lang('ru');

    useEffect(() => {
        axios
            .get(`${host}/failed/sessions/`)
            .then(res => {
                console.log(`${host}/failed/sessions/`);
                console.log(res.data);
                setDataDb(res.data);
            })
            .catch(err => {
                console.log('err in failedStudent data', err);
            });
    }, []);

    const columns =[
        { text: 'Токен', dataField: 'id', sort: true,
            formatter:(cell, row, rowIndex, extraData) =>
                (<div class="table-cell"><Link to= {row['link']} > {cell} </Link></div>),
            headerStyle: (colum, colIndex) => {
                return { width: '10%', textAlign: 'center', cursor: "pointer",
                position: 'sticky', top: '0', backgroundColor: "white"};
            },
        },
        { text: 'ФИО студента', dataField: 'name', sort: true,
            formatter:(cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{cell}</div>),
            headerStyle: (colum, colIndex) => {
                return { width: '10%', textAlign: 'center', cursor: "pointer",
                position: 'sticky', top: '0', backgroundColor: "white"};
            },
        },
        { text: 'Начало сессии', dataField: 'start', sort: true,
            formatter:(cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{moment(cell).format('DD.MM.YY h:mm:ss a')}</div>),
            headerStyle: (colum, colIndex) => {
                return { width: '10%', textAlign: 'center', cursor: "pointer",
                position: 'sticky', top: '0', backgroundColor: "white"};
            }
        },
        { text: 'Конец сессии', dataField: 'end', sort: true,
            formatter:(cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{moment(cell).format('DD.MM.YY h:mm:ss a')}</div>),
            headerStyle: (colum, colIndex) => {
                return { width: '10%', textAlign: 'center', cursor: "pointer",
                position: 'sticky', top: '0', backgroundColor: "white"};
            }
        },
        { text: 'Нажимал на кнопку "Начать запись"', dataField: 'startButton',sort: true,
            formatter:(cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{cell}</div>),
            headerStyle: (colum, colIndex) => {
                return { width: '10%', textAlign: 'center', cursor: "pointer",
                position: 'sticky', top: '0', backgroundColor: "white"};
            }
        },
        { text: 'Ошибка kurento', dataField: 'kurentoFailed',sort: true,
            formatter:(cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{cell}</div>),
            headerStyle: (colum, colIndex) => {
                return { width: '10%', textAlign: 'center', cursor: "pointer",
                position: 'sticky', top: '0', backgroundColor: "white"};
            },
        },
        { text: 'Количество нажатий на кнопку', dataField: 'countButton', sort: true,
            formatter:(cell, row, rowIndex, extraData) =>
                (<div class="table-cell">{cell}</div>),
            headerStyle: (colum, colIndex) => {
                return { width: '10%', textAlign: 'center', cursor: "pointer",
                position: 'sticky', top: '0', backgroundColor: "white"};
            },
        }];
      
    
        function stat(){
            let countUnpressedPressedButton = 0;
            let countBiggerThan1 = 0;
            db.forEach(elem => {
                if(elem["startButton"] === "Нет"){
                    ++countUnpressedPressedButton;
                }
                if(elem["kurentoFailed"] === "Да"){
                    ++countBiggerThan1;
                }
            });
            let buttonСlickPercentage = countUnpressedPressedButton/db.length * 100;
            let sessionFailedPercentage = countBiggerThan1/db.length * 100;
        return(
            <div>
                <div>Количество сессий: {db.length}</div>
                <div>Количество сессий где не была нажата кнопка: {countUnpressedPressedButton}</div>
                <div>Процент сессий где не была нажата кнопка: {buttonСlickPercentage.toFixed(2)}%</div>
                <div>Неудачных сессий: {countBiggerThan1}</div>
                <div>Процент неудачных сессий: {sessionFailedPercentage.toFixed(2)}%</div>
            </div>
        );}

        function synchronize(){
                axios.get(`${host}/failed/sessions/synchronize`).then((res)=>{
                    
                    alert(res.data);
                    window.location.reload();
                }).catch((error) =>{
                    alert(`Error!\n${error}`);
                });
        }

    return (<Jumbotron fluid>
                <Container>
                    <h1>Статистика</h1>
                    <p>{stat()}</p>
                    <button className="btn btn-lg btn-primary" onClick={synchronize}>Синхронизировать</button>
                    <BootstrapTable data={db} keyField='id' columns={columns} sort={({dataField:"start",order:"desc"})}/>
                </Container>
            </Jumbotron>
            );  
}

