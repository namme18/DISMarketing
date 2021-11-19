import React from 'react'
import { Grow, Grid } from '@mui/material';
import List from './List';

const ForSppList = () => {
    return (
       <Grow in>
           <Grid container>
                <List/>
           </Grid>
       </Grow>
    )
}

export default ForSppList
