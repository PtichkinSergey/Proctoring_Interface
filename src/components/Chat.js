import React, {useState} from "react";
import {Button, FormControl, InputGroup} from "react-bootstrap";
import {socket} from "../libs/webRTC";


export default function Chat({name}) {
    const [messageText, setMessageText] = useState("");
    const [messageList, setMessageList] = useState([]);

    socket.on("take message", (data) => {
        console.log("chat message", data.date, data.name, data.msg);
        let newMessageList = messageList.slice();
        newMessageList.push({
            name: data.name,
            date: data.date,
            msg: data.msg
        });
        setMessageList(newMessageList);
    });

    const sendMessage = () => {
        let date = new Date();
        let obj = {
            name: name,
            date: date,
            msg: messageText
        };
        socket.emit("send message", obj);
        let newMessageList = messageList.slice();
        newMessageList.push(obj);
        setMessageList(newMessageList);
    }

    return (<>
            <div className="message-list-container">
                {messageList.map((value, index) => {
                    return <li key={index}>{value.name} - {value.msg}</li>
                })}
            </div>
            <br/>
            <InputGroup className="mb-3" >
                <br/>
                <br/>

                <FormControl
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Enter text"
                    aria-label="Enter text"
                    aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                    <Button variant="success" onClick={sendMessage}>Button</Button>
                </InputGroup.Append>
            </InputGroup>
        </>
    );
}
