import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { getErrors } from "../errorReducer";
import { loadForSpp } from "../subsReducer";

export const getForSpp = createAsyncThunk('getForSpp', async(obj, {getState, dispatch, rejectWithValue}) => {

    return axios.get('/subs/getforspp', tokenConfig(getState))
        .then(res => {
            return dispatch(loadForSpp(res.data));
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'GET FORSPP ERROR'
            }
            dispatch(getErrors(errData));
            return rejectWithValue(err);
        })

});