import {socket, host} from "./webRTC";

// Old code that send logs from frontend container to backend.

export default function sendStatLog(token=null, message=null, type=null, source=null, device=null){
    
     if (token !== null && message !== null && type === null){
        sendStatLogToken(token, message);
    } else if (token !== null && message !== null && type !== null){
        sendStatLogKurento(token, type, message);
    } else if (token === null && message !== null && type === null){
        sendMessageLog(message);
    }

}

function getDate(){
    let curDate = new Date();
    var datetime = curDate.getDate() + "/"
                + (curDate.getMonth()+1)  + "/" 
                + curDate.getFullYear() + "@"  
                + curDate.getHours() + ":"  
                + curDate.getMinutes() + ":" 
                + curDate.getSeconds() + " timezone: "
                + Intl.DateTimeFormat().resolvedOptions().timeZone;
    return datetime;
}

function sendStatLogToken(token, message){
    socket.emit('stat', {
        text: `[${getDate()}] [${token}] (frontend) ${message}`
    });
}

function sendMessageLog(message){
    socket.emit('stat',{
        text: `[${getDate()}] (frontend) ${message}`
    });
}

function sendStatLogKurento(token, type, text){
    socket.emit('stat', {
        text: `[${getDate()}] [${token}] (frontend) type=${type} ${text}=${new Date()}`
    });
}


