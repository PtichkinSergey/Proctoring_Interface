import React from "react";
import { useNavigate } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Button, Box, Link } from "@mui/material";
import filterFactory, { dateFilter, textFilter, selectFilter, timeFilter, Comparator } from '../../libs/filter/index';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import moment from 'moment';
import './StudentsTable.css';
import { useState/*, useEffect*/ } from "react";
import queryString from "query-string";
import { getDataTable, delete_by_token } from "../../pages/DeleteSession";
import { host } from "../../libs/webRTC";
import axios from "axios";
import NavStruct from "../NavStruct";

function templateColumnContent(text, dataField, sort, width, format, filter){
    const header = {
        textAlign: 'center', 
        cursor: "pointer",
        position: 'sticky', 
        top: '0', 
        backgroundColor: "#CCCCCC"
    }
    return {
        text: text,
        dataField: dataField,
        sort: sort,
        headerStyle: () => {
            return {width: width, ...header};
        },
        formatter:(cell, row, rowIndex, extraData) => {
            return format(cell, row, rowIndex, extraData);
        },
        filter: filter
    }
}

function generateLogTable(){
    const divCell = (cell) => <div class="table-cell">{cell}</div>
    const dateCell = (cell) => <div class="table-cell">{moment(cell).format('DD.MM.YY')}</div>
    return [
        templateColumnContent('Токен', '_id', true, '6%', divCell),
        templateColumnContent('Сообщение', 'message', true, '10%', divCell),
        templateColumnContent('файл', 'source', true, '6%', divCell),
        templateColumnContent('Дата', 'date', true, '8%', dateCell),
        templateColumnContent('тип ошибки', 'type', true, '6%', divCell),
        templateColumnContent('источник', 'device', true, '6%', divCell)
    ];
}


function generateRoomsTable() {
    const LinkCell = (cell, row) => <div class="table-cell"><Link href={row['link']}> {cell} </Link></div>;
    const divCell = (cell) => <div class="table-cell">{cell}</div>
    const dateCell = (cell) => <div class="table-cell">{moment(cell).format('DD.MM.YY')}</div>
    return [
        templateColumnContent('Название', 'title', true, '4%', LinkCell, textFilter({getFilter: (filter) => {titleFilter = filter;}})),
        templateColumnContent('Токен', '_id', true, '6%', divCell, textFilter({getFilter: (filter) => {tokenFilter = filter;}})),
        templateColumnContent('Преподаватель', 'teacher', true, '10%', divCell, textFilter({getFilter: (filter) => {nameFilter = filter;}})),
        templateColumnContent('Предмет', 'subject', true, '6%', divCell, selectFilter({options: subjectOptions, getFilter: (filter) => {subjectFilter = filter;}})), 
        templateColumnContent('Дата', 'date', true, '8%', dateCell, dateFilter({getFilter: (filter) => {dataFilter = filter;}})),
        templateColumnContent('Длительность', 'duration', true, '6%', divCell, selectFilter({options: subjectOptions, getFilter: (filter) => {subjectFilter = filter;}})),
    ];
}

