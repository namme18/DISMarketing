import React from 'react'
import { Grow, Grid } from '@mui/material';
import List from './List';
import { useSelector } from 'react-redux';
import Loading from '../../../helper/Loading';

const ForSppList = () => {

    const forspp = useSelector(state => state.subsReducer.forspp);
    const subsForEncoding = forspp?.filter(sub => sub.sppstatus.status === 'encoding');

    if(!forspp){
        return(
            <Loading />
        )
    }

    return (
       <Grow in>
           <Grid container>
               {subsForEncoding?.map(sub => (
                   <List key={sub._id} sub={sub}/>
               ))}
           </Grid>
       </Grow>
    )
}

export default ForSppList
