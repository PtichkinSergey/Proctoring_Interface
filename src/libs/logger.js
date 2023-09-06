//import {socket, host} from "./webRTC";

export default function fronLogger(token=null, message=null, type=null, source=null, device=null){
    Logger(token, message, type, source, device);
}

function Logger(token, message, type, source, device){
    console.log("here");
    // socket.emit('take log',{
    //     token: token,
    //     message: message,
    //     date: Date.now(),
    //     source: source,
    //     type: type,
    //     device: device,
    // });
}
