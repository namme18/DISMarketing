import React, { useState, useEffect } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors } from '../redux/reducers/errorReducer';
import { makeStyles } from '@material-ui/core/styles';

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
        '& .MuiAlert-filledError': {
        backgroundColor: 'rgba(244,67,54, 0.8)'
        }
    }
}));

const ErrorSnackbar = () => {

    const error = useSelector(state => state.errorReducer);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(true);

    const onClose = () => {
        setOpen(false)
        dispatch(clearErrors());
    }

    useEffect(() => {
        if(error.id){
            setOpen(true);
        }
    },[error.id]);
    
    return(
        <>
        {error.id !== null ? (
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
                    severity='error'
                >
                    {`${error.id}: ${error.msg}`}
                </Alert>
            </Snackbar>
        ) : null
            }
        </>
    )
}

export default ErrorSnackbar;