function generateTable() {
    const LinkCell = (cell, row) => <div class="table-cell"><Link href={row['link']}> {cell} </Link></div>;
    const divCell = (cell) => <div class="table-cell">{cell}</div>
    const dateCell = (cell) => <div class="table-cell">{moment(cell).format('DD.MM.YY')}</div>
    const timeCell = (cell) => <div class="table-cell">{moment(cell).format('HH:mm:ss')}</div>
    const encodeCell = (cell) => <div class="table-cell">
        скринкаст<br></br>
        статус: {cell.screencastStatus}<br></br>
        длительность: {cell.screencastDuration}с<br></br>
        вебкамера<br></br>
        статус: {cell.webcamStatus}<br></br>
        длительность: {cell.webcamDuration}с<br></br>
    </div>
    return [
        templateColumnContent('ФИО студента', 'full_name', true, '10%', LinkCell, textFilter({getFilter: (filter) => {nameFilter = filter;}})),
        templateColumnContent('Токен', '_id', true, '6%', divCell, textFilter({getFilter: (filter) => {tokenFilter = filter;}})),
        templateColumnContent('Группа', 'group', true, '4%', divCell, textFilter({getFilter: (filter) => {groupFilter = filter;}})),
        templateColumnContent('Дата', 'date', true, '8%', dateCell, dateFilter({getFilter: (filter) => {dataFilter = filter;}})),
        templateColumnContent('Время (Moscow Standard Time)', 'time', true, '8%', timeCell, timeFilter({getFilter: (filter) => {timerFilter = filter;}})),
        templateColumnContent('Длительность веб-камеры', 'webcamDuration', true, '5%', divCell, textFilter({getFilter: (filter) => {webcamDurationFilter = filter;}})),
        templateColumnContent('Длительность скринкаста', 'screenDuration', true, '5%', divCell, textFilter({getFilter: (filter) => {screenDurationFilter = filter;}})),
        templateColumnContent('Отсутсвует в кадре', 'isAbsent', true, '5%', divCell, textFilter({getFilter: (filter) => {absentFilter = filter;}})),
        templateColumnContent('Посторонние в кадре', 'outsidersInTheFrame', true, '5%', divCell, textFilter({getFilter: (filter) => {anotherHumanFilter = filter;}})),
        templateColumnContent('Не смотрел в монитор', 'isNotWatched', true, '5%', divCell, textFilter({getFilter: (filter) => {notLookFilter = filter;}})),
        templateColumnContent('Подозрительное приложение', 'suspiciousApp', true, '7%', divCell, textFilter({getFilter: (filter) => {suspiciousAppFilter = filter;}})),
        templateColumnContent('Статус обработки', 'state', true, '5%', divCell, selectFilter({options: selectOptions, comparator: Comparator.LIKE, getFilter: (filter) => {stateFilter = filter;}})),
        templateColumnContent('Статус перекодировки', 'encode', true, '8%', encodeCell),
        templateColumnContent('Нажимал на кнопку "Начать запись"', 'pressedStartButton', true, '6%', divCell, 
            selectFilter({options: pressedStartButtonOptions, comparator: Comparator.LIKE, getFilter: (filter) => {pressedStartButtonFilter = filter;}})),
        templateColumnContent('Завершена ли запись', 'pressedEndButton', true, '6%', divCell, 
            selectFilter({options: pressedEndOptions, comparator: Comparator.LIKE, getFilter: (filter) => {pressedEndButtonFilter = filter;}})),
        templateColumnContent('Ошибка kurento', 'kurentoFailed', true, '10%', divCell, 
            selectFilter({options: pressedStartButtonOptions, comparator: Comparator.LIKE, getFilter: (filter) => {kurentoFailedFilter = filter;}}))
    ];
}


