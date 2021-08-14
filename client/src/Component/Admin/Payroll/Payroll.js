import React,{ useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    Grid,
    Typography,
    CardContent,
} from '@material-ui/core';
import dislogo from '../../../images/converge-logo.png'
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import PerTeam from './PerTeam';
import { getForPayout } from '../../../redux/reducers/subsActions/getForPayout';

const useStyles = makeStyles(theme => ({
    card:{
        maxHeight: '63vh',
        overflowY: 'scroll'
    },
    container:{
        marginBottom: theme.spacing(2)
    }
}));

const Payroll = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const allUsers = useSelector(state => state.authReducer.allUsers);
    const forpayout = useSelector(state => state.subsReducer.forpayout);

    const teamLeaders = allUsers?.filter(user => user.restrictionlevel !== 'agent');

    const [data, setData] = useState({});

    useEffect(() => {
        dispatch(getForPayout());
    }, [dispatch]);

    return(
        <Card elevation={6} className={classes.card}>
            <CardContent>
                <Grid container direction='row' alignItems='center' justify='center' spacing={2} className={classes.container}>
                    <Grid item>
                        <img alt='DISMarketin' src={dislogo} style={{height:80}} />
                    </Grid>
                    <Grid item>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='h6' comnponent='p'>DIS Marketing Services</Typography>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='subtitle1' comnponent='p' color='textSecondary'>San Andres, Victorial, Tarlac</Typography>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='subtitle1' comnponent='p' color='textSecondary'>Date: {format(new Date(), 'do MMMM Y')}</Typography>
                    </Grid>
                </Grid>

                {teamLeaders?.map(teamleader => (
                <>
                <PerTeam teamleader={teamleader} allusers={allUsers} forpayout={forpayout} seData={setData} data={data} />
                </>
                ))}
            </CardContent>
        </Card>
    )
}

export default Payroll;