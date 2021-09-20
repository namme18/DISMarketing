import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { removedSingleClaimedSubs } from "../subsReducer";
import { clearSuccess, getSuccess } from "../successReducer";

export const replaceClaimedSubs = createAsyncThunk('replaceClaimedSubs', async(newData, {dispatch, getState, rejectWithValue}) =>{

    dispatch(userLoading());
    
    const body = JSON.stringify(newData);

    return axios.put('/subs/replaceclaimedsubs', body, tokenConfig(getState))
        .then(res => {
            dispatch(clearErrors());
            dispatch(getSuccess({msg:'Done Approved!', status: 200, id:'SUCCESS'}));
            dispatch(removedSingleClaimedSubs(res.data));
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id:'APPROVRD_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(clearSuccess());
            dispatch(userLoaded());
            return rejectWithValue(err);
        })

})