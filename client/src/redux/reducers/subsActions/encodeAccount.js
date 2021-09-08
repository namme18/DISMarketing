import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { getErrors } from "../errorReducer";

export const encodeAccount = createAsyncThunk('encodeAccount', async({user, account}, {dispatch, rejectWithValue, getState}) => {

    const body = JSON.stringify({
        user,
        account,
    });
    return axios.post('/subs/encodeaccount', body, tokenConfig(getState))
        .then(res => {
            return res.data;
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'FAILED_ENCODE'
            }
            dispatch(getErrors(errData));
        })

});