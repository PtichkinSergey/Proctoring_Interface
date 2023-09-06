import React from 'react';
import {useState, useEffect, useRef} from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
import 'videojs-markers/dist/videojs.markers.min.css';
import 'videojs-markers/dist/videojs-markers.min';
import 'videojs-hlsjs-progress-control/dist/videojs-hlsjs-progress-control.min';
import 'videojs-hlsjs-progress-control/dist/videojs-hlsjs-progress-control.min.css';

import './VideoApp.css';


const options = {
    fill: true,
    fluid: true,
    autoplay: true,
    responsive: true,
    controls: true,
    progress: true,
    playbackRates: [1, 1.5, 2, 3, 5]
};

const createMarkers = (markup) => {
    let markers = [];
    markup.forEach(value => {
        markers.push({time: value["start_time"], text: ""});
    })
    return markers;
};

export default function VideoPlayer({src = '', type = 'video/webm', pureMarkup = [], violationTime = 0}) { //video format
    const videoRef = useRef(null);
    const [player, setPlayer] = useState(null);
    console.log("violation", violationTime);
    useEffect(() => {
        const vjsPlayer = videojs(videoRef.current, options);
        setPlayer(vjsPlayer);
    }, []);

    if (player !== null) {
        if (violationTime !== 0){
            player.currentTime(violationTime);
            player.play();
        }
        
    }

    useEffect(() => {
        if (player !== null) {
            player.src({src, type});
        }
    }, [src, type, player, pureMarkup]);

    
    return (
        <>
                <video ref={videoRef} className="video-js" autoplay muted/>
        </>
    );
}
