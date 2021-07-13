import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadUser, userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import axios from 'axios';


export const registerUser = createAsyncThunk('registerUser', async ({firstname,middlename,lastname,email,password}, {dispatch, rejectWithValue}) => {
    dispatch(userLoading());
    const username = `${firstname} ${middlename} ${lastname}`;
    const config = {
        headers:{
            'Content-type':'application/json'
        }
    }

    const body = JSON.stringify({username,email,password});
    return axios.post('/auth/register', body, config)
        .then(user => {
            dispatch(loadUser(user.data));
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
            return rejectWithValue(err.response);
        })

});