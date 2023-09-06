import * as React from 'react';
import {useState, useEffect, useRef} from 'react';

import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
import 'videojs-markers/dist/videojs.markers.min.css';
import 'videojs-markers/dist/videojs-markers.min';
import 'videojs-hlsjs-progress-control/dist/videojs-hlsjs-progress-control.min';
import 'videojs-hlsjs-progress-control/dist/videojs-hlsjs-progress-control.min.css';


const options = {
    fill: true,
    fluid: true,
    autoplay: true,
    responsive: true,
    controls: true,
    progress: true,
    playbackRates: [1, 1.5, 2, 3, 5]
};

export default function VideoPlayer({src = '', type = 'video/webm'}) { //video format
    const videoRef = useRef(null);
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const vjsPlayer = videojs(videoRef.current, options);
        setPlayer(vjsPlayer);
    }, []);

    useEffect(() => {
        if (player !== null) {
            player.src({src, type});
        }
    }, [src, type, player]);

    
    return (
        <div>
            <video ref={videoRef} className="video-js" autoplay muted/>
        </div>
    );
}
