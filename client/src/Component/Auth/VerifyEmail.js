import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { sendVerifyEmail } from '../../redux/reducers/authActions/sendVerifyEmail';
import { clearResetMsg } from '../../redux/reducers/authReducer';
import { useLocation} from 'react-router-dom';

const Alert = props => {
    return <MuiAlert elevation={6} variant='filled' {...props} />
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2)
        }
    },

    snackbar: {
        '& .MuiAlert-filledWarning': {
        backgroundColor: 'rgba(255,152,0, 0.8)'
        }
    }
}));

const VerifyEmail = () => {
        const classes = useStyles();
        const [open, setOpen] = useState(true);
        const [isAlert, setIsAlert] = useState(true);
        const email = useSelector(state => state.authReducer.user?.email);
        const emailVerified = useSelector(state => state.authReducer.user?.emailVerified);
        const { msg } = useSelector(state => state.authReducer);
        const dispatch = useDispatch();
        const location = useLocation();
        

        const handleClose= (e, reason) => {
            if(reason === 'clickaway'){
                return; 
            }
            setOpen(false);
        }

        useEffect(() => {
            if(msg === 'Verification email sent'){
                setIsAlert(true);
                setOpen(true)
            }
            setTimeout(() => {
                dispatch(clearResetMsg());
                setIsAlert(false);
            }, 15000);
        },[msg]);

        const sendVerification = () => {
                handleClose();
                dispatch(sendVerifyEmail(email));
        }

    return (
        <div className={classes.root}>
            {emailVerified === false && isAlert && location.pathname?.split('/')[2] !== 'verifiedemail' ? 
            <Snackbar 
            className={classes.snackbar}
            open={open} 
            autoHideDuration={msg === 'Verification email sent' ? 15000 : 60000} 
            onClose={handleClose} 
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            >
                <Alert onClose={handleClose} severity={msg === 'Verification email sent' ? 'success' : 'warning'}>{msg === 'Verification email sent' ? msg :'Your email is not yet verified! click here to verify your email'}
                {msg === 'Verification email sent' ? null : (
                <Button color='primary' size='small' onClick={sendVerification}>
                Send verification email!
                </Button>
                )} 
            </Alert>
            </Snackbar> :
            null }
        </div>
    )
}


export default VerifyEmail;