import React, {Profiler} from "react";
import { Box, Typography } from "@mui/material";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import "../styles/Instruction.css";
import NavStruct from "../components/NavStruct";

export default function Instruction(props) {
    function logDelta({name, id, delta}) {
        console.log(`Instruction: ${name} matching ID ${id} changed by ${delta}`);
    }
    getFCP(logDelta);
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    let text = "# Преподаватель перед подготовкой к экзамену делает следующие действия  \n" +
        "1. Преподаватель заходит на сайт нашего сервиса.  \n" +
        "![Домашняя страница](https://user-images.githubusercontent.com/22432779/93175344-4e856c80-f751-11ea-83d9-86702993ac1b.png)\n" +
        "\n" +
        "2. В меню домашней страницы выбирает пункт \"SessionList\". (Страница [https://proctoring.moevm.info/sessionlist](https://proctoring.moevm.info/sessionlist))  \n" +
        "![image](https://user-images.githubusercontent.com/22432779/111286394-32f11500-8653-11eb-9cfb-e6c0d9953c53.png)\n" +
        "\n" +
        "3. Преподаватель нажимает на кнопку \"Загрузить список студентов\". Загружает заранее подготовленный файл в формате `csv`, где содержится информация: _ФИО студента, ссылка на фото_.  \n" +
        "![image](https://user-images.githubusercontent.com/22432779/111286594-69c72b00-8653-11eb-9904-2f2371c444cf.png)  \n" +
        "[Пример файла, который загружает преподаватель:](https://github.com/OSLL/proctoring/blob/master/selenium/test.csv)\n" +
        "```\n" +
        "Emma\thttps://st.kp.yandex.net/im/kadr/3/1/6/kinopoisk.ru-Emma-Stone-3167678.jpg\n" +
        "Tom\thttps://st.kp.yandex.net/im/kadr/2/3/3/kinopoisk.ru-Tom-Hanks-2333668.jpg\n" +
        "Meryl\thttps://st.kp.yandex.net/im/kadr/2/6/0/kinopoisk.ru-Meryl-Streep-2608023.jpg\n" +
        "....\n" +
        "```\n" +
        "\n" +
        "3. Сайт обрабатывает данные и отдает преподавателю 2 таблицы (в формате `csv`):\n" +
        "   * `sessionList.csv`, где содержится информация: _ФИО студента, ссылка на страницу `client` для записи видео_. Преподаватель передает этот файл студентам.  \n" +
        "   Пример файла (сгенерирован локально, токены не рабочие):\n" +
        "   ```\n" +
        "   Emma\t  https://proctoring.moevm.info/client/60507b95dcca51430ab69424\n" +
        "   Tom\t  https://proctoring.moevm.info/client/60507b95dcca51bc6db69425\n" +
        "   Meryl     https://proctoring.moevm.info/client/60507b95dcca51170bb69426\n" +
        "   ...\n" +
        "   ```\n" +
        "   * `teacherList.csv`, где содержится информация: _ФИО студента, ссылка на страницу `watch` для просмотра видео_. Преподаватель оставляет этот файл себе.  \n" +
        "   Пример файла (сгенерирован локально, токены не рабочие):\n" +
        "   ```\n" +
        "   Emma\t  https://proctoring.moevm.info/watch/60507b95dcca51430ab69424\n" +
        "   Tom\t  https://proctoring.moevm.info/watch/60507b95dcca51bc6db69425\n" +
        "   Meryl     https://proctoring.moevm.info/watch/60507b95dcca51170bb69426\n" +
        "   ...\n" +
        "   ```\n" +
        "4. Обратите внимание, как выглядят ссылки: адрес сайта (https://proctoring.moevm.info) + страница (client или watch) + токен (идентификатор каждой сессии). По токену можно узнать всю информацию, как проходила запись видео.  \n" +
        "\n" +
        "5. Есть секретная ссылка, по которой также можно сгенерировать токен для сессии. Используется **только разработчиками** для тестирования (при генерации нет имени студента, поэтому потом сложнее получить информацию):\n" +
        "`https://proctoring.moevm.info/api/service/token/generate`\n" +
        "\n" +
        "# Студенты на экзамене делают следующие действия  \n" +
        "1. Студенты переходят на страницу, ссылку на которую получили от преподавателя. Можно использовать только браузер Chromium(подробнее в пункте 3). Нажимают на кнопку \"Начать запись\", выполняют экзамен. \n" +
        "![image](https://user-images.githubusercontent.com/22432779/111289611-61bcba80-8656-11eb-8123-05439f7c058b.png)\n" +
        "\n" +
        "2. Если студент заходит со старой версии MacOs, то могут возникнуть сложности. Подробнее об этом и ответах на популярные вопросы можно найти на странице: [https://proctoring.moevm.info/faq](https://proctoring.moevm.info/faq) или в [этом файле](https://drive.google.com/file/d/1SKFi0NlA2W6wzzLrlgCLMpnvgf49A91c/view)\n" +
        "\n" +
        "3. Чтобы студент выбирал для трансляции не какое-то отдельное окно, а весь экран, мы поставили ограничения. Но из-за политик их позволяет использовать только браузеры Chromium. Перед началом записи запрос выглядит так:\n" +
        "![image](https://user-images.githubusercontent.com/22432779/111292795-9da54f00-8659-11eb-9403-b325386b8f15.png)\n" +
        "\n" +
        "**Не оставляйте долго окно выбора экрана!!** Это баг брузера, который съедает много оперативки. Через пару минут, она может кончится.\n" +
        "\n" +
        "Если вы зашли с другого браузера, то увидите сообщение ниже и не сможете начать запись:\n" +
        "![image](https://user-images.githubusercontent.com/22432779/102072751-5ff31900-3e13-11eb-9701-fb4cdc4b2b31.png)\n" +
        "\n" +
        "4. Может быть такое, что вы нажали на кнопку \"Начать запись\", а соединение занимает продолжительное время. Это происходит из-за задержки медиасервера, которая увеличивается, когда много студентов подключаются одновременно. Для этого были введены состояния, отображающие статус соединения. \n" +
        "![image](https://user-images.githubusercontent.com/22432779/106458879-184b4e00-64a2-11eb-9ca8-0b1ebe556aee.png)  \n" +
        "![image](https://user-images.githubusercontent.com/22432779/106458911-226d4c80-64a2-11eb-920b-0b3eaf87a966.png)  \n" +
        "![image](https://user-images.githubusercontent.com/22432779/106458896-1da89880-64a2-11eb-967b-c9296f8c12a0.png)  \n" +
        "\n" +
        "Если в течение минуты соединение не было установлено, то сработает датчик timeout и выйдет ошибка соединения. Перезагрузите страницу и попробуте \"Начать запись\" заново.\n" +
        "\n" +
        "4. После окончания нажимают на кнопку \"Остановить\".  \n" +
        "![image](https://user-images.githubusercontent.com/22432779/111293924-d85bb700-865a-11eb-8e8f-478349f5f02a.png)  \n" +
        "У студента спросят еще раз, уверен ли он, что хочет остановить сессию.  \n" +
        "![image](https://user-images.githubusercontent.com/22432779/111293568-756a2000-865a-11eb-8474-a7494ae91bbd.png)  \n" +
        "Если студенты нажмут на крестик вместо завершении сессии, то запись будет остановлена корректно. \n" +
        "\n" +
        "5. Затем сессия будет завершена, и кнопка \"Начать запись\" заблокируется.\n" +
        "![image](https://user-images.githubusercontent.com/22432779/111293604-8155e200-865a-11eb-9d28-b337ebcf5845.png)\n" +
        "\n" +
        "# Просмотр видео преподавателями после завершения экзамена  \n" +
        "\n" +
        "1. После окончания экзамена преподаватель может перейти по ссылкам, сгенерированным для просмотра видео. Можно посмотреть видео студента и скринкаст, а также справа список нарушений, обработанных мл сервером.  \n" +
        "![image](https://user-images.githubusercontent.com/22432779/111304769-2aa2d500-8667-11eb-91c8-4f7cb335393a.png)\n" +
        "Сейчас есть баг: ползунок появляется только, когда видео загружено полностью.  \n" +
        "\n" +
        "2. На вкладке watch нарушения отображаются в виде карточек, как на картинке. На каждой карточке сначала время видео, где есть нарушение, затем тип видео. Webcam - это видео с камеры, screencast - видео с экрана. Ниже тип нарушения.\n" +
        "![image](https://user-images.githubusercontent.com/22432779/102072820-74cfac80-3e13-11eb-8074-bd77f47df535.png)\n" +
        "\n" +
        "3. Также, зная токен, можно перейти по ссылкам для просмотра видео:  \n" +
        "Для веб-камеры: `https://proctoring.moevm.info/api/links/webcam/` + `token`  \n" +
        "Для скринкаста: `https://proctoring.moevm.info/api/links/window/` + `token`  \n" +
        "\n" +
        "4. Далее можно перейти к таблице результатов проверки прокторинга для всех сессий: [https://proctoring.moevm.info/table](https://proctoring.moevm.info/table).\n" +
        "![image](https://user-images.githubusercontent.com/22432779/111305620-3cd14300-8668-11eb-98f6-7cfdb4839dd3.png)\n" +
        "    * При нажатии на имя студента, переходить на страницу просмотра сессий\n" +
        "    * Можно отсортировать значения в порядке возврастания или убывания, кликнув на название столбца\n" +
        "     ![image](https://user-images.githubusercontent.com/22432779/111306546-60e15400-8669-11eb-8036-1ab7a71ac069.png)\n" +
        "    * Во всех колонках значения можно отфильтровать по подстроке\n" +
        "     ![image](https://user-images.githubusercontent.com/22432779/111305929-a0f40700-8668-11eb-8ba7-82c2072f532d.png)  \n" +
        "    * Для времени можно установить фильтр по двум полям: от, до\n" +
        "        1. Сначала нажмите на значок фильтрации\n" +
        "        ![image](https://user-images.githubusercontent.com/22432779/111306161-eadced00-8668-11eb-962e-25035af1f212.png)\n" +
        "        2. В выпадающем меню выберите поле \"Starts with\" (время от)\n" +
        "        ![image](https://user-images.githubusercontent.com/22432779/111306589-722a6080-8669-11eb-931f-60e99813c362.png)\n" +
        "        3. Введите значения для сортировки. Также можно ввести в поле \"Ends with\" (время до)\n" +
        "        ![image](https://user-images.githubusercontent.com/22432779/111306800-b7e72900-8669-11eb-96e5-3b0fe58c11a8.png)\n" +
        "    * По кнопке \"Сбросить все фильтры\" таблица будет переведена в начальное состояние, все фильтры будут сброшены.\n" +
        "" +
        "# Удаление сессии (только преподаватели)\n" +
        "\n" +
        "1. Перейти на главную страницу сервиса\n" +
        "![image](https://user-images.githubusercontent.com/54909102/132814077-63ac6ac0-d003-4e89-b4c0-df27a6370a98.png)\n" +
        "\n" +
        "2. Авторизироваться\n" +
        "![image](https://user-images.githubusercontent.com/54909102/132814168-5075eef4-b775-40ec-8df8-5e15679a0741.png)\n" +
        "\n" +
        "\n" +
        "3. Перейти на страницу deleteSession (Страница [https://proctoring.cub-it.org/deleteSession](https://proctoring.cub-it.org/deleteSession)) \n" +
        "![image](https://user-images.githubusercontent.com/54909102/132814947-0eeaa85c-cc38-4515-beb6-c1db3817a570.png)\n" +
        "\n" +
        "4. Ввести токен сессии, которую необходимо удалить и нажать \"Удалить сессию\"(токен можно взять из таблицы)\n" +
        "![image](https://user-images.githubusercontent.com/54909102/132815046-5aaaa108-24de-4097-b171-d20335722dec.png)\n" +
        "\n" +
        "5. Дождаться ответа сервера\n" +
        "![image](https://user-images.githubusercontent.com/54909102/132815207-49a0f640-5a47-45b0-9bc1-47b2a2a86337.png)\n" +
        "\n" +
        "# Генерация сессии\n" +
        "\n" +
        "1. Зайти на сайт сервиса. Можно использовать только браузре Chromium(подробнее в пункте 3).\n" +
        "![image](https://user-images.githubusercontent.com/54909102/129895401-815bf4ff-7e09-4685-bc2a-78d15ea194e9.png)\n" +
        "\n" +
        "2. Авторизоваться с помощью google. Необходимо нажать на кнопку в правом верхнем углу экрана.\n" +
        "После авторизации кнопка авторизации должна смениться\n" +
        "![image](https://user-images.githubusercontent.com/54909102/129895866-8669668a-98a4-47c8-b127-095b7dc2de06.png)\n" +
        "\n" +
        "3.  В меню домашней страницы выбирает пункт \"Для студентов\". (Страница [https://proctoring.cub-it.org/client](https://proctoring.cub-it.org/client)) \n" +
        "\n" +
        "4. Ввести свои данные и прикрепить ссылку на фотографию, если нет в гугле. Нажать на кнопку \"Создать сессию\"\n" +
        "![image](https://user-images.githubusercontent.com/22432779/134697264-d9f7f032-fcce-4537-af90-844d67d95c2e.png)" +
        "\n";
    const profile = (id, phase, actualTime, baseTime, startTime, commitTime) => {
        if(phase === 'mount'){
            console.log(`${id} component load in ${actualTime} ms`);
        }
    }
    return (
        <Profiler id="Instruction" onRender={profile}>
            <Box sx={{height: '100vh'}}>
                <Box sx={{margin: '20px 0px 0px 50px'}}>
                        <NavStruct/>
                    </Box>
                <Box sx={{margin: '30px 0px 0px 50px'}}>
                    <Typography variant="h4" color={'text.primary'}>Инструкция по работе сервиса для преподавателей</Typography>
                    <ReactMarkdown plugins={[gfm]} children={text}/>
                    <br/>
                    <a href='https://youtu.be/RwRs3CMd5Yg'>Ссылка на видео инструкцию по пользованию прокторингом</a>  
                </Box>
            </Box>
        </Profiler>
    );
}
