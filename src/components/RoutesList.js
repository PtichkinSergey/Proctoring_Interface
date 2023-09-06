import React from "react";
import {Route, Routes} from "react-router-dom";
import Watch from "../pages/Watch";
import Home from "../pages/Home";
import Client from "../pages/Client";
//import SessionList from "../pages/SessionList";
//import Statistic from "../pages/statisticsPage";
import FAQ from "../pages/FAQ";
//import SessionTable from "../pages/SessionTable";
//import RoomTable from "../pages/RoomTable";
// import GoogleAuth from "../pages/GoogleAuth";
//import Admin from "../pages/Admin";
//import DeleteSession from "../pages/DeleteSession";
import Instruction from "../pages/Instruction";
//import WatchGenerate from "../pages/WatchGenerate";
import PersonalPage from "../pages/PersonalPage";
//import Auth from "../pages/Auth";
import RequireAccess from "./RequireAccess";
import RoomGenerate from "../pages/RoomGenerate";
import ClientGenerate from "../pages/ClientGenerate";
//import RoomSessionTable from "../pages/RoomSessionTable";
//import LogTable from "../pages/LogTable";
import LessonList from "../pages/LessonList";
//import SimplifedTable from "../pages/SimplifiedTable";


export default function RoutesList() {
    /*
        - Route - for open access pages
        - RequireAccess - for private access pages (auth needed)
     */
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/mypage" element={<PersonalPage />} />
            <Route path="/faq" element={<FAQ/>}/>
            <Route path="/generateSession" element={<RequireAccess path="/generateSession" component={ClientGenerate}/>}/>
            <Route path="/generateRoom" element={<RequireAccess path="/generateRoom" component={RoomGenerate}/>}/>
            <Route path="/generateSession/:room" element={<RequireAccess path="/generateSession" component={ClientGenerate}/>} />
            <Route path="/instruction" element={<RequireAccess path="/instruction" component={Instruction}/>} />
            <Route path="/generateSession/client/:token" element={<RequireAccess path="/client/:token" component={Client}/>} />
            <Route path="/teach/:token" element={<RequireAccess path="/teach/:token" component={Watch}/>} />
            <Route path="/lessonList" element={<RequireAccess path="/lessonList" component={LessonList}/>} />
            {/* <Route exact path="/teach" element={<RequireAccess path="/teach" component={WatchGenerate}/>} />
            <Route exact path="/sessionlist" element={<RequireAccess path="/sessionlist" component={SessionList}/>} />
            <Route exact path="/table/other" element={<RequireAccess path="/table/other" component={SessionTable}/>} />
            <Route exact path="/table/:token" element={<RequireAccess path="/table/:token" component={RoomSessionTable}/>} />
            <Route exact path="/table" element={<RequireAccess path="/table" component={RoomTable}/>} />
            <Route exact path='/table/simplifiedTable' element={<RequireAccess path="/simplifiedTable" component={SimplifiedTable}/>}/>
            <Route exact path="/admin" element={<RequireAccess path="/admin" component={Admin}/>} />
            <Route exact path="/statistic" element={<RequireAccess path="/statistic" component={Statistic}/>} />
            <Route exact path="/deleteSession" element={<RequireAccess path="/deleteSession" component={DeleteSession}/>} />
            <Route exact path="/logTable" element={<RequireAccess path="/logTable" component={LogTable}/>}/> */}
        </Routes>
    );
}
