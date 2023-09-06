import React, {useEffect, useState} from "react";
import BackendConnector from "../middleware/BackendConnector";
import Error403 from "../pages/Error403";

export default function RequireAccess({component: Component, path}) {
    const [isAvailable, setIsAvailable] = useState();
    useEffect(() => {
        const params = {
            "path": path,
        };
        BackendConnector.askForPageAccess(params, setIsAvailable);
    }, []);


    return (
        <>
            {isAvailable ? <Component path={path} /> : <Error403/>}
        </>
    );
}