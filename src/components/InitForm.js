import React, {useState} from "react";
import {Button, Col, FormControl, FormLabel, InputGroup, Row} from "react-bootstrap";
import {register, call, stop, joinRoom} from "../libs/kurento";

export default function InitForm() {

    const [userName, setUserName] = useState("");
    const [peerName, setPeerName] = useState("");

    return (
        <>
            <Col md={3}>
                    <FormLabel className="control-label" htmlFor="name">Name</FormLabel>
                    <Row>
                        <InputGroup className="mb-6" >
                            <FormControl
                                placeholder="Enter your name"
                                aria-label="Enter your name"
                                aria-describedby="basic-addon2"
                                onChange={(e => setUserName(e.target.value))}
                            />
                        </InputGroup>
                    </Row>

                    <br/>
                    <br/>

                    <FormLabel className="control-label" htmlFor="peer">Peer</FormLabel>
                    <Row>
                        <InputGroup className="mb-6" >
                            <FormControl
                                onChange={(e) => setPeerName(e.target.value)}
                                placeholder="Enter a username to connect with"
                                aria-label="Enter a username to connect with"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-success" onClick={
                                    () => {
                                        joinRoom(userName, peerName, "webcam");
                                        
                                        //joinRoom(userName, peerName, "window");
                                        //call(userName, peerName, "webcam");
                                        //setTimeout(() => {
                                        //    joinRoom(userName, peerName, "window");
                                        //}, 10000);
                                    }
                                }>Call</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Row>
                </Col>      
        </>        
    );
}