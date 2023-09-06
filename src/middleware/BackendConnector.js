// import {host} from "../libs/webRTC";
// import axios from "axios";

export default class BackendConnector{

    static replacer(key, value){
        if(value instanceof Map) {
            return {
                dataType: 'Map',
                value: Array.from(value.entries()),
            };
        } else {
            return value;
        }
    }

    static changeName(params){
        // axios.post(`${host}/userAuthInfo/changeName`, {map: JSON.stringify(params, this.replacer)}, {withCredentials: true})
        //     .then(res => {
        //         if (res !== null) {
        //             window.sessionStorage.setItem("name", res.data.name);
        //             window.location.reload();
        //         }
        //     });
    }

    static askForPageAccess(params, callback){
        callback(true)
        // axios.post(`${host}/userAuthInfo/pageAccessInfo`, {map: JSON.stringify(params)}, {withCredentials: true})
        //     .then(res => {
        //         if (res !== null) {
        //             callback(res.data.accessed);
        //         } else {
        //             callback(false);
        //         }
        //     });
    }

    static getPageAccessList(callback){
        callback({isAdmin: false, routes: ['/mypage', '/generateSession', '/generateRoom', '/lessonList', '/table', '/instruction']})  // Выдал права администратора
        // axios.get(`${host}/userAuthInfo/pageAccessInfo/list`)
        //     .then(res => {
        //         if (res !== null) {
        //             callback(res.data);
        //         } else {
        //             callback(false);
        //         }
        //     });
    }

    static signInUp(params, setErrorText){
        window.sessionStorage.setItem("login", true);
        window.sessionStorage.setItem("name", "Сергей Птичкин");
        window.sessionStorage.setItem("email", params.get('login'));
        window.location.reload();
        // axios.post(`${host}/userAuthInfo`, {map: JSON.stringify(params, this.replacer)}, {withCredentials: true})
        //     .then(res1 => {
        //         if (res1.data.status === "Succeed") {
        //             window.sessionStorage.setItem("login", true);
        //             window.sessionStorage.setItem("email", params.get('login'));
        //             window.sessionStorage.setItem("name", res1.data.name);
        //             window.sessionStorage.setItem("photoChecked", false);
        //             window.location.reload();
        //         }
        //         else{
        //             setErrorText("Неверный логин или пароль")
        //         }
        //     });
    }

    static logout(){
        localStorage.clear();
        sessionStorage.clear();
        window.location = '/';
        // axios.post(`${host}/userAuthInfo/logout`, {withCredentials: true})
        //     .then(res1 => {
        //         if(res1 !== null){
        //             localStorage.clear();
        //             sessionStorage.clear();
        //             window.location = '/';
        //         }
        //     });
    }
}