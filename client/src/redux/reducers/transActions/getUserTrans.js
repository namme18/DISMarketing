import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { userLoaded, userLoading } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { loadUserTrans } from "../transReducer";
import { tokenConfig } from "../../../helper/tokenConfig";

export const getUserTrans = createAsyncThunk('getUserTrans', async(obj, {dispatch, rejectWithValue, getState}) => {

    dispatch(userLoading());

    return axios.get('/trans/getusertransactions', tokenConfig(getState))
        .then(res => {
            dispatch(clearErrors());
            dispatch(loadUserTrans(res.data));
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'GETTING TRANS FAILED!'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })

});