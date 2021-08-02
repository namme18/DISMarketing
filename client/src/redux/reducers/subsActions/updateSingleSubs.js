import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { getErrors, clearErrors } from "../errorReducer";
import { agentUpdateSingleSubs } from "../subsReducer";
import { clearSuccess, getSuccess } from "../successReducer";

export const updateSingleSubs = createAsyncThunk('updateSingleSubs', async(updatedSubs,{dispatch, rejectWithValue, getState}) => {

    dispatch(userLoading());    
    const body = JSON.stringify(updatedSubs);

    return axios.put('/subs/agentupdate', body, tokenConfig(getState))
        .then(upSubs => {
            dispatch(agentUpdateSingleSubs(upSubs.data));
            dispatch(clearErrors());
            dispatch(getSuccess({msg:'Subscriber successfully updated!', status:200, id: 'UPDATE_SUCCESS'}));
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id:'UPDATE_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(clearSuccess());
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});