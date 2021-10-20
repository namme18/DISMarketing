import { Avatar, Box, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListIcon from '@material-ui/icons/List';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    avatar:{
        background: theme.palette.secondary.light
    }
}));

const APRow = ({agent}) => {

    const classes = useStyles();
    const history = useHistory();
    const { subscribers, appsgen } = useSelector(state => state.subsReducer);

    const installedSubs = subscribers?.filter(sub => sub.agent === agent._id);
    const appsGen = appsgen?.filter(app => app.agent === agent._id);
    const active = subscribers?.filter(sub => sub.agent === agent._id && sub.isActive);

    useEffect(() => {
        if(appsgen.length < 1){
            history.push('/home/home');
        }
    },[]);

    return(
        <Card className={classes.card} elevation={5}>
            <CardHeader 
                avatar={<Avatar className={classes.avatar} src={agent.profilePicture}>{agent.username[0][0].toUpperCase()}</Avatar>}
                action={<ListIcon />}
                title={agent.username.toUpperCase()}
                subheader='Agent Name'
            />
            <CardContent>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='subtitle2'>Installed</Typography>
                    <Typography variant='subtitle2' color='textSecondary'>{installedSubs.length}</Typography>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='subtitle2'>Apps Generated</Typography>
                    <Typography variant='subtitle2' color='textSecondary'>{appsGen.length}</Typography>
                </Box>
                <Box display='flex' justifyContent='space-between'>
                    <Typography variant='subtitle2'>Activated</Typography>
                    <Typography variant='subtitle2' color='textSecondary'>{active.length}</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

export default APRow;