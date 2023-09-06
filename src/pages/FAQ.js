import React from "react";
import { Box } from "@mui/material";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import NavStruct from "../components/NavStruct";
import '../i18n';
import { useTranslation } from 'react-i18next';
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';

export default function FAQ() {
    function logDelta({name, id, delta}) {
        console.log(`FAQ: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    const [t, i18n] = useTranslation();
    let text = "1. " + t("Что делать, если я получил сообщение ") + t("\"Невозможно установить безопасное соединение\"?  \n") +
        t("Нажмите \"Подробности\" -> \"Сделать исключение для этого сайта\". И после этого вы перейдете на прокторинг.  \n") +
        "\n" +
        "2. " + t("Что делать, если я получил сообщение ") + t("\"Поменяйте запись на Chrome или Chromium\"?  \n") +
        t("Прокторинг работает только с браузерами Chromium. Используйте другой браузер, пожалуйста.  \n") +
        "\n" +
        "3. " + t("Что делать, если я нажал кнопку \"Начать запись\", но прошло уже 2 минуты, а запись еще не началась?  \n") +
        t("Подождите еще немного. Если запись началась не сразу, значит, сейчас экзамен проходят много студентов и из-за этого появилась задержка. Не закрывайте вкладку, запись скоро начнется.  \n") +
        "\n" +
        "4. " + t("Что делать, если сайт не открывается с MacOS?  \n") +
        t("Обновите браузер Chromium до последней версии. Попробуйте зайти на прокторинг снова.  \n") +
        t("Работает в следующих версиях:  \n") +
        "\t* MacOS X Big Sur  \n" +
        t("Не работает на следующих версиях браузера: ") + "39,40.\n" +
        t("Работает на версиях браузера ") + "41 " + t("и позднее.\n") +
        "\t* MacOS X Catalina  \n" +
        t("Работает на версиях браузера ") + "41 " + t("и позднее.\n") +
        "\t* MacOS X Mojave  \n" +
        t("Не работает на следующих версиях браузера: ") + "27-37.\n" +
        t("Работает на версиях браузера ") + "38 " + t("и позднее.\n") +
        "\t* MacOS X High Sierra  \n" +
        t("Не работает на следующих версиях браузера: ") + "27-37.\n" +
        t("Работает на версиях браузера ") + "38 " + t("и позднее.\n") +
        "\t* MacOS X Mavericks  \n" +
        t("Не работает на следующих версиях браузера: ") + "25-38.\n" +
        t("Работает на версиях браузера ") + "48 " + t("и позднее.\n") +
        "\t* MacOS X Sierra, OS X El Capitan, Yosemite  \n" +
        t("Работает на версиях браузера ") + "84 " + t("и позднее.\n") + t("Возможно и на более ранних (не тестировали).\n") +
        "\n" + "\n" + 
        "5. " + t("Что делать, если я получил сообщение ") + t("\"Ошибка установки соединения!\"?  \n") +
        t("Попробуйте подключиться снова. Если после нескольких попыток ошибка все еще есть, пожалуйста, обратитесь к организатору сессий. Также будет полезна информация о стране, где Вы сейчас находитесь, находитесь ли Вы в общежитие или нет, и версия браузера, которую Вы сейчас используете.  \n") +
        "\n" +
        "6. " + t("Почему не получается авторизоваться в режиме инкогнито?  \n") +
        t("Google API не позволяет авторизоваться в режиме инкогнито. Зайдите на сайт в обычном режиме.  \n") +
        "\n" +
        t("При возникновении любых других ошибок:\n") +
        t("Заполните форму по ссылке: ") + "https://docs.google.com/forms/d/e/1FAIpQLSem8bKtf3Hsy1a0_qjFbP5F53auq-qlH8Y_l_jt5dY29vlj6Q/viewform?usp=sf_link . " + 
        t("Пожалуйста, обратитесь к преподавателю. Сообщите информации о стране, где Вы сейчас находитесь, находитесь ли Вы в общежитие или нет, и версия браузера, которую Вы сейчас используете.  \n") +
        "\n";
    return (
        <Box>
            <Box sx={{margin: '20px 0px 0px 50px'}}>
                <NavStruct/>
            </Box>
            <Box sx={{margin: '30px 0px 0px 50px'}}>
                <ReactMarkdown plugins={[gfm]} children={text}/>
                <br />
                <a href='https://youtu.be/RwRs3CMd5Yg'>{t("Ссылка на видео инструкцию по пользованию прокторингом")}</a>
            </Box>
        </Box>
    );
}