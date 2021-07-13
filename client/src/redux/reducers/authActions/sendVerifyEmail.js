import { createAsyncThunk } from '@reduxjs/toolkit';
import { resetMsg, userLoaded, userLoading } from '../authReducer';
import { tokenConfig } from '../../../helper/tokenConfig';
import { clearErrors, getErrors } from '../errorReducer';
import axios from 'axios';


export const sendVerifyEmail = createAsyncThunk('sendVerifyEmail', async(email, {dispatch, rejectWithValue, getState}) => {
    dispatch(userLoading());
    const body = JSON.stringify({email});
    return axios.post('/auth/verifyemail', body, tokenConfig(getState))
        .then(res => {
            dispatch(resetMsg(res.data.msg));
            dispatch(clearErrors());
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'EMAILVERIFICATION_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});