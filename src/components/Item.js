import React, {useState} from "react";
import {Badge, Container, Row, Toast, Button} from "react-bootstrap";
import uuid from 'react-uuid';
import {host} from "../libs/webRTC"
import { Box, Typography } from "@mui/material";

let open = false;

let badges = {
    student_detected: {
        label: "danger",
        text: "student NOT detected" 
    },
    student_looking_on_monitor: {
        label: "danger",
        text: "" 
    },
    unknown_persons: {
        label: "warning",
        text: "Unknown persons detected" 
    },
};



const Item = (props) => {
    const [show, setShow] = useState(true);
    const toggleShow = () => setShow(!show);
    function setTime() {
        props.setViolation(parseInt(props.from.toFixed(2)));
    }

    function getImage() {
        const webcamJsOptions = {
            src: `${host}/links/photo/${props.token}/${props.link}`
          };
        const modal = document.querySelector("#item_dialog");
        document.getElementById("image_dialog_markup").src = webcamJsOptions.src;
        modal.showModal();
        window.dialogOpenValue = !window.dialogOpenValue;
    }

    const closeLightbox = () => {
        open = true;
    }

    function parseTimeViolation(timeInfo) {
        let mltime = "";
        let secInMin = String(parseInt(timeInfo%60));

        if(secInMin.length === 1){
            secInMin = '0' + secInMin;
        }

        if(timeInfo >= 60){
            mltime = parseInt(timeInfo/60)+ ":"+ secInMin;
        }else{
            mltime = timeInfo.toFixed(2);
        }
        return mltime;
    }
    let parsedDuration = parseTimeViolation(props.duration);

    return <Toast onClose={toggleShow} show={show} animation={false}>
        <Toast.Header>
            <Box>
                <Typography variant="h7">
                    {parseTimeViolation(props.from)} - {parseTimeViolation(props.to)} . {parsedDuration.includes(':') ? parsedDuration + " min" : parsedDuration + " sec"}
                </Typography>
            </Box>
            <Box>
               <Button size="sm" onClick={setTime}>
                    Load
                </Button>
                <Button size="sm" onClick={getImage}>
                    Изображение
                </Button> 
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{marginBottom: '10px'}}>
                    <Typography variant="h7" color={'text.primary'}>
                        {parseTimeViolation(props.from)} - {parseTimeViolation(props.to)} . {parsedDuration.includes(':') ? parsedDuration + " min" : parsedDuration + " sec"}
                    </Typography>
                </Box>
                <Box sx={{marginBottom: '10px'}}>
                   <Button variant="contained" sx={{width: '130px'}} onClick={setTime}>
                        Load
                    </Button> 
                </Box>
                <Box sx={{marginBottom: '10px'}}>
                    <Button variant="contained" sx={{width: '130px'}} onClick={getImage}>
                        Изображение
                    </Button> 
                </Box>
            </Box>
        </Toast.Header>
        <Toast.Body>
            <Container>
                <Row>
                    {
                        props.body[0].map(valueName => {
                            if (valueName === "student_looking_on_monitor")
                                return false
                            if (valueName === "student_detected" || valueName === "unknown_persons")
                                return <Badge pill key={uuid()} variant={badges[valueName].label}>{badges[valueName].text}</Badge>
                                return <Badge pill key={uuid()} variant={"danger"}>{valueName}</Badge>
                        })
                    }
                </Row>
                <Row>
                    {
                        props.body[1].map(valueName => {
                                return <Badge pill key={uuid()} variant={"success"}>{valueName}</Badge>
                        })
                    }
                </Row>
            </Container>

        </Toast.Body>
    </Toast>
}

export default Item;
