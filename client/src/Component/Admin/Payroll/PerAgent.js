import React, { useState, useEffect } from 'react';
import {
    Collapse,
    Grid, 
    Typography,
    Box
} from '@material-ui/core';
import useStyles from './style';
import PerSubs from './PerSubs';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { addAgentIncome } from '../../../redux/reducers/subsReducer';
import { useDispatch } from 'react-redux';
import { loadCheckedSubs } from '../../../redux/reducers/subsReducer';

const PerAgent = ({agent, teamleader, forpayout}) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [showSubs, setShowSubs] = useState(true);
    const [checkedSubs, setCheckedSubs] = useState([]);
    const payout = checkedSubs?.filter(sub => sub.agent === agent._id).map(sub => parseInt(sub.plan)).reduce((a, b) => a + b, 0).toFixed(2);
    const subscribers = forpayout?.filter(sub => sub.agent === agent._id);
    
    const handleClickAgent = () => {
        setShowSubs(!showSubs);
    }
    
    const commiPercentage = subscribers.length <= 4 ? .40 : subscribers.length >= 5 ? .50 : null;
    const VAT = .05;
    const SSS = 0;
    const PHIC = 0;
    const HDMF = 0;
    const CA = agent.cashadvance || 0;
    const totalCommi = parseFloat(payout*commiPercentage);
    const deductions = parseFloat((totalCommi*VAT)+SSS+PHIC+HDMF+CA).toFixed(2);
    const netIncome = parseFloat(totalCommi - ((totalCommi*VAT)+SSS+PHIC+HDMF+CA)).toFixed(2);

    useEffect(() => {
        if(subscribers.length > 0){
            setCheckedSubs(subscribers);
        }
    },[]);

    useEffect(() => {
            const data = {
                agentId: agent._id,
                subs: checkedSubs.map(sub => sub)
            }
            dispatch(loadCheckedSubs(data));
    },[checkedSubs]);

    useEffect(() => {
            const data = {
                agentId: agent._id,
                id:teamleader._id,
                plan: netIncome
            }
            dispatch(addAgentIncome(data));
    },[netIncome]);

    return(
        <div>
            {payout > 1 && (
                <>
                <Grid container direction='row' justify='space-between' alignItems='center' className={classes.container}>
                    <Box display='flex' justifyContent='flex-start' alignItems='center' style={{cursor:'pointer'}} onClick={handleClickAgent}>
                        {showSubs ? <KeyboardArrowUpIcon className={classes.arrow} /> : <KeyboardArrowDownIcon className={classes.arrow} />}
                        <Typography className={classes.perAgent} variant='body1' color='textSecondary'>{agent?.username?.split(' ').map(na => na[0].toUpperCase()+na.substring(1)).join(' ')}</Typography>
                    </Box>
                    <Typography className={classes.perAgent} variant='body1' color='textSecondary'>{!showSubs ? netIncome : '-'}</Typography>
                </Grid>
                <Collapse in={showSubs} timeout='auto' unmountOnExit>
                    {subscribers?.map((sub, index) => (
                        <PerSubs key={sub._id} checkedSubs={checkedSubs} setCheckedSubs={setCheckedSubs} sub={sub} index={index} commiPercentage={commiPercentage}/>
                    ))}
                    <Grid container direction='column' justify='center' alignItems='flex-end'>
                        <Typography variant='caption' >Deductions - &nbsp;&nbsp;&nbsp;{deductions}</Typography>
                        <Typography variant='caption' className={classes.netIncome}>Net Income - &nbsp;&nbsp;&nbsp;{netIncome}</Typography>

                    </Grid>
                </Collapse>
                </>
            )}
        </div>
    )
}

export default PerAgent;