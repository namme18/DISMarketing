import React, { useState, useEffect } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { clearSuccess } from '../redux/reducers/successReducer';

const Alert = props => {
    return <MuiAlert variant='filled' elevation={6} {...props} />
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2)
        }
    },

    snackbar: {
        '& .MuiAlert-filledSuccess': {
        backgroundColor: 'rgba(76,175,80, 0.8)'
        }
    }
}));

const SuccessSnackbar = () => {

    const success = useSelector(state => state.successReducer);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(true);

    const onClose = () => {
        setOpen(false)
        dispatch(clearSuccess());
    }

    useEffect(() => {
        if(success.id){
            setOpen(true);
        }
    },[success.id]);
    
    return(
        <>
        {success.id !== null ? (
            <Snackbar
                className={classes.snackbar}
                open={open}
                autoHideDuration={4000}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
            >
                <Alert
                    onClose={onClose}
                    severity='success'
                >
                    {`${success.id}: ${success.msg}`}
                </Alert>
            </Snackbar>
        ) : null
            }
        </>
    )
}

export default SuccessSnackbar;