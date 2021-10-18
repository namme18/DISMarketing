import React, { useState, useEffect } from 'react';
import { Modal, Stack, Typography, Container, Paper, Avatar, Divider, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import { useDispatch } from 'react-redux';
import { getErrors } from '../../../redux/reducers/errorReducer';

const CancelButton = styled(Button)(({theme}) => ({
    backgroundColor: theme.palette.error.main,
    color: theme.palette.getContrastText(theme.palette.error.main),
    width: '40%',
    borderRadius: '0'
}));

const ProceedButton = styled(Button)(({theme}) => ({
    backgroundColor: theme.palette.success.main,
    color: theme.palette.getContrastText(theme.palette.success.main),
    width: '40%',
    borderRadius: '0'
}));

const ConfirmPaymentModal = ({open, setOpen, handleClickPaid, contentToPrint}) => {

    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const handleCloseModal = (e, reason) => {
        if(reason === 'backdropClick'){
            return;
        }
        setOpen(false);
    }

    const handleClickClose = () => {
        setOpen(false);
    }

    const handleClickCancel = () => {
        setOpen(false);
    }

    const handleClickProceed = () => {
        if(password === ''){
            const errData = {
                msg: 'Please provide password',
                status: 400,
                id: 'FAILED!'
            }
            return dispatch(getErrors(errData));
        }
        handleClickPaid(password);
    }

    const onChange = e => {
        setPassword(e.target.value);
    }

    return(
        <Modal
        open={open}
        onClose={handleCloseModal}
        arial-labelledby='Confirmation modal'
        aria-describedby='Confirmation modal'
        >
           <Container component='main' maxWidth='xs' sx={{marginTop:'15%'}}>
                <Paper elevation={6} sx={{p:1}}>
                    <Stack justifyContent='flex-end' direction='row'>
                        <CancelIcon sx={{cursor:'pointer', color: 'red'}} onClick={handleClickClose}/>
                    </Stack>
                    <Stack direction='column' justifyContent='center' alignItems='center'>
                        <Avatar sx={{height: '60px', width: '60px', bgcolor:theme => theme.palette.warning.light}}><WarningIcon sx={{fontSize: '32px'}}/></Avatar>
                        <Typography variant='h5' sx={{fontWeight:'bold', color: theme => theme.palette.warning.main}}>WARNING!!!</Typography>
                        <Typography variant='p' sx={{mx: '10%'}}>Please enter your password to confirm payment to all checked subscribers!</Typography>
                        <TextField 
                            type='password'
                            name='passowrd'
                            InputLabelProps={{shrink: true}}
                            label='Password'
                            variant='standard'
                            sx={{margin:'16px 0', width: '80%'}}
                            onChange={onChange}
                        />
                    </Stack>
                    <Stack spacing={2} direction='row' justifyContent='center' alignItems='center' sx={{mx:'10%', marginBottom: '16px'}}>
                        <CancelButton onClick={handleClickCancel} variant='contained' startIcon={<CancelIcon />}>Cancel</CancelButton>
                        <ProceedButton onClick={handleClickProceed} variant='contained' startIcon={<CheckIcon />}>Proceed</ProceedButton>
                    </Stack>
                </Paper>
           </Container>
        </Modal>
    )
}

export default ConfirmPaymentModal;