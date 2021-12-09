import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { loadAllUsers, userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";

export const getAllUsers = createAsyncThunk('getAllUsers', async(obj, {getState, dispatch, rejectWithValue}) => {
    dispatch(userLoading());
    return axios.get('/auth/allusers', tokenConfig(getState))
        .then(users => {
            dispatch(loadAllUsers(users.data));
            dispatch(clearErrors());
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                statue: err.response.status,
                id: 'AUTHENTICATION_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});