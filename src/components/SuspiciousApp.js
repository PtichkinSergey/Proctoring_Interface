import React from "react";
import { Box, Typography } from "@mui/material";

import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

export default function SuspiciousApp() {

    let text = "### Нарушения видеокамеры  \n" +
        "\n" +
        "- Тип серьезности нарушения: danger - опасное  \n" +
        "    1. student NOT detected - Студент не обнаружен на видео. Обозначает, что некоторое время студент отсутствовал в кадре. Очень высокая вероятность жульничества на экзамене.  \n" +
        "    2. student_looking_on_monitor - Студент не смотрел в монитор. Обозначает, что некоторое время студент смотрел на посторонние предметы, подглядывал в тетради или телефон. Очень высокая вероятность жульничества на экзамене.  \n" +
        "\n" +
        "- Тип серьезности нарушения: warning - предупреждение  \n" +
        "    1. Unknown persons detected - На видео обнаружены неизвестные пользователи. Обозначает, что в кадри появлялись люди, которые не совпадали с фотографией пользователя. Возможно жульничество на экзамене.  \n" +
        "        \n" +
        "### Нарушения скринкаста  \n" +
        "\n" +
        "- Тип серьезности нарушения: warn - Подозрительные приложения  \n" +
        "    1. Студент заходил на сайты: \"github\", \"duckduckgo\", \"yacy\", \"pipl\", \"findsounds\", \"wolframalpha\", \"dogpile\", \"boardreader\", \"baidu\", \"yahoo\", \"shenma\", \"naver\", \"vk\", \"telegram\", \"skype\", \"facebook\", \"Veon\", \"icq\", \"mail\", \"viber\", \"instagram\", \"wikipedia\", \"habr\", \"tproger\", \"udemy\", \"coursera\", \"edx\", \"stackoverflow\", \"skillbox\", \"geekbrains\". Очень высокая вероятность жульничества на экзамене.  \n" +
        "    2. Студент заходил в системы обмена сообщениями (messenger). Обнаруживаются по ключевым словам: \"message\", \"friends\", \"news\", \"favourites\", \"telegram\", \"slack\", \"skype\", \"icq\", \"vk\", \"facebook\", \"whatsapp\", \"viber\", \"signal\", \"wechat\", \"line\", \"discord\", \"chat\", \"channel\", \"answers\". Очень высокая вероятность жульничества на экзамене.  \n" +
        "    Детектятся следующие приложения: slack, telegram, facebook, whatsapp, discord, unknown_messenger (остальные мессенджеры)." +
        "\n" +
        "- Тип серьезности нарушения: ok - Допустимые приложения  \n" +
        "    1. Студент заходил на сайты: \"google\", \"yandex\", \"bing\". Эти приложения допустимо использовать на экзамене. Жульничество не обнаружено.  \n" +
        "    2. Студент заходил в редакторы текстов или кода (code_editor): \"vcs\", \"refactor\", \"debug\", \"package\", \"python\", \"c++\", \"js\", \"project\", \"run\", \"file\", \"edit\", \"tools\", \"atom\", \"sublime\", \"editor\", \"pycharm\", \"idea\", \"webstorm\", \"jetbrains\". Эти приложения допустимо использовать на экзамене. Жульничество не обнаружено.  \n" +
        "    3. Студент перемещался между папками на устройстве или открывал картинки и текстовые файлы (file_manager): \"desktop\", \"trash\", \"recent\", \"home\", \"documents\", \"pictures\", \"downloads\", \"videos\", \"music\", \"answers\", \"screen\", \"drive\", \".pdf\", \".odt\", \".djvu\", \".doc\", \".jpg\", \".png\", \".txt\", \".py\", \".cpp\". Эти приложения допустимо использовать на экзамене. Жульничество не обнаружено.  \n"

    return (
        <Box>
            <Typography variant="h4" color={'text.primary'}>Описание нарушений</Typography>
            <ReactMarkdown plugins={[gfm]} children={text} />
        </Box>
    );
}
