import React, { useState, useEffect, useRef } from 'react';
import {
    Collapse,
    Grid, 
    Typography,
    Box,
    Tooltip,
    TextField,
    Select,
    MenuItem,
} from '@material-ui/core';
import useStyles from './style';
import PerSubs from './PerSubs';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { addAgentIncome, setClearCSToFalse } from '../../../redux/reducers/subsReducer';
import { useDispatch, useSelector } from 'react-redux';
import { loadCheckedSubs } from '../../../redux/reducers/subsReducer';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import { getErrors } from '../../../redux/reducers/errorReducer';
import { removeIncentivesDeductions } from '../../../redux/reducers/authActions/removeIncentivesDeductions';
import { addIncentivesDeductions } from '../../../redux/reducers/authActions/addIncentivesDeductions';
import domtoimage from 'dom-to-image';

const PerAgent = ({agent, teamleader, forpayout, grandTotalPayout, setImagePerAgent}) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const clearCS = useSelector(state => state.subsReducer.clearCS);
    const [showSubs, setShowSubs] = useState(true);
    const [checkedSubs, setCheckedSubs] = useState([]);
    const payout = checkedSubs?.filter(sub => sub.agent === agent._id).map(sub => parseInt(sub.plan)).reduce((a, b) => a + b, 0).toFixed(2);
    const subscribers = forpayout?.filter(sub => sub.agent === agent._id);
    const commiPercentage = subscribers.length <= 4 ? .40 : subscribers.length >= 5 ? .50 : null;
    const VAT = .05;
    const SSS = 0;
    const PHIC = 0;
    const HDMF = 0;
    const totalCommi = parseFloat(payout*commiPercentage);
    const VSPH = parseFloat((totalCommi*VAT)+SSS+PHIC+HDMF).toFixed(2);
    const incentives = agent.incentives?.map(inc => parseFloat(inc.amount)).reduce((a, b) => a + b, 0).toFixed(2);
    const deductions = agent.deductions?.map(ded => parseFloat(ded.amount)).reduce((a, b) => a + b, 0).toFixed(2);
    const totalDeductions = parseFloat(deductions)+parseFloat(VSPH);
    const netIncome = (parseFloat(totalCommi)+parseFloat(incentives)-parseFloat(totalDeductions));

    const [data, setData] = useState({
        addIncentives:false,
        addDeductions: false,
        showIncentives: false,
        showDeductions: false,
        remarks: '',
        amount: ''
    })

    const payoutContent = useRef();
    
    const handleClickAgent = () => {
        setShowSubs(!showSubs);
    }

    const handleclickIncentives = () => {
        setData({
            ...data,
            showIncentives: !data.showIncentives,
            addIncentives: false,
        })
    }

    const handleclickDeductions = () => {
        setData({
            ...data,
            showDeductions: !data.showDeductions,
            addDeductions: false,
        })
    }

    const handleAddIncentives = () => {
        clearRA();
        setData({
            ...data,
            addIncentives: !data.addIncentives,
            type:'incentives'
        });
        if(!data.showIncentives){
            setData({
                ...data,
                showIncentives: true,
                addIncentives: true,
            });
        }
    }

    const handleRemoveIncentives = (remarks) => {
        const dataRemove = {
            type: 'incentives',
            userId: agent._id,
            remarks: remarks
        }

       dispatch(removeIncentivesDeductions(dataRemove));
    }

    const handleAddDeductions = () => {
        clearRA();
        setData({
            ...data,
            addDeductions: !data.addDeductions,
            type:'deductions'
        });
        if(!data.showDeductions){
            setData({
                ...data,
                showDeductions: true,
                addDeductions: true,
            });
        }
    }

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    
    const handleRemoveDeductions = (remarks) => {
        const dataRemove = {
            type: 'deductions',
            userId: agent._id,
            remarks: remarks
        }

       dispatch(removeIncentivesDeductions(dataRemove));
    }

    const handleSaveDeductions = () => {
        const futureNetIncome = parseFloat(netIncome)-parseFloat(data.amount);
        if(data.remarks === '' || data.amount === '' || futureNetIncome < 0 || data.amount > parseFloat(data.remarks.split(',')[1])){
            const errData = {
                msg: 'Please fillout required fields! or exceed deductions limit',
                status: 400,
                id: 'ADD_FAILED'
            }
            return dispatch(getErrors(errData));
        }

        const addData = {
            type: 'deductions',
            userId: agent._id,
            remarks: data.remarks.split(',')[0],
            amount: data.amount
        }
        dispatch(addIncentivesDeductions(addData))
            setData({
                ...data,
                addDeductions: false,
                remarks: '',
                amount: ''
            });
    }
    
    const handleKeyDown = e => {
        if(e.key.match(/[^0-9.]/g)?.length > 0){
            e.preventDefault();
        };
    }

    const handleSaveIncentives = () => {
        
        if(data.remarks === '' || data.amount === ''){
            const errData = {
                msg: 'Please fillout required fields!',
                status: 400,
                id: 'ADD_FAILED'
            }
            return dispatch(getErrors(errData));
        }
        const addData = {
            type: 'incentives',
            userId: agent._id,
            remarks: data.remarks,
            amount: data.amount
        }
        dispatch(addIncentivesDeductions(addData))
            setData({
                ...data,
                addIncentives: false,
                remarks: '',
                amount: ''
            });
    }

    const clearRA = () => {
        setData({
            ...data,
            amount: '',
            remarks: '',
        });
    }
    

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
        if(payoutContent.current){
            domtoimage.toPng(payoutContent.current)
                .then(res =>{
                    const data = {
                        image: res,
                        id: agent._id
                    }
                    setImagePerAgent({type: "ADDIMAGE", payload: data});
                })
        }
    },[netIncome]);

    useEffect(() => {
            const data = {
                agentId: agent._id,
                id:teamleader._id,
                plan: netIncome
            }
            dispatch(addAgentIncome(data));
        },[netIncome]);

    useEffect(() => {
        if(clearCS){
            setCheckedSubs([]);
            setTimeout(() => {
                dispatch(setClearCSToFalse());
            },1000);
        }
    },[clearCS]);
        
    return(
        <div>
            {payout > 1 && (
                <div ref={payoutContent}>
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
                        <Box display='flex' justifyContent='flex-end' direction='row' alignItems='center'>
                           {data.addIncentives ?  <Tooltip title='Cancel'><CloseIcon onClick={handleAddIncentives} className={classes.incentivesDeductions} /></Tooltip> : <Tooltip title='Add'><AddIcon onClick={handleAddIncentives} className={classes.incentivesDeductions}/></Tooltip>}
                            {data.showIncentives ? <KeyboardArrowUpIcon className={classes.arrow} /> : <KeyboardArrowDownIcon className={classes.arrow} />}
                            <Typography variant='caption' style={{cursor: 'pointer'}} onClick={handleclickIncentives}>Incentives - &nbsp;&nbsp;&nbsp;{incentives}</Typography>
                        </Box>

                            <Collapse in={data.showIncentives} timeout='auto' unmountOnExit >
                                <Grid container item key='incentives' direction='column' alignItems='flex-end' justify='flex-start'>
                                {agent.incentives?.map((inc, index) => (
                                    <div key={index}>
                                     <Box display='flex' justifyContent='flex-end' direction='row' alignItems='center'>
                                        <Tooltip title='remove'><RemoveIcon onClick={() => handleRemoveIncentives(inc.remarks)} className={classes.incentivesDeductions} /></Tooltip>
                                        <Typography variant='caption' className={classes.perSubs} color='textSecondary'>{inc.remarks?.split(' ').map(fl => fl[0].toUpperCase()+fl.substring(1)).join(' ')} - &nbsp;&nbsp;&nbsp;{parseFloat(inc.amount).toFixed(2)}</Typography>
                                    </Box>
                                    </div>
                                ))}

                                <Collapse in={data.addIncentives} timeout='auto' unmountOnExit>
                                    <Box display='flex' justifyContent='flex-end' direction='row' alignItems='center'>
                                        <form noValidate>
                                            <Tooltip title='Save'><SaveIcon onClick={handleSaveIncentives} type='submit' className={classes.incentivesDeductions} /></Tooltip>
                                            <TextField 
                                                style={{width: '60px'}}
                                                className={classes.IDTF}
                                                type='text'
                                                name='remarks'
                                                placeholder='Remarks'
                                                onChange={onChange}
                                                autoFocus
                                                inputProps={{
                                                    style:{textTransform: 'capitalize'}
                                                }}
                                            />
                                            &nbsp;&nbsp;
                                            <TextField
                                                onChange={onChange}
                                                style={{width: '40px'}}
                                                className={classes.IDTF}
                                                type='text'
                                                onKeyPress={handleKeyDown}
                                                name='amount'
                                                placeholder='$'
                                            />
                                        </form>
                                    </Box>
                                </Collapse>
                                </Grid>
                            </Collapse>

                        <Box display='flex' justifyContent='flex-end' direction='row' alignItems='center'>
                        {data.addDeductions ?  <Tooltip title='Cancel'><CloseIcon onClick={handleAddDeductions} className={classes.incentivesDeductions} /></Tooltip> : <Tooltip title='Add'><AddIcon onClick={handleAddDeductions} className={classes.incentivesDeductions}/></Tooltip>}
                            {data.showDeductions ? <KeyboardArrowUpIcon className={classes.arrow} /> : <KeyboardArrowDownIcon className={classes.arrow} />}
                            <Typography variant='caption' style={{cursor: 'pointer'}} color='secondary' onClick={handleclickDeductions}>Deductions - &nbsp;&nbsp;&nbsp;{totalDeductions}</Typography>
                        </Box>

                        <Collapse in={data.showDeductions} timeout='auto' unmountOnExit >
                                <Grid container item key='deductions' direction='column' alignItems='flex-end' justify='flex-start'>
                                <Typography variant='caption' className={classes.perSubs} color='textSecondary'>VSPH - &nbsp;&nbsp;&nbsp;{parseFloat(VSPH).toFixed(2)}</Typography>
                                {agent.deductions?.map((ded, index) => (
                                    <div key={index}>
                                     <Box display='flex' justifyContent='flex-end' direction='row' alignItems='center'>
                                        <Tooltip title='remove'><RemoveIcon onClick={() => handleRemoveDeductions(ded.remarks)} className={classes.incentivesDeductions} /></Tooltip>
                                        <Typography variant='caption' className={classes.perSubs} color='textSecondary'>{ded.remarks?.split(' ').map(fl => fl[0].toUpperCase()+fl.substring(1)).join(' ')} - &nbsp;&nbsp;&nbsp;{parseFloat(ded.amount).toFixed(2)}</Typography>
                                    </Box>
                                    </div>
                                ))}

                                <Collapse in={data.addDeductions} timeout='auto' unmountOnExit>
                                    <Grid item container key='addDeductions' justify='flex-end' direction='row' alignItems='center'>
                                            <Tooltip title='Save'><SaveIcon onClick={handleSaveDeductions} type='submit' className={classes.incentivesDeductions} /></Tooltip>
                                            <Select
                                                style={{width: '80px', fontSize:'x-small'}}
                                                className={classes.IDTF}
                                                name='remarks'
                                                displayEmpty
                                                onChange={onChange}
                                            >
                                                <MenuItem disabled><Typography variant='caption' color='textSecondary'>Choose...</Typography></MenuItem>
                                                {agent.fordeductions.map((ded, index) => (
                                                    <MenuItem key={index} value={[ded.remarks,ded.amount].join(',')}><Typography variant='caption' color='textSecondary'>{`${ded.remarks} - max = ${ded.amount}`}</Typography></MenuItem>
                                                ))}
                                            </Select> 
                                            &nbsp;&nbsp;
                                            <TextField
                                                onChange={onChange}
                                                style={{width: '40px'}}
                                                className={classes.IDTF}
                                                type='text'
                                                onKeyPress={handleKeyDown}
                                                name='amount'
                                                placeholder='$'
                                            />
                                    </Grid>
                                </Collapse>
                                </Grid>
                            </Collapse>

                            <Typography variant='caption' className={classes.netIncome}>Net Income - &nbsp;&nbsp;&nbsp;{netIncome.toFixed(2)}</Typography>

                    </Grid>
                </Collapse>
                </div>
            )}
        </div>
    )
}

export default PerAgent;