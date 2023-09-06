import React from "react";
// import axios from "axios";
// import {host} from "../libs/webRTC";
// import Bowser from "bowser";
// import sendStatLog from "../libs/log";
import BackendConnector from "../middleware/BackendConnector";
import { Box, Avatar, Tooltip, IconButton, Menu, MenuItem, Divider, ListItemIcon } from "@mui/material";
import { Link } from "react-router-dom";
import { Logout } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import '../i18n';
import { useTranslation } from 'react-i18next';
import '../styles/GoogleAuth.css'

export default function GoogleAuth(page) {
    const [t, i18n] = useTranslation();
    const handleLogout = (res) => {
        BackendConnector.logout();
    };
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
        <Box>
            <Tooltip title="Профиль">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    className="outlineBtn"
                >
                    {!!window.sessionStorage.getItem("image") ? 
                        <Avatar src={window.sessionStorage.getItem("image")} sx={{width: 50, height: 50}}/>
                        :
                        <Avatar sx={{width: 50, height: 50}}/>
                    }
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
                <MenuItem component={Link} to='/mypage'>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" />
                    </ListItemIcon> 
                    {window.sessionStorage.getItem("name")}
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    {t("Выйти")}
                </MenuItem>
            </Menu>
        </Box>
    );
}
