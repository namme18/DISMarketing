import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { getErrors } from "../errorReducer";
import { updateForSpp } from "../subsReducer";
import { getSuccess } from "../successReducer";


export const updateSubsByAdmin = createAsyncThunk('updateSubsByAdmin', (data, {dispatch, getState, rejectWithValue}) => {

    dispatch(userLoading());

    const body = JSON.stringify(data);

    return axios.put('/subs/subsupdatebyadmin', body, tokenConfig(getState))
        .then(res => {
            dispatch(updateForSpp(res.data));
            dispatch(getSuccess({msg: 'Update Successfully', id: 'SAVE', status: 200}));
            dispatch(userLoaded());
            return true;
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'FAILED!'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })

});