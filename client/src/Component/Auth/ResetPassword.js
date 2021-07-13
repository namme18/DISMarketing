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
import useStyles from './style';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { clearResetMsg } from '../../redux/reducers/authReducer';
import Alert from '@material-ui/lab/Alert';
import { getErrors } from '../../redux/reducers/errorReducer';
import { resetPassword } from '../../redux/reducers/authActions/resetPassword';
import { useHistory } from 'react-router-dom';

 const ResetPassword = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const { resetToken } = useParams();
    const { msg } = useSelector(state => state.authReducer);
    const error  = useSelector(state => state.errorReducer);

    const [data, setData] = useState({
        password:'',
        confirmpassword: '',
        passwordType: true,
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
                history.push('/');
                dispatch(clearResetMsg());
            },5000);
        }
    }, [msg]);

    const showPassword = () => setData({...data, passwordType: !data.passwordType});

    const onChange = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = e => {
        e.preventDefault();

        if(data.password !== data.confirmpassword){
            const errorData = {
                msg: 'Confirm password do not match!',
                status: 404,
                id: 'AUTH_ERROR'
            }
           return dispatch(getErrors(errorData));
        }

        const resetData = {
            resetToken,
            password : data.password
        }
        dispatch(resetPassword(resetData));
    }

     return(
         <Container component='main' maxWidth='xs'>
             <Paper className={classes.paper} style={{backgroundColor: 'rgba(255,255,255,0.9)'}} elevation={6}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant='h5'>
                    Reset password
                </Typography>

             <form className={classes.form} spacing={5} noValidate autoComplete='off' onSubmit={onSubmit}>
                    {data.errorMsg ? (<Alert severity='error' size='small'>{error.msg}</Alert>): null}
                    {msg ? (<Alert  severity='success' size='small'>{msg}</Alert>): null}
                <br />
                <Grid container spacing={2} >
                    <TextField 
                        className={classes.textfield}
                        name='password'
                        label='New password'
                        placeholder='Enter new password'
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

                        <TextField 
                            className={classes.textfield}
                            name='confirmpassword'
                            label='Confirm new password'
                            placeholder='Confirm new password'
                            fullWidth
                            type='password'
                            onChange={onChange}
                            value={data.confirmpassword}
                            />  
                </Grid>

                <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    fullWidth
                    className={classes.submit}
                    >
                    Submit
                </Button>
             </form>
            </Paper>
         </Container>
     )
 }


 export default ResetPassword;