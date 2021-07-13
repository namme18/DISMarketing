import { createAsyncThunk } from "@reduxjs/toolkit";
import { resetMsg, userLoaded, userLoading } from "../authReducer";
import { getErrors, clearErrors } from '../errorReducer';
import axios from 'axios';


export const resetPassword = createAsyncThunk('resetPassword', async ({resetToken, password}, {dispatch, rejectWithValue}) => {
    dispatch(userLoading());
    //headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    //body
    const body = JSON.stringify({password});

    return axios.put(`/auth/resetpassword/${resetToken}`, body, config)
        .then(result => {
            dispatch(resetMsg(result.data.msg))
            dispatch(clearErrors());
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'AUTH_ERROR'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});