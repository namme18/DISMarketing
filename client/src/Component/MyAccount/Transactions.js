import { Grid, Typography, Paper } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Transactions = () => {

    const userTrans = useSelector(state => state.transReducer.userTrans);

    return (
        <Grid container component={Paper} sx={{p: 2}} direction='column'>
            {userTrans?.map(trans => (
                <Grid key={trans._id} item container sx={{boxShadow: 6, mb: 2, pt: 2, pr: 1}} alignItems='center' justifyContent='center' direction='column'>
                    <Typography variant='body2' sx={{background: theme => theme.palette.success.light, p: '0 8px'}}>{format(new Date(trans.date), 'MMMM d, yyyy - hh:mm a')}</Typography>
                    <Link target='_blank' to={`/image/${trans._id}/?status=agent`}><img src={trans.payout} alt={trans._id} style={{width: '100%'}} /></Link>
                </Grid>
            ))}
        </Grid>
    )
}

export default Transactions;