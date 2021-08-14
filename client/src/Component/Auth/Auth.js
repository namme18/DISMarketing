import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Typography,
    Button,
    Grid,
    Avatar,
    InputAdornment,
    IconButton,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import useStyles from './style';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/reducers/authActions/registerUser';
import { loginUser } from '../../redux/reducers/authActions/loginUser';
import { getErrors } from '../../redux/reducers/errorReducer';
import { clearResetMsg } from '../../redux/reducers/authReducer';
import { forgotPassword } from '../../redux/reducers/authActions/forgotPassword';
import ErrorSnackbar from '../../helper/ErrorSnackbar';

const Auth = () => {

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const error = useSelector(state => state.errorReducer);
    const { isAuthenticated, msg } = useSelector(state => state.authReducer);

    const [data, setData] = useState({
        isLogin: true,
        isSignUp: false,
        isForgotPassword: false,
        passwordType: true,
        firstname: '',
        lastname: '',
        middlename: '',
        email: '',
        password: '',
        confirmpassword: '',
        errorMsg: null,
    });

    useEffect(() => {
        if(error.id === 'AUTH_ERROR'){
            setData({
                ...data,
                errorMsg: error.msg
            });
            setTimeout(() => {
                setData({
                    ...data,
                    errorMsg: null
                })
            },3000);
        }
    }, [error]);

    useEffect(() => {
        if(msg){
            setTimeout(() => {
                dispatch(clearResetMsg());
            },10000);
        }
    }, [msg]);

    useEffect(() => {
        if(isAuthenticated) return history.push('/home');
        if(data.isLogin){
            history.push('/auth/login');
        }
    },[history, isAuthenticated]);

    const showPassword = () => {
        setData({
            ...data,
            passwordType: !data.passwordType
        });
    }

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }

    const onSubmit = e => {
        e.preventDefault();
        //----SignUp
        if(data.isSignUp){
            const { firstname, middlename, lastname, email, password, confirmpassword } = data;
            if(password !== confirmpassword){
                const errorData = {
                    msg: 'Confirm password do not match!',
                    status: 404,
                    id: 'AUTH_ERROR'
                }
               return dispatch(getErrors(errorData));
            }
            const newUser = {
                firstname, 
                middlename, 
                lastname, 
                email, 
                password
            }

            dispatch(registerUser(newUser));
        }
        //----Login
        if(data.isLogin){
            const { email, password } = data;

            const user = {
                email,
                password
            }

            dispatch(loginUser(user));
        }
        //----forgot password
        if(data.isForgotPassword){
            dispatch(forgotPassword(data.email))
        }
    }

    const switchIsSignUp = () => {
        setData({
            ...data,
            isSignUp: true,
            isLogin: false,
            isForgotPassword: false,
        });
        history.push('/auth/register');
    }

    const switchIsLogin = () => {
        setData({
            ...data,
            isSignUp: false,
            isLogin: true,
            isForgotPassword: false
        });
        history.push('/auth/login');
    }

    const switchIsForgotPassword = () => {
        setData({
            ...data,
            isSignUp: false,
            isLogin: false,
            isForgotPassword: true
        });
        history.push('/auth/forgotpassword');
    }

    return (
        <Container component='main' maxWidth='xs' >
            <Paper className={classes.paper} style={{backgroundColor: 'rgba(255,255,255,0.9)'}} elevation={6}>
                <ErrorSnackbar />
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>
                    {data.isLogin ? 'Login' : data.isSignUp ? 'SignUp' : 'Forgot Password'}
                </Typography>

                <form className={classes.form} spacing={5} noValidate onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        {data.isSignUp && (
                            <>
                                <TextField
                                    className={classes.textfield}
                                    name='firstname'
                                    label='First name'
                                    placeholder='Enter first Name'
                                    onChange={onChange}
                                    fullWidth
                                    type='text'
                                    autoFocus
                                    value={data.firstname}
                                    inputProps={{
                                        style:{textTransform: 'capitalize'}
                                    }}
                                />

                                <TextField
                                    className={classes.textfield}
                                    name='middlename'
                                    label='Middle name'
                                    placeholder='Enter middle name'
                                    onChange={onChange}
                                    fullWidth
                                    type='text'
                                    value={data.middlename}
                                    inputProps={{
                                        style:{textTransform: 'capitalize'}
                                    }}
                                />

                                <TextField 
                                    className={classes.textfield}
                                    name='lastname'
                                    label='Last name'
                                    placeholder='Enter last name'
                                    onChange={onChange}
                                    fullWidth
                                    type='text'
                                    value={data.lastname}
                                    inputProps={{
                                        style:{textTransform: 'capitalize'}
                                    }}
                                />
                            </>
                        )}
                                <TextField 
                                    className={classes.textfield}
                                    name='email'
                                    label='Email'
                                    placeholder='Enter valid email'
                                    onChange={onChange}
                                    fullWidth
                                    type='text'
                                    value={data.email}
                                />
                        {!data.isForgotPassword && (
                                <TextField 
                                    className={classes.textfield}
                                    name='password'
                                    label='Password'
                                    placeholder='Enter password'
                                    type={data.passwordType ? 'password' : 'text'}
                                    fullWidth
                                    value={data.password}
                                    onChange={onChange}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton onClick={showPassword}>
                                                    {data.passwordType ? <Visibility/> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />      
                        )}
                        {data.isSignUp && (
                            <>
                                <TextField 
                                    className={classes.textfield}
                                    name='confirmpassword'
                                    label='Confirm Password'
                                    placeholder='Confirm Password'
                                    fullWidth
                                    type='password'
                                    onChange={onChange}
                                    value={data.confirmpassword}
                                />
                            </>
                        )}
                    </Grid>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        disabled={data.isDisabled}
                        className={classes.submit}
                    >
                        {data.isSignUp ? 'Sign Up' : data.isLogin ? 'Sign In' : 'Submit'}
                    </Button>
                </form>
                    <Grid container alignItems='flex-end' direction='column'>
                            <Grid item>
                                {data.isSignUp || data.isForgotPassword ? (<Typography variant='caption' component='p'>Already have an account? <Link to='/auth/login' onClick={switchIsLogin}>Sign In</Link></Typography>) : null}
                                {data.isLogin || data.isForgotPassword ? (<Typography variant='caption' component='p'>Don't have an account? <Link to='/auth/register' onClick={switchIsSignUp}>Sign Up</Link></Typography>) : null}
                            </Grid>
                            <Grid item>
                                {data.isSignUp || data.isLogin ? (<Typography variant='caption' component='p'><Link to='/auth/forgotpassword' onClick={switchIsForgotPassword}>Forgot Password?</Link></Typography>) : null}
                            </Grid>
                    </Grid>
            </Paper>
        </Container>
    )
}

export default Auth;