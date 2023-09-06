//import {socket, host} from './webRTC';
import fronLogger from "./logger";

//let kurentoUtils = require('./wrapper-kurento-dev');

const setStateVideoCallbacks = {
    STATE_WEBCAM: null,
    STATE_WINDOW: null
};

// variables
let roomName;
let userName;
const participants = {};
const typeOfCall = {};
const peers = {};

export function stopRoom(token){
    fronLogger(token, "stop room", "ok", "kurento.js");
    let webcamPresence = peers["webcam"].getLocalSessionDescriptor();
    if(webcamPresence){
        console.log(peers["webcam"].getLocalSessionDescriptor().sdp);
    }
    //socket.emit('stopSome', {"token" : token});
    if (peers["webcam"])
        peers["webcam"].dispose();
    if (peers["window"])
        peers["window"].dispose();
    //fetch(`${host}/xqueue/` + token);
    console.log("send token: ", token, " to xqueue after recording");
    fronLogger(token, "send token to xqueue after recording", "ok", "kurento.js");
    let message = {
        event: 'stopSession',
        roomName: token
    };
    sendMessage(message);
    // socket.emit('close kurento connection');
    // socket.close();
}


export function joinRoom(username, roomname, type="webcam", setReadyState, setStateProgress){
    function onIceCandidate(candidate){
        let message = {
            event: 'backendIceCandidate',
            candidate: candidate
        };
        fronLogger(roomname, `${message}`, 'ok', "kurento.js", type);
        console.log('Candidate from frontend to backend: ', candidate);
        //socket.emit('kurento message', message);
    }
    let options = {
        sendSource: type,
        oncandidategatheringdone: () => {
            if (type === "webcam") {
                joinRoom(username,roomname, "window", setReadyState, setStateProgress);
            }
            else {
                setReadyState("finished");
                setStateProgress('shureDevice');
            }
        },
        configuration: [{"urls":"stun:stun.l.google.com:19302", "url": "stun:stun.l.google.com:19302"},
            {"urls":["turn:31.184.215.216:3478"],"username":"testUser","credential":"12345"}],//[{"urls":"stun:stun.l.google.com:19302", "url": "stun:stun.l.google.com:19302"},
        //{"urls":"stun:stun.l2.google.com:19302", "url": "stun:stun.l2.google.com:19302"}], NOO
        onicecandidate: onIceCandidate
    }
    fronLogger(roomname, `joinRoom`, 'ok', "kurento.js", type);
    // let webRtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function(error)
    // {
    //     if(error){
    //         if(error === "withoutWebAndMic"){
    //             fetch(`${host}/webcam/` + roomname, { method: 'POST'});
    //             fronLogger(roomname, `The user wants to continue without a microphone or webcam.`, "warning", "kurento.js", type);
    //             joinRoom(username,roomname, "window", setReadyState, setStateProgress);
    //         }
    //         return error;
    //     }
    //     this.generateOffer(onOffer);
    // });
    // peers[type] = webRtcPeer;

    function onOffer(error, offer) {
        if (error) {
            return error;
        }
    
        let message = {
            userName: username,
            roomName: roomname,
            type: type,
            event: 'receiveVideoFrom',
            sdpOffer: offer
        };
        sendMessage(message);
    }

    // socket.on('kurento message', message => {
    //     switch (message.event) {
    //         case "getSdpAnswer":
    //             let sdpAnswer = message.sdpAnswer;
    //             webRtcPeer.processAnswer(sdpAnswer);
    //             break;
    //         case "frontIceCandidate":
    //             let candidate = message.candidate;
    //             fronLogger(roomname, `Candidate from backend:  ${candidate.candidate}`, 'ok', "kurento.js", type);
    //             webRtcPeer.addIceCandidate(candidate, err => {
    //                 if (err){
    //                     console.log('was error in add ice candidate');
    //                     fronLogger(roomname, `was error in add ice candidate`, "error", "kurento.js");
    //                     console.log('ERROR', err, ' - Candidate: ', candidate);
    //                     fronLogger(roomname, `ERROR=${err}, Candidate=${candidate} `, "error", "kurento.js");
    //                 }
    //             });
    //             break;
    //         case "stopSession":
    //             // stopSession(message.roomName); no
    //             break;
    //         default:
    //             fronLogger(roomname, `default case`, "error", "kurento.js");
    //             break;
    //     }
    // });
}

