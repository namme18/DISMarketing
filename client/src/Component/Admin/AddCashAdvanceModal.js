import { Modal, Container, Grid, IconButton, Tooltip, Paper, Avatar, Typography, Divider, Select, MenuItem, TextField, Button } from '@material-ui/core';
import React,{ useState } from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import { makeStyles } from '@material-ui/core/styles';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import { useSelector, useDispatch } from 'react-redux';
import { getErrors } from '../../redux/reducers/errorReducer';
import { updateForDedutions } from '../../redux/reducers/authActions/updateForDeductions';

const useStyles = makeStyles(theme => ({
    modal: {
        marginTop: '15%'
    },
    avatar:{
        margin: '0 auto'
    },
    paper:{
        padding: theme.spacing(1)
    },
    formContainer:{
        margin: theme.spacing(1, 0)
    },
    form:{
        padding: '0 30px',
        width: '100%'
    },
    textField:{
        margin: theme.spacing(1, 0)
    },
    divider:{
        height: '2px'
    }
}));


const AddCashAdvanceModal = ({openModal, setOpenModal, operation, setOperation}) => {

    const classes = useStyles();

    const users = useSelector(state => state.authReducer?.allUsers);
    const currentUser = useSelector(state => state.authReducer?.user);
    const dispatch = useDispatch();

    const [data, setData] = useState({
        agent: '',
        remarks: '',
        amount: null
    });

    const forDeductionOfSelectedUser = users?.filter(user => user._id === data.agent)[0]?.fordeductions;
    
    const handleCloseModal = (e, reason) => {
        if(reason === 'backdropClick'){
            return;
        }
        setOpenModal(false);
        setOperation({
            ...data,
            isAddCA: false,
            isAddPayments: false
        });
        clearFields();
    }

    const clearFields = () => {
        setData({
            ...data,
            agent: '',
            remarks: '',
            amount: null,
        });
        setOperation({
            ...data,
            isAddCA: false,
            isAddPayments: false
        })
    }

    const onSubmit = e => {
        e.preventDefault();
        const amount = isNaN(parseInt(data.amount));
        if(amount === true || data.agent === '' || data.remarks === ''){
            const errData = {
                msg:'Invalid Input',
                status: 400,
                id: 'TYPO_ERROR'
            }
            return dispatch(getErrors(errData));
        }
        if(operation.isAddCA){
            const [ selectedUser ] = users?.filter(user => user._id === data.agent);
            const existingRemarks = selectedUser.fordeductions?.map(ded => data.remarks.localeCompare(ded.remarks, undefined, {sensitivity: 'base'})).some(res => res === 0);
            if(existingRemarks){
                const errData = {
                    msg:'Remarks already exist!',
                    status: 400,
                    id: 'TYPO_ERROR'
                }
                return dispatch(getErrors(errData));
            }
        }

        if(operation.isAddPayments){
            if(data.remarks.split('|')[1] < data.amount){
                const errData = {
                    msg:'Max deduction reach!',
                    status: 400,
                    id: 'TYPO_ERROR'
                }
                return dispatch(getErrors(errData));
            }
        }
        const dataToSend = {
            ...data,
            status: operation.isAddCA ? 'addCA' : 'addPayments'
        }

        dispatch(updateForDedutions(dataToSend));
        setOpenModal(false);
        clearFields();
    }

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const handleKeyPress = e => {
        if(isNaN(e.key) && e.key !== '.'){
            e.preventDefault();
        };
    }

    return(
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="Subscribers Info"
            aria-describedby="Subscribers Info"
            className={classes.modal}
        >
            <Container component='main' maxWidth='xs'>
                <Paper elevation={6} className={classes.paper}>
                    <Grid container justify='flex-end'>
                        <IconButton style={{padding:0}} onClick={handleCloseModal}>
                            <Tooltip title='Close'>
                                <CancelIcon color='error'/>
                            </Tooltip>
                        </IconButton>
                    </Grid>
                    <Avatar className={classes.avatar}>
                        <CreditCardIcon color='secondary'/>
                    </Avatar>
                    <Grid container alignItems='center' direction='column' className={classes.formContainer}>
                        <Typography variant='h5'>{operation.isAddCA ? 'Add Cash Advance' : 'Add Payments'}</Typography>
                        <Divider orientation='horizontal' className={classes.divider} />
                        <form onSubmit={onSubmit} autoComplete='off' noValidate className={classes.form}>
                            <Select
                                name='agent'
                                inputProps={{'aria-label': 'without-label'}}
                                fullWidth
                                displayEmpty
                                onChange={onChange}
                                className={classes.textField}
                            >
                                <MenuItem disabled><Typography variant='subtitle1' color='textSecondary'>Choose account ...</Typography></MenuItem>
                                {users?.filter(u => u._id !== currentUser._id)?.map(user => (
                                    <MenuItem key={user._id} value={user._id}>{user.username}</MenuItem>
                                ))}
                            </Select>

                            {operation.isAddPayments && (
                                <Select
                                name='remarks'
                                inputProps={{'aria-label': 'without-label'}}
                                fullWidth
                                displayEmpty
                                onChange={onChange}
                                className={classes.textField}
                                >
                                    <MenuItem disabled><Typography variant='subtitle1' color='textSecondary'>Choose remarks ...</Typography></MenuItem>
                                    {forDeductionOfSelectedUser?.map(ded => (
                                        <MenuItem key={ded.remarks} value={`${ded.remarks}|${ded.amount}`}>{`${ded.remarks} - Max = ${ded.amount}`}</MenuItem>
                                    ))}
                                </Select>
                            )}

                            {operation.isAddCA && (
                                <TextField
                                    name='remarks'
                                    onChange={onChange}
                                    fullWidth
                                    className={classes.textField}
                                    placeholder='Reamarks'
                                    label='Remarks'
                                    inputProps={{
                                        style:{textTransform: 'capitalize'}
                                    }}
                                />
                            )}

                            <TextField
                                name='amount'
                                onChange={onChange}
                                placeholder='$'
                                fullWidth
                                label='Amount'
                                onKeyPress={handleKeyPress}
                                className={classes.textField}
                            />

                            <Button
                                type='submit'
                                className={classes.textField}
                                variant='contained'
                                style={{borderRadius:'0'}}
                                fullWidth
                                color='primary'
                            >
                                Submit
                            </Button>
                        </form>
                    </Grid>
                </Paper>
            </Container>
        </Modal>
    )
}

export default AddCashAdvanceModal;