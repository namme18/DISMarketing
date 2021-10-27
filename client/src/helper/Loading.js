import React from 'react';
import { CircularProgress, Grid, Typography } from '@mui/material';

const Loading = () => {
    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' sx={{height:'80vh'}}>
            <CircularProgress  size='20px' />
            <Typography color='textSecondary'>Loading...</Typography>
        </Grid>
    )
}

export default Loading;