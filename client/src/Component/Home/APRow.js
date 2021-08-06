import { Avatar, Card, CardHeader } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListIcon from '@material-ui/icons/List';

const useStyles = makeStyles(theme => ({
    avatar:{
        background: theme.palette.secondary.light
    }
}));

const APRow = ({agent}) => {

    const classes = useStyles();

    return(
        <Card className={classes.card} elevation={5}>
            <CardHeader 
                avatar={<Avatar className={classes.avatar}>{agent.username[0][0].toUpperCase()}</Avatar>}
                action={<ListIcon />}
                title={agent.username.toUpperCase()}
                subheader='Agent Name'
            />
        </Card>
    )
}

export default APRow;