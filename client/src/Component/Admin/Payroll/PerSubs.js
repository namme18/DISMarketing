import { Avatar, Box, Checkbox, Grid, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import useStyles from './style';

const PerSubs = ({sub, index, commiPercentage, checkedSubs, setCheckedSubs}) => {

    const classes = useStyles();
    const [data, setData] = useState(true);

    const onChange = e => {
        setData(!data);
        if(!e.target.checked){
            setCheckedSubs([...checkedSubs.filter(sb => sb._id !== sub._id )]);
        }
        if(e.target.checked){
            setCheckedSubs([...checkedSubs, sub]);
        }
    }

    return (
        <div>
            <Grid container direction='row' justify='space-between' alignItems='center' className={classes.perSubsContainer}>
                <Box display='flex' alignItems='center' justifyContent='flex-start'>
                    <Checkbox size='small' checked={data} color='secondary' className={classes.checked} onChange={onChange} />
                    <Avatar className={classes.perSubsArrow} style={{fontSize:'small', background:'green'}}>{index+1}</Avatar>
                    &nbsp;
                    <Typography className={classes.perSubs} variant='subtitle2' color='textSecondary'>{sub.fullname.map(name => name[0].toUpperCase()+name.substring(1)).join(' ')}</Typography>
                </Box>
                <Typography variant='subtitle2' className={classes.perSubsPlan} color='textSecondary'>{`${sub.plan}|${parseFloat(sub.plan*commiPercentage).toFixed(2)}`}</Typography>
            </Grid>
        </div>
    )
}

export default PerSubs;