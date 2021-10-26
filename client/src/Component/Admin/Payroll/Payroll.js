import React,{ useEffect, useState, useRef, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    Grid,
    Typography,
    CardContent,
    Button,
} from '@material-ui/core';
import { Divider } from '@mui/material';
import dislogo from '../../../images/converge-logo.png'
import {format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import PerTeam from './PerTeam';
import { getForPayout } from '../../../redux/reducers/subsActions/getForPayout';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import PaymentIcon from '@material-ui/icons/Payment';
import { getErrors } from '../../../redux/reducers/errorReducer';
import { paymentToAgent } from '../../../redux/reducers/subsActions/paymentToAgent';
import ConfirmPaymentModal from './ConfirmPaymentModal';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import domtoimage from 'dom-to-image';

const useStyles = makeStyles(theme => ({
    card:{
       // maxHeight: '63vh',
        //overflowY: 'scroll'
    },
    container:{
        marginBottom: theme.spacing(2),
    },
    container2:{
        paddingRight: theme.spacing(2)
    },
    headertext:{
        [theme.breakpoints.down('sm')]:{
            fontSize:'small'
        }
    },
    arrow:{
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        color: theme.palette.success.main,
        marginLeft: theme.spacing(.3),
        [theme.breakpoints.down('sm')]:{
            fontSize:'small'
        }
    },
    paidButton:{
        lineHeight: '12px',
        fontWeight: 'bold',
        borderRadius: '0',
        [theme.breakpoints.down('sm')]:{
            fontSize:'x-small'
        },
        '& .MuiButton-iconSizeSmall > *:first-child':{
            [theme.breakpoints.down('sm')]:{
                fontSize:'small'
            }
        }
    }
}));

const reducer = (imagePerAgent, action) => {
    switch(action.type){
        case "ADDIMAGE":
            return [...imagePerAgent.filter(agent => agent.id !== action.payload.id), action.payload]
    }
}

const Payroll = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const allUsers = useSelector(state => state.authReducer.allUsers);
    const forpayout = useSelector(state => state.subsReducer.forpayout);
    const checkedSubs = useSelector(state => state.subsReducer.checkedSubs);
    const agentIncome = useSelector(state => state.subsReducer.agentIncome);
    const grandTotalPayout = agentIncome.map(ai => parseFloat(ai.plan)).reduce((a, b) => a + b, 0).toFixed(2);
    const [cs, setCs] = useState();
    const checkedSubsCount = [];
    const filteredCheckedSubs = checkedSubs?.map(sub => sub.subs).filter(sub => sub.length > 0);
    const isHaveNegative = agentIncome.map(ai => ai.plan < 0 ? 1 : 0).reduce((a, b) => a + b, 0);

    const [open, setOpen] = useState(false);
    const contentToPrint = useRef();
    const [myImage, setMyImage] = useState('');
    const [imagePerAgent, setImagePerAgent] = useReducer(reducer, []);

    const handleClickPrint = useReactToPrint({
        content: () => contentToPrint.current,
        pageStyle: "",
        documentTitle: 'DISMarketing-Payout'
    })

    useEffect(() => {
        if(checkedSubs.length > 0){
                filteredCheckedSubs.map(subs => subs.map(su => checkedSubsCount.push(su)))
        }
        setCs(checkedSubsCount);
        
        if(contentToPrint.current){
            domtoimage.toPng(contentToPrint.current)
                .then(dataUrl => {
                    setMyImage(dataUrl);
                })
        }
    },[checkedSubs]);

    const teamLeaders = allUsers?.filter(user => user.restrictionlevel !== 'agent');

    const [data, setData] = useState({});
    
    useEffect(() => {
        dispatch(getForPayout());
    }, [dispatch]);

    const handleClickPaid = (password) => {
        if(isHaveNegative > 0){
            const errData = {
                msg: 'Please remove negative payout',
                status: 400,
                id:'PAYMENT_FAILED'
            }
           return dispatch(getErrors(errData));
        }
       if(grandTotalPayout < 1){
           const errData = {
               msg: 'No Subscriber to pay',
               status: 400,
               id:'PAYMENT_FAILED'
           }
          return dispatch(getErrors(errData));
       }
       const subscribers = cs;
       dispatch(paymentToAgent({subscribers, password, myImage, imagePerAgent})).then(res => {
           if(res.payload){
               setOpen(false);
           }
       });
    }

    const handleClickConfirm = () => {
        setOpen(true);
    }

    return(
        <Card elevation={6} className={classes.card} ref={contentToPrint}>
            <CardContent>
                <ConfirmPaymentModal open={open} setOpen={setOpen} handleClickPaid={handleClickPaid} contentToPrint={contentToPrint}/>
                <Grid container direction='row' justify='flex-end'><PrintIcon style={{marginRight: '10px', cursor:'pointer'}} onClick={handleClickPrint}/></Grid>
                <Grid container direction='row' alignItems='center' justify='center' spacing={2} className={classes.container}>
                    <Grid item key='DISMarketing'>
                        <img alt='DISMarketing' src={dislogo} style={{height:80}} />
                    </Grid>
                    <Grid item key='headers'>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='h6' comnponent='p'>DIS Marketing Services</Typography>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='subtitle1' comnponent='p' color='textSecondary'>San Andres, Victorial, Tarlac</Typography>
                        <Typography align='center' style={{lineHeight:'17px'}} variant='subtitle1' comnponent='p' color='textSecondary'>Date: {format(new Date(), 'do MMMM Y')}</Typography>
                    </Grid>
                </Grid>
                <Grid container className={classes.container2} direction='row' justify='flex-end' alignItems='center' spacing={2}>
                    <Typography variant='subtitle1' className={classes.headertext}>{cs?.length}</Typography>
                    <CheckBoxIcon className={classes.arrow} />
                    <Typography variant='subtitle2' >&nbsp;Subscribers, Total</Typography>
                    <Typography variant='subtitle1' className={classes.headertext}>&nbsp;P<strong>{grandTotalPayout}</strong></Typography>

                </Grid>
                <Grid container style={{paddingTop:'4px', paddingBottom: '4px'}} className={classes.container2} direction='row' justify='flex-end' alignItems='center' spacing={2}>
                    <Button
                    color='primary'
                    variant='outlined'
                    size='small'
                    disableElevation
                    className={classes.paidButton}
                    startIcon={<PaymentIcon />}
                    onClick={handleClickConfirm}
                    >
                        mark as paid
                    </Button>
                </Grid>
                {teamLeaders?.map((teamleader) => (
                <PerTeam key={teamleader._id} setImagePerAgent={setImagePerAgent} grandTotalPayout={grandTotalPayout} teamleader={teamleader} allusers={allUsers} forpayout={forpayout} seData={setData} data={data} />
                ))}
                <Divider sx={{width: '100%', mt: 5, mb:2}}>End Of Payment</Divider>
            </CardContent>
        </Card>
    )
}

export default Payroll;