function generateFullTable() {
    const LinkCell = (cell, row) => <div class="table-cell"><Link href={row['link']}> {cell} </Link></div>;
    const divCell = (cell) => <div class="table-cell">{cell}</div>
    const dateCell = (cell) => <div class="table-cell">{moment(cell).format('DD.MM.YY')}</div>
    const timeCell = (cell) => <div class="table-cell">{moment(cell).format('HH:mm:ss')}</div>
    const encodeCell = (cell) => <div class="table-cell">
        скринкаст<br></br>
        статус: {cell.screencastStatus}<br></br>
        длительность: {cell.screencastDuration}с<br></br>
        вебкамера<br></br>
        статус: {cell.webcamStatus}<br></br>
        длительность: {cell.webcamDuration}с<br></br>
    </div>
    return [
        templateColumnContent('ФИО студента', 'full_name', true, '10%', LinkCell, textFilter({getFilter: (filter) => {nameFilter = filter;}})),
        templateColumnContent('Токен', '_id', true, '6%', divCell, textFilter({getFilter: (filter) => {tokenFilter = filter;}})),
        templateColumnContent('Группа', 'group', true, '4%', divCell, textFilter({getFilter: (filter) => {groupFilter = filter;}})),
        templateColumnContent('Комната', 'room', true, '4%', divCell, textFilter({getFilter: (filter) => {roomFilter = filter;}})),
        templateColumnContent('Предмет', 'subject', true, '6%', divCell, selectFilter({options: subjectOptions, getFilter: (filter) => {subjectFilter = filter;}})),
        templateColumnContent('Название', 'title', true, '4%', divCell, textFilter({getFilter: (filter) => {titleFilter = filter;}})),
        templateColumnContent('Дата', 'date', true, '8%', dateCell, dateFilter({getFilter: (filter) => {dataFilter = filter;}})),
        templateColumnContent('Время (Moscow Standard Time)', 'time', true, '8%', timeCell, timeFilter({getFilter: (filter) => {timerFilter = filter;}})),
        templateColumnContent('Длительность веб-камеры', 'webcamDuration', true, '5%', divCell, textFilter({getFilter: (filter) => {webcamDurationFilter = filter;}})),
        templateColumnContent('Длительность скринкаста', 'screenDuration', true, '5%', divCell, textFilter({getFilter: (filter) => {screenDurationFilter = filter;}})),
        templateColumnContent('Отсутсвует в кадре', 'isAbsent', true, '5%', divCell, textFilter({getFilter: (filter) => {absentFilter = filter;}})),
        templateColumnContent('Посторонние в кадре', 'outsidersInTheFrame', true, '5%', divCell, textFilter({getFilter: (filter) => {anotherHumanFilter = filter;}})),
        templateColumnContent('Не смотрел в монитор', 'isNotWatched', true, '5%', divCell, textFilter({getFilter: (filter) => {notLookFilter = filter;}})),
        templateColumnContent('Подозрительное приложение', 'suspiciousApp', true, '7%', divCell, textFilter({getFilter: (filter) => {suspiciousAppFilter = filter;}})),
        templateColumnContent('Статус обработки', 'state', true, '5%', divCell, selectFilter({options: selectOptions,comparator: Comparator.LIKE,
            getFilter: (filter) => {
                stateFilter = filter;
            }
        })),
        templateColumnContent('Статус перекодировки', 'encode', true, '8%', encodeCell),
        templateColumnContent('Нажимал на кнопку "Начать запись"', 'pressedStartButton', true, '6%', divCell, 
            selectFilter({options: pressedStartButtonOptions, comparator: Comparator.LIKE, getFilter: (filter) => {pressedStartButtonFilter = filter;}})),
        templateColumnContent('Завершена ли запись', 'pressedEndButton', true, '6%', divCell, 
            selectFilter({options: pressedEndOptions, comparator: Comparator.LIKE, getFilter: (filter) => {pressedEndButtonFilter = filter;}})),
        templateColumnContent('Ошибка kurento', 'kurentoFailed', true, '10%', divCell, 
            selectFilter({options: pressedStartButtonOptions, comparator: Comparator.LIKE, getFilter: (filter) => {kurentoFailedFilter = filter;}}))
    ];
}

