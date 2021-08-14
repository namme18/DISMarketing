import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { forPayoutList } from "../subsReducer";

export const getForPayout = createAsyncThunk('getForPayout', async(obj, {dispatch, rejectWithValue, getState}) => {
    dispatch(userLoading);
    return axios.get('/subs/forpayout', tokenConfig(getState))
        .then(subs => {
            dispatch(forPayoutList(subs.data));
            dispatch(clearErrors);
            return dispatch(userLoaded);
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'GETPAYOUT_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});