import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { loadUserSubs } from "../subsReducer";

export const getUserSubs = createAsyncThunk('getUserSubs', async({dateFrom, dateTo, userId}, {dispatch, rejectWithValue, getState}) => {
    dispatch(userLoading());
    return axios.get(`/subs/usersubs?dateFrom=${dateFrom}&dateTo=${dateTo}&userId=${userId}`, tokenConfig(getState))
        .then(subscribers => {
            dispatch(clearErrors());
            dispatch(loadUserSubs(subscribers.data));
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData= ({
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'FETCH_ERROR'
            });
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});