function generateTableForDeletePage() {
    const LinkCell = (cell, row) => <div class="table-cell"><Link href={row['link']}> {cell} </Link></div>;
    const divCell = (cell) => <div class="table-cell">{cell}</div>
    const dateCell = (cell) => <div class="table-cell">{moment(cell).format('DD.MM.YY')}</div>
    const timeCell = (cell) => <div class="table-cell">{moment(cell).format('HH:mm:ss')}</div>
    const buttonCell = (cell, row) => <Button variant="contained" color="error" onClick={() => { sendTokenToDelete(row) }}>Delete</Button>
    return [
        templateColumnContent('ФИО студента', 'full_name', true, '8%', LinkCell, textFilter({getFilter: (filter) => {nameFilter = filter;}})),
        templateColumnContent('Токен', '_id', true, '12%', divCell, textFilter({getFilter: (filter) => {tokenFilter = filter;}})),
        templateColumnContent('Группа', 'group', true, '4%', divCell, textFilter({getFilter: (filter) => {groupFilter = filter;}})),
        templateColumnContent('Предмет', 'subject', true, '6%', divCell, selectFilter({options: subjectOptions, getFilter: (filter) => {subjectFilter = filter;}})),
        templateColumnContent('Название', 'title', true, '4%', divCell, textFilter({getFilter: (filter) => {titleFilter = filter;}})),
        templateColumnContent('Дата', 'date', true, '8%', dateCell, dateFilter({getFilter: (filter) => {dataFilter = filter;}})),
        templateColumnContent('Время (Moscow Standard Time)', 'time', true, '8%', timeCell, timeFilter({getFilter: (filter) => {timerFilter = filter;}})),
        templateColumnContent('Длительность веб-камеры', 'webcamDuration', true, '5%', divCell, textFilter({getFilter: (filter) => {webcamDurationFilter = filter;}})),
        templateColumnContent('Длительность скринкаста', 'screenDuration', true, '5%', divCell, textFilter({getFilter: (filter) => {screenDurationFilter = filter;}})),
        templateColumnContent('Статус обработки', 'state', true, '5%', divCell, selectFilter({options: selectOptions,comparator: Comparator.LIKE,
            getFilter: (filter) => {
                stateFilter = filter;
            }
        })),
        templateColumnContent('Нажимал на кнопку "Начать запись"', 'pressedStartButton', true, '6%', divCell, 
            selectFilter({options: pressedStartButtonOptions, comparator: Comparator.LIKE, getFilter: (filter) => {pressedStartButtonFilter = filter;}})),
        templateColumnContent('Завершена ли запись', 'pressedEndButton', true, '6%', divCell, 
            selectFilter({options: pressedEndOptions, comparator: Comparator.LIKE, getFilter: (filter) => {pressedEndButtonFilter = filter;}})),
        templateColumnContent('   ', '', true, '6%', buttonCell)
    ];
}

function generateSimplifiedTable(changeState, selectOptionsForWeb,selectProcessingStatus) {
    const LinkCell = (cell, row) => <div class="table-cell"><Link href={row['link']}> {cell} </Link></div>;
    const divCell = (cell) => <div class="table-cell">{cell}</div>
    const dateCell = (cell) => <div class="table-cell">{moment(cell).format('DD.MM.YY')}</div>
    const timeCell = (cell) => <div class="table-cell">{moment(cell).format('HH:mm:ss')}</div>
    const imgCell = (cell) => <img
        src={cell === 'Да' ? "/pic/check.png" : "/pic/cross.png"}
        alt='oops'
        width={"24px"}
        height={"24px"}
    />
    const header = {
        textAlign: 'center', 
        cursor: "pointer",
        position: 'sticky', 
        top: '0', 
        backgroundColor: "#CCCCCC"
    }
    return [
        templateColumnContent('ФИО студента', 'full_name', true, '10%', LinkCell, textFilter({getFilter: (filter) => {nameFilter = filter;}})),
        templateColumnContent('Группа', 'group', true, '4%', divCell, textFilter({getFilter: (filter) => {groupFilter = filter;}})),
        templateColumnContent('Предмет', 'subject', true, '6%', divCell, selectFilter({options: subjectOptions, getFilter: (filter) => {subjectFilter = filter;}})),
        templateColumnContent('Название', 'title', true, '4%', divCell, textFilter({getFilter: (filter) => {titleFilter = filter;}})),
        templateColumnContent('Дата', 'date', true, '8%', dateCell, dateFilter({getFilter: (filter) => {dataFilter = filter;}})),
        templateColumnContent('Время (Moscow Standard Time)', 'time', true, '8%', timeCell, timeFilter({getFilter: (filter) => {timerFilter = filter;}})),
        templateColumnContent('Нажимал на кнопку "Начать запись"', 'pressedStartButton', true, '6%', imgCell, 
            selectFilter({options: pressedStartButtonOptions, comparator: Comparator.LIKE, getFilter: (filter) => {pressedStartButtonFilter = filter;}})),
        templateColumnContent('Завершена ли запись', 'pressedEndButton', true, '6%', imgCell, 
            selectFilter({options: pressedEndOptions, comparator: Comparator.LIKE, getFilter: (filter) => {pressedEndButtonFilter = filter;}})),
        templateColumnContent('Длительность', 'screenDuration', true, '5%', divCell, textFilter({getFilter: (filter) => {screenDurationFilter = filter;}})),
        templateColumnContent('Статус обработки', 'state', true, '5%', divCell, selectFilter({options: selectOptions,comparator: Comparator.LIKE,
            getFilter: (filter) => {
                stateFilter = filter;
            }
        })),
        {
            text: 'Нарушения веб-камеры', dataField: 'statusWebViolations', sort: true, headerStyle: (colum, colIndex) => {
                return {width: '5%', ...header};
            }, formatter: (cell, row, rowIndex, extraData) => {
                return <img src={cell} alt='oops' width={"24px"} height={"24px"} />;
            },
            events: {
                onClick: (e, column, columnIndex, row, rowIndex) => { changeState(rowIndex); },
            },
            style: { cursor: "pointer", textAlign: 'center', position: 'sticky' },
            filter: selectFilter({
                options: selectOptionsForWeb,
                comparator: Comparator.LIKE,
                getFilter: (filter) => {
                    stateFilter = filter;
                }
            })
        },
        //ToDo: Обнаружен ли телефон, добавить в будущем
        templateColumnContent('Подозрительное приложение', 'suspiciousApp', true, '7%', divCell, textFilter({getFilter: (filter) => {suspiciousAppFilter = filter;}})),
        templateColumnContent('Все ли хорошо со стороны платформы?', 'kurentoFailed', true, '6%', imgCell, 
            selectFilter({options: pressedStartButtonOptions, comparator: Comparator.LIKE, getFilter: (filter) => {kurentoFailedFilter = filter;}}))
    ];
}


