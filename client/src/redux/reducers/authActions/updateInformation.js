import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { updateUserInfo, userLoaded, userLoading } from "../authReducer";
import { getErrors } from "../errorReducer";
import { getSuccess } from "../successReducer";

export const updateInformation = createAsyncThunk('updateInformation', async(newData, {dispatch, getState, rejectWithValue}) => {

    dispatch(userLoading());

    const body = JSON.stringify(newData);
    return axios.put('/auth/updateinfo', body, tokenConfig(getState))
        .then(res => {
            dispatch(getSuccess({msg: 'Update info', status: 200, id: 'SUCCESS'}));
            dispatch(updateUserInfo(res.data));
            dispatch(userLoaded());
            return res.data;
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'UPDATE_FAILED'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
})