window.onload = function() {
    let videoScreen = document.getElementById('videoInput');
    let videoWebCamera = document.getElementById('videoOutput');
    typeOfCall["webcam"] = videoWebCamera;
    typeOfCall["window"] = videoScreen;
}

// socket.on('kurento message', message => {
//     switch (message.event) {
//         case 'newParticipantArrived':
//             receiveVideo(message.userid, message.username, message.type);
//             break;
//         case 'existingParticipants':
//             onExistingParticipants(message.userid, message.existingUsers);
//             break;
//         case 'receiveVideoAnswer':
//             onReceiveVideoAnswer(message.senderid, message.sdpAnswer);
//             break;
//         case 'candidate':
//             addIceCandidate(message.userid, message.candidate);
//             break;
//         case 'stopSession':
//             stopSession(message.roomName);
//             break;
//         default:
//             fronLogger(message, `default case`, "error", "kurento.js");
//             break;
//     }
// });

function receiveVideo(userid, username, type) {
    let user = {
        id: userid,
        username: username,
        rtcPeer: null
    };
    participants[user.id] = user;
    
    let video = typeOfCall[type];
    let options = {
        remoteVideo: video, //videoWebCamera,
        sendSource: type,
        onicecandidate: onIceCandidate,
        stateChange: setStateVideoCallbacks[type]
    };

    console.log('RECEIVE VIDEO ', userid, username);

    fronLogger(userid, "RECEIVE VIDEO", "ok", "kurento.js");
    // user.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
    //     function (err) {
    //         if (err) {
    //             return err;
    //         }
    //         this.generateOffer(onOffer);
    //     }
    // );

    let onOffer = function (err, offer, wp) {
        let message = {
            event: 'receiveVideoFrom',
            userid: user.id,
            roomName: roomName,
            sdpOffer: offer
        };
        sendMessage(message);
    }

    function onIceCandidate(candidate, wp) {
        let message = {
            event: 'candidate',
            userid: user.id,
            roomName: roomName,
            candidate: candidate
        };
        sendMessage(message);
    }
}

function onExistingParticipants(userid, existingUsers) {
    let user = {
        id: userid,
        username: userName,
        video: typeOfCall["webcam"],
        rtcPeer: null
    };

    participants[user.id] = user;
    let video = typeOfCall["webcam"];
    let options = {
        remoteVideo: video, //videoWebCamera,
        sendSource: "webcam",
        onicecandidate: onIceCandidate,
        stateChange: setStateVideoCallbacks["webcam"]
    };
    fronLogger(userid, "used kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, errorFunc);", "error", "kurento.js");
    // user.rtcPeer = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
    //     function (err) {
    //         if (err) {
    //             return err;
    //         }
    //         this.generateOffer(onOffer)
    //     }
    // );

    existingUsers.forEach(function (element) {
        receiveVideo(element.id, element.name);
    });

    let onOffer = function (err, offer, wp) {
        let message = {
            event: 'receiveVideoFrom',
            userid: user.id,
            roomName: roomName,
            sdpOffer: offer
        };
        sendMessage(message);
    };

    function onIceCandidate(candidate, wp) {
        let message = {
            event: 'candidate',
            userid: user.id,
            roomName: roomName,
            candidate: candidate
        };
        sendMessage(message);
    }
}

function onReceiveVideoAnswer(senderid, sdpAnswer) {
    participants[senderid].rtcPeer.processAnswer(sdpAnswer);
}

function addIceCandidate(userid, candidate) {
    participants[userid].rtcPeer.addIceCandidate(candidate);
}

export function stopSession(token) {
    document.querySelector("link[rel='icon']").href = "/logo.png";
    stopRoom(token);
}

function sendMessage(message) {
    console.log('sending ' + message.event + ' message to server');
    //socket.emit('kurento message', message);
}
