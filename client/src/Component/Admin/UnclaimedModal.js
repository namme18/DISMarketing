import React, { useEffect, useState, useReducer } from 'react';
import{
    Modal,
    Container,
    Paper,
    Grid,
    IconButton,
    Tooltip,
    Avatar,
    Typography,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    Button
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useDispatch } from 'react-redux';
import { getSubsViaApplicationNo } from '../../redux/reducers/subsActions/getSubsViaApplicationNo';
import { getErrors } from '../../redux/reducers/errorReducer';
import { replaceClaimedSubs } from '../../redux/reducers/subsActions/replaceClaimedSubs';

const useStyles = makeStyles(theme => ({
    modal: {
        marginTop: '10%'
    },
    avatar:{
        margin: '0 auto',
        height: theme.spacing(6),
        width: theme.spacing(6),
    },
    paper:{
        padding: theme.spacing(1)
    },
    formContainer:{
        margin: theme.spacing(1, 0)
    },
    tableContainer:{
        margin: theme.spacing(1, 0, 1, 0),
        '& .MuiTableCell-sizeSmall':{
            padding: '2px 2px'
        }
    },
    button:{
        borderRadius: 0,
        width: '50%',
        margin: '0 auto'
    }
}));

const UnclaimedModal = ({openModal, setOpenModal, newData}) => {
    
    const classes = useStyles();
    const dispatch = useDispatch();

    const [data, setData] = useState({
        claimantSubs: null,
        disabledButton: true,
    });

    const overallPercent = [];

    const handleCloseModal = (e, reason) => {
        if(reason === 'backdropClick'){
            return;
        }
        setOpenModal(false);
    }

    const claimantName = newData && newData.claimant.username.split(' ')?.map(name => name[0].toUpperCase()+name.substring(1)).join(' ');

    useEffect(() => {
        if(newData){
            dispatch(getSubsViaApplicationNo(newData))
                .then(res => {
                    if(res.error) {
                        setData({claimantSubs: null});
                        setOpenModal(false);
                        return dispatch(getErrors({msg: 'No subscriber match!', status: 400, id:'NO DATA FOUND'}));
                    }
                    setData({
                        ...data,
                        claimantSubs: res.payload
                    });
                })
        }
    },[newData]);

    useEffect(() => {
        if(data.claimantSubs){
            if(!data.claimantSubs.ispaidtoagent && !data.claimantSubs.isActive){
                setData({
                    ...data,
                    disabledButton: false
                });
            }
        }
    },[data.claimantSubs]);

    //const re = /NA,|,/gi
    //const test = data.claimantSubs?.address.replace(re, (match) => { return ''; });

    const handleApprovedClick = () => {
        dispatch(replaceClaimedSubs(newData));
        setOpenModal(false);
        setData({
            ...data,
            disabledButton: true
        });
    }
    
    const items = [
        {
            itemName: 'Full Name',
            claimant: data.claimantSubs?.fullname.map(name => name[0].toUpperCase()+name.substring(1).toLowerCase()).join(' '),
            unclaimed: newData?.fullname.map(name => name[0].toUpperCase()+name.substring(1).toLowerCase()).join(' ')
        },
        {
            itemName: 'Address',
            claimant: data.claimantSubs?.address.split(' ').map(add => add[0].toUpperCase()+add.substring(1).toLowerCase()).join(' '),
            unclaimed: newData?.address.replace(/ /g, '').split(',').filter(addr => addr !== ('na' && 'NA')).map(add => add[0].toUpperCase()+add.substring(1).toLowerCase()).join(' ')
        },
        {
            itemName: 'Email',
            claimant: data.claimantSubs?.email,
            unclaimed: newData?.email
        },
        {
            itemName: 'Contact#',
            claimant: data.claimantSubs?.contactno,
            unclaimed: newData?.contactno.replace('+', '')
        },
        {
            itemName: 'Account#',
            claimant: data.claimantSubs?.accountno,
            unclaimed: newData?.accountno
        },
        {
            itemName: 'Plan',
            claimant: data.claimantSubs?.packagename,
            unclaimed: newData?.packagename
        }
    ]

    return(
        <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="Subscribers Info"
        aria-describedby="Subscribers Info"
        className={classes.modal}
        >
            <Container component='main' maxWidth='sm'>
                <Paper elevation={6} className={classes.paper}>
                    <Grid container justify='flex-end'>
                        <IconButton style={{padding:0}} onClick={handleCloseModal}>
                            <Tooltip title='Close'>
                                <CancelIcon color='error' />
                            </Tooltip>
                        </IconButton>
                    </Grid>
                    <Avatar className={classes.avatar}>
                        <AccountCircleIcon color='secondary' fontSize='large'/>
                    </Avatar>

                    <Grid container direction='column' alignItem='center' className={classes.detailsContainer}>
                        <Grid key='claimant' container item direction='row' justify='center' alignItems='flex-end'>
                            <Typography variant='h6'>Asses Claimant: &nbsp;</Typography>
                            <Typography variant='subtitle1' color='textSecondary'>{claimantName}</Typography>
                        </Grid>
                        {data.claimantSubs?.ispaidtoagent && (
                            <Typography variant='body2' color='error'><strong>!Warning:</strong>&nbsp;Unable to approved claimant subscriber due to it is already paid!</Typography>
                        )}
                        {data.claimantSubs?.isActive && (
                            <Typography variant='body2' color='error'><strong>!Warning:</strong>&nbsp;Unable to approved claimant subscriber due to it is already active!</Typography>
                        )}
                        <TableContainer component={Paper} className={classes.tableContainer}>
                            <Table stickyHeader aria-label='comparison' size='small' className={classes.table}>
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell style={{width:'15%'}} align='left' className={classes.tableHeaderCell}>
                                            <Typography variant='subtitle2' style={{fontWeight:'bold'}}>Pointers</Typography>
                                        </TableCell>
                                        <TableCell style={{width:'40%'}} align='left' className={classes.tableHeaderCell}>
                                            <Typography variant='subtitle2' style={{fontWeight:'bold'}}>Claimant Subscriber</Typography>
                                        </TableCell>
                                        <TableCell style={{width:'40%'}} align='left' className={classes.tableHeaderCell}>
                                            <Typography variant='subtitle2' style={{fontWeight:'bold'}}>Unclaimed Subscriber</Typography>
                                        </TableCell>
                                        <TableCell style={{width:'5%'}}  align='left' className={classes.tableHeaderCell}>
                                            <Typography variant='subtitle2' style={{fontWeight:'bold'}}>%</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className={classes.tableBody}>
                                    {data.claimantSubs && items.map(item => {
                                        const itemLength = Math.round(100/item.unclaimed?.split(' ').length);
                                        const totalPercent = item.unclaimed?.split(' ')?.map(str => item.claimant?.search(new RegExp(str, 'i')) !== -1 ? itemLength : 0).reduce((a, b) => a + b, 0) || 0;
                                        overallPercent.push(totalPercent);
                                       return (<TableRow>
                                            <TableCell align='left'>
                                                <Typography variant='caption' style={{fontWeight:'bold'}}>{item.itemName}</Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography variant='caption' color='textSecondary' style={{fontWeight:'bold'}}>{item.claimant}</Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography variant='caption' color='textSecondary' style={{fontWeight:'bold'}}>{item.unclaimed}</Typography>
                                            </TableCell>
                                            <TableCell align='left'>
                                                <Typography variant='caption' color='textSecondary' style={{fontWeight:'bold'}}>{totalPercent}%</Typography>
                                            </TableCell>
                                        </TableRow>)
                                    })}
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell align='left'>
                                            <Typography variant='subtitle1' style={{fontWeight:'bold'}}>Ovar all Total</Typography>
                                        </TableCell>
                                        <TableCell align='left'>
                                            <Typography variant='subtitle1' style={{fontWeight:'bold'}}>{Math.round((overallPercent.reduce((a, b) => a + b, 0)/600)*100)}%</Typography>
                                        </TableCell>
                                    </TableRow>

                                </TableBody>
                            </Table>
                        </TableContainer>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='small'
                                        className={classes.button}
                                        disabled={data.disabledButton}
                                        onClick={handleApprovedClick}
                                    >
                                        approved
                                    </Button>
                    </Grid>

                </Paper>
            </Container>
        </Modal>
    )
}

export default UnclaimedModal;