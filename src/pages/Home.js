import React from "react";
import { Box } from "@mui/material"
import { Typography } from "@mui/material";
import {getCLS, getFID, getLCP, getFCP} from 'web-vitals';

export default function Home() {
    function logDelta({name, id, delta}) {
        console.log(`Home: ${name} matching ID ${id} changed by ${delta}`);
    }
    getCLS(logDelta);
    getFID(logDelta);
    getLCP(logDelta);
    getFCP(logDelta);
    return (
        <Box sx={{margin: '50px'}}>
            <Typography variant='h4' fontWeight='bold' color={'text.primary'} >Proctoring</Typography>
            <Typography>
                Eventually, it will be number one proctoring solution in the world
            </Typography>
        </Box>
    );
}
