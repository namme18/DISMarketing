import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { loadUnclaimedSubs } from "../subsReducer";

export const getUnclaimedSubs = createAsyncThunk('getUnclaimedSubs', async(obj, {getState, dispatch, rejectWithValue}) => {

    dispatch(userLoading());
    return axios.get('/subs/getunclaimedsubs', tokenConfig(getState))
        .then(res => {
            dispatch(loadUnclaimedSubs(res.data));
            dispatch(clearErrors());
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'ERROR_LOAD'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })

});