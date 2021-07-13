import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { emailVerifiedSuccess } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";


export const emailVerified = createAsyncThunk('emailVerified', async (verifyToken, {dispatch, getState, rejectWithValue}) => {
    dispatch(userLoading());

    return axios.put(`/auth/emailverified/${verifyToken}`, tokenConfig(getState), tokenConfig(getState))
        .then(res => {
            dispatch(emailVerifiedSuccess(res.data));
            dispatch(clearErrors());
            return dispatch(userLoaded);
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'EMAILVERIFICATION_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});