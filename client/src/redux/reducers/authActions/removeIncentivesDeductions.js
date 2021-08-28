import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { updateAllUsers, userLoaded, userLoading } from "../authReducer";
import { getErrors, clearErrors } from "../errorReducer";
import { getSuccess, clearSuccess } from '../successReducer';

export const removeIncentivesDeductions = createAsyncThunk('removeIncentivesDeductions', async({type, userId, remarks}, {dispatch, rejectWithValue, getState}) => {

    dispatch(userLoading());

    const body = JSON.stringify({type, userId, remarks});


    return axios.put('/subs/removeincentivesdeductions', body, tokenConfig(getState))
        .then(user => {
            dispatch(updateAllUsers(user.data));
            dispatch(getSuccess({msg: 'Remove Success!', status: 200, id: 'SUCCESS'}));
            dispatch(clearErrors());
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'REMOVE_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(clearSuccess());
            dispatch(userLoaded());
            return rejectWithValue(err);
        });

});