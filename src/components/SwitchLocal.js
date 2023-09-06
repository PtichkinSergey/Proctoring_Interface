import React from "react";
import { MenuItem, Tooltip, IconButton, Menu, Typography, Box } from "@mui/material";
import '../i18n';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import '../styles/Auth.css'
import Cookies from "js-cookie";


export default function SwitchLocal(){
    const [t, i18n] = useTranslation();
    const changeLang = (e) => {
        i18n.changeLanguage(e.target.lang);
        Cookies.set('lang', e.target.lang);
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return(
        <Box>
            <Tooltip title="Язык">
                <IconButton
                    onClick={handleClick}
                    size="large"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    color="inherit"
                    className="password_icon"
                >
                    <LanguageIcon/>
                    <Typography>{i18n.language.toUpperCase()}</Typography>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                    },
                    '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    },
                },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem lang={'ru'} onClick={changeLang}>RU</MenuItem>
                <MenuItem lang={'eng'} onClick={changeLang}>ENG</MenuItem>
            </Menu>
        </Box>
    )
}