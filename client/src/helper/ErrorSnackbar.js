import React, { useState, useEffect } from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { Snackbar } from '@material-ui/core';
import useStyles from '../Component/Layout/style';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors } from '../redux/reducers/errorReducer';

const Alert = props => {
    return <MuiAlert variant='filled' elevation={6} {...props} />
}

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