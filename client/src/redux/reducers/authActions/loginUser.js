import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loadUser, logoutUser, userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";

export const loginUser = createAsyncThunk('loginUser', async({email, password},{dispatch, rejectWithValue}) => {
    dispatch(userLoading());
    //headers
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    }
    //body
    const body = JSON.stringify({email,password});

    return axios.post('/auth/login', body, config)
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
            dispatch(logoutUser());
            return rejectWithValue(err);
        })
});