const selectOptions = [
    { value: "Готово", label: 'Готово' },
    { value: "Отправлено в очередь", label: 'Отправлено в очередь' },
    { value: "Не отправлено", label: 'Не отправлено' }
];
let subjectOptions = [];

const pressedStartButtonOptions = [
    { value: "Да", label: 'Да' },
    { value: "Нет", label: 'Нет' }
];

const pressedEndOptions = [
    { value: "Да", label: 'Yes' },
    { value: "Нет", label: 'No' }
];

const selectDuration = [
    { value: "0", label: '0' },
];

const handleClick = () => {
    nameFilter = '';
    tokenFilter = '';
    roomFilter = '';
    groupFilter = '';
    dataFilter = '';
    webcamDurationFilter = '';
    screenDurationFilter = '';
    notLookFilter = '';
    anotherHumanFilter = '';
    absentFilter = '';
    suspiciousAppFilter = '';
    stateFilter = '';
    statusWebViolationsFilter = '';
    encodeStatus = '';
    timerFilter = '';
    subjectFilter = '';
    titleFilter = '';
    pressedStartButtonFilter = '';
    pressedEndButtonFilter = '';
    kurentoFailedFilter = '';
    clearQueryStr();
};

let nameFilter;
let tokenFilter;
let groupFilter;
let dataFilter;
let timerFilter;
let webcamDurationFilter;
let screenDurationFilter;
let notLookFilter;
let anotherHumanFilter;
let absentFilter;
let suspiciousAppFilter;
let stateFilter;
let statusWebViolationsFilter;
let subjectFilter;
let encodeStatus;
let titleFilter;
let pressedStartButtonFilter;
let pressedEndButtonFilter;
let roomFilter;

let history;
let checkChanges = '';
let kurentoFailedFilter;
let arrForQueryString = {
    full_name:          "",
    roomFilter:         "",
    group:              "",
    subject:            "",
    date:               {date:"",comparator:""},
    time:               {date:"",comparator:""},
    webcamDuration:     "",
    screenDuration:     "",
    isAbsent:           "",
    outsidersInTheFrame:"",
    isNotWatched:       "",
    suspiciousApp:      "",
    state:              "",
    pressedStartButton: "",
    pressedEndButton:   "",
    kurentoFailed:      "",
};


function sendTokenToDelete(target) {
    console.log(target);
    delete_by_token(target._id);
}

