import React, { useEffect } from 'react';
import { 
    Typography,
    CircularProgress,
    Grid,
    Snackbar
} from '@material-ui/core';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { emailVerified } from '../../redux/reducers/authActions/emailVerified';

const VerifiedEmail = () => {
    const verifyToken = useParams().verifyToken;
    const user = useSelector(state => state.authReducer.user);
    const error = useSelector(state => state.errorReducer);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if(user.emailVerified){
            setTimeout(() => {
                return history.push('/');
            }, 6000);
        }

        if(error.id === 'EMAILVERIFICATION_FAIL'){
            setTimeout(() => {
                return history.push('/');
            }, 4000);
        }
    },[user?.emailVerified, error.id]);

    useEffect(() => {
        if(!user?.emailVerified){
            dispatch(emailVerified(verifyToken));
        }
    },[]);

    return (
        <Grid container justify='center' alignItems='center' direction='column'>
            {!user?.emailVerified ? (
            <>
            <Grid item>
                <CircularProgress />
                <Typography variant='h6' component='p'>
                Verifying Token....
            </Typography>
            </Grid>
            </>
            ) : (
                <>
                <Grid item>
                    <Typography variant='h6' color='success'>
                        Email successfully verified!...redirecting...
                    </Typography>
                 </Grid>
                </>
            )
            }
        </Grid>
    )
}

export default VerifiedEmail;