import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { updateDedutions } from "../authReducer";
import { clearSuccess, getSuccess } from "../successReducer";

export const updateForDedutions = createAsyncThunk('updateForDeductions', async({agent, remarks, amount},{dispatch, getState, rejectWithValue}) => {

    dispatch(userLoading());

    const body = JSON.stringify({
        agent,
        remarks,
        amount
    })
    
    return axios.post('/auth/adddeductions', body, tokenConfig(getState))
    .then(res => {
        dispatch(clearErrors());
        dispatch(updateDedutions(res.data));
        dispatch(getSuccess({msg: 'Add', status: 200, id:'SUCCESS'}));
        return dispatch(userLoaded());
    })
    .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'FAIL_ADDING'
            }
            dispatch(getErrors(errData));
            dispatch(clearSuccess());
            dispatch(userLoaded());
            return rejectWithValue(err);
        })

});