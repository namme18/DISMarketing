import React, { useState, useEffect, useReducer, useRef } from 'react';
import {
    Card,
    CardContent,
    Grid,
    Button,
    Chip,
    Divider,
    Typography,
    LinearProgress,
    Paper,
    Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';
import XLSX from 'xlsx';
import LoopIcon from '@material-ui/icons/Loop';
import { checkSubs } from '../../redux/reducers/subsActions/checkSubs';
import { useDispatch, useSelector } from 'react-redux';
import { resetCheckActivation } from '../../redux/reducers/subsReducer';
import { getErrors } from '../../redux/reducers/errorReducer';
import { activateAccount } from '../../redux/reducers/subsActions/activateAcount';
import { encodeAccount } from '../../redux/reducers/subsActions/encodeAccount';
import { userLoaded, userLoading } from '../../redux/reducers/authReducer';

const useStyles = makeStyles(theme => ({
    input:{
        display: 'none'
    },
    uploadButton:{
        borderRadius:'0',
        fontSize:'x-small',
        width: '100%',
    },
    chip:{
        borderRadius: 0,
        width: '100%',
    },
    matched:{
        padding: theme.spacing(.5)
    },
    paper:{
        borderRadius: 0,
        padding: theme.spacing(1),

    },
    typo:{
        fontSize: 'x-small',
        [theme.breakpoints.down('sm')]:{
            fontSize: 'xx-small',
            width: '35px',
        }
    },
    activate:{
        borderRadius: 0,
        fontSize: 'x-small',
        backgroundColor: theme.palette.success.main,
        color: theme.palette.getContrastText(theme.palette.success.main),
        '&:hover':{
            backgroundColor: theme.palette.success.dark,
            color: theme.palette.getContrastText(theme.palette.success.dark) 
        },
        [theme.breakpoints.down('sm')]:{
            fontSize: theme.spacing(1),
            width: '100%',
            marginTop: '4px'
        }
    },
    matchedBox: {
        [theme.breakpoints.down('sm')]:{
            direction: 'column',
            justifyContent: 'center'
        }
    },
    matchedTypo:{
        [theme.breakpoints.down('xs')]:{
            fontSize: 'x-small'
        }
    },
    processPercent:{
        [theme.breakpoints.down('sm')]:{
            fontSize:'xx-small'
        }
    }
}));

const reducer = (filSubs, action) => {
    switch(action.type){
        case "UPDATEUNMATCHED":
            return {...filSubs, unMatched: [...filSubs.unMatched?.map(sub => sub.COMPLETEACCTNO === action.payload.accountno ? {...sub, STATUS: 'Encoded'} : sub)]}
        case "UPDATEMATCHED":
            return {...filSubs, matched: [...filSubs.matched.map?.(sub => sub.STATUS !== 'Duplicate' && sub.COMPLETEACCTNO === action.payload.COMPLETEACCTNO ? {...sub, STATUS: 'Encoded'} : sub)]};
        case "MATCHED": 
            return {...filSubs, matched: [action.payload.subStatus === 'duplicate' ? {...action.payload, STATUS: 'Duplicate'} : {...action.payload, STATUS: 'Ready'} , ...filSubs.matched]};
        case "UNMATCHED":
            return {...filSubs, unMatched: [{...action.payload, STATUS: 'Ready'}, ...filSubs.unMatched]};
        case "RESET":
            return {...filSubs, matched: [], unMatched: []};
        default:
            return filSubs;
    }
}

const Activation = () => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const [data, setData ] = useState({
        allActivation: null,
        workBookName:'',
        sheetName:'',
        disabledProcess: true,
        disableActivate: true,
    });

    const [filSubs, setFilSubs] = useReducer(reducer, {
        matched: [],
        unMatched: []
    })

    const dataProcessShowCase = useRef(null);

    const checkingActivation = useSelector(state => state.subsReducer.checkingActivation);
    const user = useSelector(state => state.authReducer.user);
    const processPercent = Math.round((checkingActivation?.length/data.allActivation?.length)*100) || 0;

    useEffect(() => {
        if(!data.allActivation){
            dispatch(resetCheckActivation());
        }
    },[data.allActivation]);

    useEffect(() => {
        if(processPercent === 100){
            setData({
                ...data,
                disableActivate: false,
                disabledProcess: true
            });
        }else{
            setData({
                ...data,
                disableActivate: true
            });
        }
    },[processPercent]);

    const onChange = e => {
        const selectedFile = e.target.files[0];
        let fileReader = new FileReader();
        if(selectedFile){
                const lastindex = selectedFile.name?.split('.').length;
                const extName = selectedFile.name?.split('.')[lastindex-1];
                if(extName !== ('xls' && 'xlsx')){
                    const errData = {
                        msg: 'Invalid Selection',
                        status: 400,
                        id: 'ERROR_FILE'
                    }
                    return dispatch(getErrors(errData));
                }
            fileReader.readAsBinaryString(selectedFile);
            fileReader.onload = e => {
                let data = e.target.result;
                const workbook = XLSX.read(data, {type: 'binary'});
                workbook.SheetNames?.forEach(sheetNames => {
                    if(sheetNames === 'DIS' || sheetNames === 'dis'){
                        let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetNames]);
                        return setData({
                                    allActivation: rowObject,
                                    workBookName: selectedFile.name,
                                    sheetName: sheetNames,
                                    disabledProcess: false,
                                    disableActivate: true
                                });
                    }
                })
            }
        }else{
            setData({
                allActivation: null,
                workBookName: '',
                sheetName: '',
                disabledProcess: true,
                disableActivate: true
            });
            setFilSubs({type: "RESET"});
            const errData = {
                msg: 'Invalid Selection',
                status: 400,
                id: 'ERROR_FILE'
            }
            dispatch(getErrors(errData));
        }
    }

    const handleClickProcess = () => {
        dispatch(resetCheckActivation());
            data.allActivation?.map((i, index)=> {
                dispatch(checkSubs(i))
                .then(res => {
                    if(res.payload.status === 'Not Matched'){
                        setFilSubs({type: "UNMATCHED", payload: res.payload.subscriber});
                    }
                    if(res.payload.status === 'Matched' || res.payload.status === 'Duplicate'){
                        setFilSubs({type: "MATCHED", payload: res.payload.status === 'Duplicate' ? {...res.payload.subscriber, subStatus: 'duplicate'} : {...res.payload.subscriber}});
                    }
                })
            })
        }

    const handleMatchedClick = () => {
        const readyCount = filSubs.matched.filter(sub => sub.STATUS === 'Ready').length;
        if(readyCount < 1){
            const errData = {
                msg: 'No data to encode',
                status: 400,
                id: 'ERROR_FILE'
            }
            return dispatch(getErrors(errData));
        }
        filSubs.matched.map(data => {
            dispatch(activateAccount(data))
            .then(res => {
                return setFilSubs({type: "UPDATEMATCHED", payload: res.payload});
            })
        })
    }

    const handleUnMatchedClick = () => {
        const readyCount = filSubs.unMatched.filter(sub => sub.STATUS === 'Ready').length;
        if(readyCount < 1){
            const errData = {
                msg: 'No data to encode',
                status: 400,
                id: 'ERROR_FILE'
            }
            return dispatch(getErrors(errData));
        }

        filSubs.unMatched?.map(account => {
            const data = {
                user,
                account
            }
            dispatch(encodeAccount(data))
                .then(res => {
                    return setFilSubs({type:"UPDATEUNMATCHED", payload: res.payload});
                })
        })
    }

    return(
        <Card elevation={6} className={classes.card}>
            <CardContent>
                <Grid container justify='center' alignItems='center' spacing={1} className={classes.container} direction='row'>
                    <Grid item key='row-length' sm={12} xs={12} md={3} lg={3} xl={3}>
                        <Chip
                            className={classes.chip}
                            label={`Total Activation: ${data.allActivation?.length || 0}`}
                            variant='outlined'
                            clickable
                            color='secondary'
                        />
                    </Grid>

                    <Grid item key='sheet-name' sm={12} xs={12} md={3} lg={3} xl={3}>
                        <Chip
                            sm={12}
                            className={classes.chip}
                            label={`Sheet Name: ${data.sheetName}`}
                            variant='outlined'
                            clickable
                            color='secondary'
                        />
                    </Grid>

                    <Grid item key='workbook-name' sm={12} xs={12} md={3} lg={3} xl={3}>
                        <Chip
                            sm={12}
                            className={classes.chip}
                            label={`File Name: ${data.workBookName}`}
                            variant='outlined'
                            clickable
                            color='secondary'
                        />
                    </Grid>
                    
                    <Grid item key='upload-buton' sm={12} xs={12} md={1} lg={1} xl={1}>
                        <input name='upload' accept='application/vnd.ms-excel' value={data.upload} onChange={onChange} className={classes.input} type='file' id='contained-button-file' />
                        <label htmlFor='contained-button-file'>
                            <Button variant='contained' color='secondary' component='span' className={classes.uploadButton} startIcon={<PublishIcon />}>upload</Button>
                        </label>
                    </Grid>

                    <Grid item key='process-button' sm={12} xs={12} md={2} lg={2} xl={2}>
                        <Button variant='contained' disabled={data.disabledProcess} onClick={handleClickProcess} color='secondary' className={classes.uploadButton} startIcon={<LoopIcon />}>process</Button>
                    </Grid>
                </Grid>
                <br/>
                <Divider/>
                <Grid container spacing={1} alignItems='center' direction='row' justify='center' style={{marginTop:'8px'}}>
                    <Grid item key='progress-bar' xs={11}>
                        <LinearProgress variant='determinate' value={(checkingActivation?.length/data.allActivation?.length)*100 || 0} />
                    </Grid>
                    <Grid item xs={1} key='percent-progress' justify='center' alignItems='center'>
                        <Typography className={classes.processPercent} variant='body2' align='center' color='textSecondary'>{`${processPercent}%`}</Typography>
                    </Grid>
                </Grid>

                <Grid container ref={dataProcessShowCase} direction='row' justify='center' style={{marginTop: '8px'}}>
                    <Grid className={classes.matched} key='matched' item xs={6}>
                       <Paper className={classes.paper} elevation={6}>
                            <Grid item container key='matched' className={classes.matchedBox} direction='row' justify='space-between' alignItems='center'>
                                <Typography variant='body2' className={classes.matchedTypo}>No. Matched Activation: {filSubs.matched.length}</Typography>
                                <Button onClick={handleMatchedClick} variant='contained' disabled={data.disableActivate} className={classes.activate}>Activate</Button>
                            </Grid>
                           <Divider style={{marginBottom: '8px', marginTop:'8px'}} />
                            {filSubs.matched?.map((sub, index) => (
                                <>
                                <Grid item key={index} container direction='row'>
                                    <Typography display='block' noWrap className={classes.typo} style={{flexGrow: '1'}} variant='body2' color='textSecondary'>{`${index+1}: ${sub.SUBSCRIBERNAME}`}</Typography>
                                    <Typography style={sub.STATUS === 'Duplicate' ? {color: 'red'}: {color: '#4caf50'}} className={classes.typo}>{sub.STATUS}</Typography>
                                </Grid>
                                </>
                            ))}
                       </Paper>
                    </Grid>
                    <Grid className={classes.matched} key='unmatched' item xs={6}>
                        <Paper className={classes.paper} elevation={6}>
                            <Grid item container key='unmatched' className={classes.matchedBox} direction='row' justify='space-between' alignItems='center'>
                                <Typography variant='body2' className={classes.matchedTypo}>No. Not Matched Activation: {filSubs.unMatched.length}</Typography>
                                <Button onClick={handleUnMatchedClick} variant='contained' disabled={data.disableActivate} className={classes.activate}>Activate</Button>
                            </Grid>
                            <Divider style={{marginBottom: '8px', marginTop:'8px'}} />
                            {filSubs.unMatched?.map((sub, index) => (
                                <>
                                <Grid item key={index} container direction='row'>
                                    <Typography display='block' noWrap className={classes.typo} style={{flexGrow: '1'}} variant='body2' color='textSecondary'>{`${index+1}: ${sub.SUBSCRIBERNAME}`}</Typography>
                                    <Typography style={{color: '#4caf50'}} className={classes.typo}>{sub.STATUS}</Typography>
                                </Grid>
                                </>
                            ))}
                       </Paper>
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    )
}

export default Activation;