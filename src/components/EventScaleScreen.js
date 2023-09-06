import React from "react";
import Item from "./Item";
import uuid from 'react-uuid';
import { host } from "../libs/webRTC";

export default function EventScaleScreen(props) {
    let cards = [];
    props.screenCastMarkup.result.map(element => {
        const body = [[],[]];
        let warn = ""
        element.warn.map(elem => {
            body[0].push(elem);
            //console.log(elem);
            warn += String(elem)
        });
        element.ok.map(elem => {
            body[1].push(elem);
            //console.log(elem);
        });
            //console.log(body)
        let link = "window" + String(Math.round(element.start_time * 100) / 100) + "_" + String(Math.round(element.end_time * 100) / 100)+".jpg"
            //Entering violations into an array for sorting
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

    //sorting the array using the sort method that the comparator accepts
    //Sorting by duration of violation
    cards.sort(function(a,b){return (b.props.duration - a.props.duration)});
    //console.log(cards);

    //we will return the sorted array of violations
    return (<>
        {cards}
    </>
    );
}
