import React, { useEffect } from 'react';
import './styles/App.css'
import {BrowserRouter} from 'react-router-dom';
import MainNavbar from "./components/MainNavbar";
import RoutesList from "./components/RoutesList";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Cookies from 'js-cookie';
import Auth from './pages/Auth';
import './i18n';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line
// import adapter from "webrtc-adapter";
// import {host} from "./libs/webRTC";
// import axios from "axios";

function App() {
    //axios.post(`${host}/usersdb`, ["init"]);
    //console.log(`${process.env.REACT_APP_BACKEND_HOST}`);
    const [t, i18n] = useTranslation();
    let loadMode = Cookies.get('mode');
    let loadLang = Cookies.get('lang');
    if(loadLang){
        if(loadLang !== i18n.language){
           i18n.changeLanguage(loadLang); 
        }
    }
    const [mode, setMode] = React.useState(loadMode ? loadMode : 'light');
    const changeMode = () => {
        Cookies.set('mode', mode === 'light' ? 'dark' : 'light');
        setMode(mode === 'light' ? 'dark' : 'light')
    }
    const theme = createTheme({
        palette: { 
            mode,
            background: {
                ...(mode === 'light'
                  ? {
                      default: '#D3E0FF',
                      paper: '#fff',
                      table: '#fff'
                    }
                  : {
                      default: '#212121',
                      paper: '#0E0E0E',
                      table: '#7E7E7E'
                    })
              },
            text: {
                ...(mode === 'light'
                  ? {
                      primary: '#000', 
                    }
                  : {
                      primary: '#fff',
                    }),
            }
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {!!window.sessionStorage.getItem("login") ?
                <BrowserRouter>
                    <MainNavbar changeMode={changeMode} mode={mode}/> 
                    <RoutesList/>
                </BrowserRouter>
                :
                <Auth/>
            }    
        </ThemeProvider>
    );
}

export default App;
