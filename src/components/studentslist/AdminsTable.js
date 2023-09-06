import React, {useEffect, useState, useContext} from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import axios from "axios";
import {host, socket} from "../../libs/webRTC";


export default function AdminsTable({rowData}){
    let columnDefs = [
        {text: 'Admins', dataField: 'email'}
    ];
    return (
        <>
            <div className="AdminsTable">
                <BootstrapTable striped hover keyField='ФИО студента'  data={ rowData } columns={columnDefs } >
                </BootstrapTable>
            </div>
        </>
    );
}
