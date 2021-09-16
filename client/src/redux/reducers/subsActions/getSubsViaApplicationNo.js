import { createAsyncThunk } from "@reduxjs/toolkit";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { getErrors } from "../errorReducer";
import axios from 'axios';

export const getSubsViaApplicationNo = createAsyncThunk('getSusbsViaApplicationNo', async({applicationno2, claimant}, {dispatch, getState, rejectWithValue}) => {

    dispatch(userLoading());
    const userId = claimant._id;
    return axios.get(`/subs/subsviaapplicationno?applicationno=${applicationno2}&userId=${userId}`, tokenConfig(getState))
        .then(res => {
            dispatch(userLoaded());
            return res.data;
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'ERROR_LOADSUBS'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })

});