import React from 'react';
import {
    Avatar,
    Card, CardContent, CardHeader, Typography, Grid, Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { format } from 'date-fns';

const useStyles = makeStyles(theme => ({
    card: {
        width: '100%',
        border: '1px solid #dbc63b'
    },
    avatar:{
        backgroundColor: '#f44336'
    }
}));

const CACard = ({user}) => {

    const classes = useStyles();
    const cardAvatarName = user.username[0].toUpperCase();
    const cardTitle = user.fordeductions?.map(ded => parseFloat(ded.amount))?.reduce((a, b) => a + b, 0).toFixed(2);
    const cardSubHeader = user.username.split(' ').map(n => n[0].toUpperCase()+n.substring(1)).join(' ');
    return (
        <Card className={classes.card}>
            <CardHeader 
                avatar={<Avatar className={classes.avatar} src={user.profilePicture}>{cardAvatarName}</Avatar>}
                title={`PHP - ${cardTitle}`}
                subheader={cardSubHeader}
            />
            <CardContent>
                {user.fordeductions?.map((ded, index) => {
                    const remarks = `${index+1}: ${ded.remarks[0].toUpperCase()+ded.remarks.substring(1)}`;
                    const amount = `PHP - ${parseFloat(ded.amount).toFixed(2)}`;
                    const payments = ded.payment;

                    return (
                        <div key={index}>
                            <Typography variant='caption' color='textSecondary' style={{marginLeft: '20px'}}>{format(new Date(ded.date), 'MMM. d, yyyy')}</Typography>
                            <Grid container key={index} alignItems='center' direction='row' justify='space-between'>
                                <Typography display='inline' noWrap style={{width:'150px'}} variant='body2'>{remarks}</Typography>
                                <Typography variant='body2'>{amount}</Typography>
                            </Grid>
                            {payments.length > 0 && (
                                <Grid container style={{paddingLeft:'20px'}}>
                                    {payments?.map((pay, index) => {
                                        const date = format(new Date(pay.date), 'do MMMM Y');
                                        const amount = parseFloat(pay.amount).toFixed(2);
                                        return(
                                            <div key={index} style={{width:'100%'}}>
                                                <Typography variant='caption'>Payments</Typography>
                                                <Grid key={index} item container direction='row' justify='space-between' xs={12}>
                                                    <Typography variant='caption' color='textSecondary'>{date}</Typography>
                                                    <Typography variant='caption' color='textSecondary'>{amount}</Typography>
                                                </Grid>
                                            </div>
                                        )
                                    })}
                                </Grid>
                            )}
                            <Divider />
                        </div>
                     )
                })}
            </CardContent>
        </Card>
    )
}

export default CACard;