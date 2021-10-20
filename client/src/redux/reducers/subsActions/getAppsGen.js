import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { loadAppsGen } from "../subsReducer";

export const getAppsGen = createAsyncThunk('getAppsGen', async(obj, {dispatch, rejectWithValue, getState}) => {

    dispatch(userLoading());
    const todayDate = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}T00:00:00.00Z`;

    return axios.get(`/subs/appsgen?todayDate=${todayDate}`, tokenConfig(getState))
        .then(appsgen => {
            dispatch(clearErrors());
            dispatch(loadAppsGen(appsgen.data));
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'GETAPPSGEN_FAIL'
            };
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err)
        })

});