function clearQueryStr() {
    for (let nameColumn in arrForQueryString) {
        if (nameColumn === "date" || nameColumn === "time") {
            arrForQueryString[nameColumn].date = "";
            arrForQueryString[nameColumn].comparator = "";
        } else arrForQueryString[nameColumn] = "";
    }
    console.log(window.location.pathname);
    history(window.location.pathname);
}
export function setQuerySettings() {
    //We read the url and create a filter from the query string
    let parsed = queryString.parse(window.location.search);
    let textFilterTemplate = {};
    for (let i in parsed) {
        if (i === "timeCOMP" || i === "dateCOMP") continue;
        if (i !== "" && i !== "time" && i !== "date") {
            //if this text and isn't empty
            textFilterTemplate[i] = {
                caseSensitive: false,
                comparator: "LIKE",
                filterType: "TEXT",
                filterVal: parsed[i]
            };
        } else if (i !== "" && parsed[(i + "COMP")] !== 'null' && parsed[i] !== 'null') {

            //delete msk from query
            if (i === 'time') {
                //Cuts the string at delimiters such as "*, GMT".
                //If both divisors are present then cut the string into 4 parts
                parsed[i] = parsed[i].split(/\*|GMT/);//regrex

                if (parsed[i].length === 4) {
                    parsed[i][1] = parsed[i][2];

                } else if (parsed[i].length === 2 && parsed[i][1]) {
                    if (parsed[i][1].includes('(')) {
                        parsed[i].pop();
                    }

                }
                textFilterTemplate[i] = {
                    caseSensitive: false,
                    comparator: "LIKE",
                    filterType: "TIME",
                    filterVal: {
                        date: parsed[i].length === 1 ? parsed[i][0] : { startTime: parsed[i][0], endTime: parsed[i][1] },//parsed[i].length === 1? parsed[i][0]:{start: parsed[i][0], end: parsed[i][2]},
                        comparator: parsed[(i + "COMP")],
                        queryTime: true
                    }
                };
            }

            //range date
            if (i === 'date') {
                parsed[i] = parsed[i].split("*");
                textFilterTemplate[i] = {
                    caseSensitive: false,
                    comparator: "LIKE",
                    filterType: "DATE",
                    filterVal: {
                        date: parsed[i].length === 1 ? parsed[i][0] : { start: parsed[i][0], end: parsed[i][1] },
                        comparator: parsed[(i + "COMP")],
                        queryDate: true
                    }

                };
            }
        }
    }
    return textFilterTemplate;
}

export function refreshQueryString(temp) {
    console.log("NameFil: ", nameFilter, "TimeFil: ", timerFilter);
    let queryString = "?";
    const filterState = { ...temp };
    let currentFilter;
    for (let nameColumn in arrForQueryString) {
        currentFilter = filterState[nameColumn];
        if (typeof currentFilter !== 'undefined') { //We check that a filter has been set for this column
            if (nameColumn !== 'date' && nameColumn !== 'time') {
                if (arrForQueryString[nameColumn] !== currentFilter.filterVal) {//if the filter has not been written yet, writing
                    arrForQueryString[nameColumn] = currentFilter.filterVal;
                    queryString += nameColumn + "=" + arrForQueryString[nameColumn] + "&";//+ nameColumn + "COMP="+currentFilter.comparator;
                } else {
                    queryString += nameColumn + "=" + arrForQueryString[nameColumn] + "&";
                }
            } else {
                if (arrForQueryString[nameColumn] !== currentFilter.filterVal.date) {
                    if (nameColumn === 'time') {
                        arrForQueryString[nameColumn].comparator = currentFilter.filterVal.comparator;

                        if (arrForQueryString[nameColumn].comparator === '>= <=' && currentFilter.filterVal.date) {
                            if (currentFilter.filterVal.date[0]) {
                                arrForQueryString[nameColumn].date = currentFilter.filterVal.date[0]._d + '*' + currentFilter.filterVal.date[1]._d;
                            } else {
                                arrForQueryString[nameColumn].date = currentFilter.filterVal.date.startTime + '*' + currentFilter.filterVal.date.endTime;
                            }
                        } else {
                            arrForQueryString[nameColumn].date = currentFilter.filterVal.date;
                        }

                    }
                    if (currentFilter.filterVal.date !== 'null' && nameColumn === 'date') {
                        arrForQueryString[nameColumn].comparator = currentFilter.filterVal.comparator;
                        if (arrForQueryString[nameColumn].comparator === '>= <=' && currentFilter.filterVal.date) {
                            if (currentFilter.filterVal.date.startDate._d) {
                                arrForQueryString[nameColumn].date = currentFilter.filterVal.date.startDate._d + '*' + currentFilter.filterVal.date.endDate._d;
                            } else {
                                arrForQueryString[nameColumn].date = currentFilter.filterVal.date.startDate + '*' + currentFilter.filterVal.date.endDate;
                            }
                        } else {
                            arrForQueryString[nameColumn].date = currentFilter.filterVal.date;
                        }
                    }
                    queryString += nameColumn + "=" + arrForQueryString[nameColumn].date + "&" + nameColumn + "COMP=" + arrForQueryString[nameColumn].comparator + "&";

                } else queryString += nameColumn + "=" + arrForQueryString[nameColumn].date + "&" + nameColumn + "COMP=" + arrForQueryString[nameColumn].comparator + "&";
            }

        }
    }
    //push in history and update temporary varibale
    if (queryString !== checkChanges) {
        console.log(window.location);
        history(window.location.pathname + queryString);
        checkChanges = queryString;
    }

}


