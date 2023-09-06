import React, {useState, useEffect} from "react";
import {Container, Jumbotron} from "react-bootstrap";
import FileUploader from "../components/FileUploader";


export default function SessionList(props) {
    return (
        <div>
            <Jumbotron fluid>
                <Container>
                    <h1>Страница только для преподавателей</h1>
                </Container>
                <FileUploader/>
            </Jumbotron>
        </div>
    );
}
