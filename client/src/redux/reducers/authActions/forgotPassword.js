import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { resetMsg, userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";

export const forgotPassword = createAsyncThunk('forgotPassword', async (email, {dispatch, rejectWithValue}) => {
    dispatch(userLoading);
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    const body = JSON.stringify({email})
    return axios.post('/auth/forgotpassword', body, config)
        .then(result => {
            dispatch(resetMsg(result.data.msg));
            dispatch(userLoaded());
           return dispatch(clearErrors());
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
        });
});