export default function StudentsTable(props) {
    let rowData = props.rowData;
    const [value, onChange] = useState(new Date());
    const [lessons, setLessons] = useState(null);
    if (lessons == null) {
        axios.get(`${host}/lessons`).then((res) => {
            setLessons(res.data.map(e => e.name));
        });
    }

    if (lessons !== null && !subjectOptions.length) {

        lessons.map(elem => {
            subjectOptions.push({ value: elem, label: elem });
        });
    }
    let columnDefs = [];

    switch (props.mode) {
        case 1:
            columnDefs = generateRoomsTable();
            break;
        case 2:
            columnDefs = generateTable();
            break;
        case 3:
            columnDefs = generateFullTable();
            break;
        case 4:
            columnDefs = generateLogTable();
            break;
        case 5:
            columnDefs = generateTableForDeletePage();
            break;
        case 6:
            columnDefs = generateSimplifiedTable(props.changeStateHandler, props.selectOptions[0], props.selectOptions[1]);
            break;
        default:
            break;
    }


    const changePage = () => {
        let path = document.location.pathname;
        if (path !== '/table/simplifiedTable') {
            window.location.href = '/table/simplifiedTable';
        } else {
            window.location.href = '/table/other';
        }

    };
    let path = document.location.pathname;
    history = useNavigate();
    const afterFilter = (newResult, newFilters) => {
        getDataTable(newResult);
    }
    return (
        <Box>
            <Box sx={{margin: '20px 50px 0px 50px', display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap', alignItems: 'center'}}>
                <NavStruct/>
                <Box>
                    <Button variant="contained" className="controlBtn" onClick={handleClick}> Очистить все фильтры </Button>
                    <Button variant="contained" className="controlBtn" sx={{ marginLeft: "15px" }} onClick={changePage}> 
                        {path === '/table' ? "Все сессии" : (path === '/table/simplifiedTable' ? 'Полная таблица' : 'Упрощённый вид таблицы')} 
                    </Button>
                </Box>
            </Box>
            <Box sx={{bgcolor: 'background.table'}}>
                <BootstrapTable striped hover
                    keyField='ФИО студента'
                    data={rowData}
                    columns={columnDefs}
                    filter={filterFactory(props.mode === 4 ? { afterFilter } : {})}
                    sort={({ dataField: "date", order: "desc" }, { dataField: "time", order: "desc" })}
                    pagination={paginationFactory({ sizePerPageList: [{ text: "10", value: 10 }, { text: "25", value: 25 }, { text: "50", value: 50 }, { text: "100", value: 100 }, { text: "Все", value: rowData.length }] })}
                >

                </BootstrapTable>
            </Box>
        </Box>
    );
}
