import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { loadSubs } from '../subsReducer';

export const getAllSubs = createAsyncThunk('getAllSubs', async({dateFrom, dateTo}, {dispatch, getState, rejectWithValue}) => {
    dispatch(userLoading());
    return axios.get(`/subs/getallsubs?dateFrom=${dateFrom}&dateTo=${dateTo}`, tokenConfig(getState))
    .then(subscribers => {
            dispatch(loadSubs(subscribers.data));
            dispatch(clearErrors());
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'LOADSUBS_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});