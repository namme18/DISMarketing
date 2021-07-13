import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoading, approvedUser, userLoaded } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";

export const processApprovedUser = createAsyncThunk('approvedUser', async({id, isApproved, teamleader, restrictionlevel}, {dispatch, getState, rejectWithValue}) => {
    dispatch(userLoading());

    const body = JSON.stringify({id, isApproved, teamleader, restrictionlevel})

    return axios.put('/auth/approveduser', body, tokenConfig(getState))
        .then(res => {
            dispatch(approvedUser(res.data));
            dispatch(clearErrors());
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id:'CANT_APPROVED'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});