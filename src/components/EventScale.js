import React from "react";
import Item from "./Item";
import uuid from 'react-uuid';
import { host } from "../libs/webRTC";


export default function EventScale(props) {
    let cards = [];
    props.markup.result.map(element => {
        const body = [[],[]];
        let warn = ""
        for (let i of Object.keys(element["anomalies"])) {
            if (!element["anomalies"][i]) {  
                body[0].push(i);
            }
            warn += String(element["anomalies"][i]);
        }
        let link ="/"+"webcam" + String(Math.round(element.start_time * 100) / 100) + "_" + String(Math.round(element.end_time * 100) / 100)+".jpg"
        //console.log(body)
        cards.push(<Item
            token={props.token}
            key={uuid()}
            from={element.start_time}
            to={element.end_time}
            duration={element.end_time - element.start_time}
            link={link}
            body={body}
            setViolation={props.setViolation}
        />);
    })

    //Sorting by duration of violation
    cards.sort(function(a,b){return (b.props.duration - a.props.duration)});
    return (<>
      {cards}
    </>
    );
}
