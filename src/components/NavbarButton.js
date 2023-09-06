import React from "react"
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function accessCheck(access, route_path = "") {
    if (!access) return false;
    if (access['isAdmin']) return true;
    return access["routes"] && access["routes"].includes(route_path);
}

export default function NavbarButton({access, path, children}){
    return(
        accessCheck(access, path) 
        ?
            <Button
                component={Link}
                to={path}
                style={{ color: 'white', fontWeight: 'normal', textAlign: 'center' }}
            >
                {children}
            </Button>
        : 
        <></>
    )
}