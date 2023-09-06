import React, {useState} from "react";
import {Alert} from "react-bootstrap";

export default function AlertError({showAlert}) {

    let [show, setShow] = useState(showAlert);
    console.log(show)
    if (show) {
        return (
            <Alert variant="danger" onClose={() => setShow(false)}  dismissible>
                <Alert.Heading>Ошибка установки соединения!</Alert.Heading>
                <p>
                    Произошла ошибка установка соединения для прокторинга. Пожалуйста, обратитесь к организатору сессий. Также будет
                    полезна информации о стране, где Вы сейчас находитесь, находитесь ли Вы в общежитие или нет, и версия браузера, которую Вы сейчас используете.
                </p>
            </Alert>
        );
    }
    return <></>
}
