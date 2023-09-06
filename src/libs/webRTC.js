import io from 'socket.io-client';

export const config = {
    'iceServers': [{
        'urls': ['stun:stun.l.google.com:19302']
    }]
};

export const host = process.env.REACT_APP_BACKEND_HOST === undefined ? "" : process.env.REACT_APP_BACKEND_HOST;
export const socket = io.connect('');
console.log("Front end webRTC: socket connect");
console.log("socket.type: ", socket.type);
console.log("socket: ", socket);

window.onunload = window.onbeforeunload = function() {
    console.log("Front end webRTC: socket closed");
    socket.close();
};
