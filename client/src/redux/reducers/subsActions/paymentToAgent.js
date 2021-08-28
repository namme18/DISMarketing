import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { getForPayout } from "./getForPayout";
import { clearSuccess, getSuccess } from "../successReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { removedPaid } from "../subsReducer";
import { updateAllIncentives } from "../authReducer";

export const paymentToAgent = createAsyncThunk('paymentToAgent', async(subscribers, {dispatch, rejectWithValue, getState}) => {

    dispatch(userLoading());

    const body = JSON.stringify(subscribers);

    return axios.post('/subs/paymenttoagent', body, tokenConfig(getState))
        .then(res => {
            const upd = JSON.parse(res.config.data);
            dispatch(getForPayout());
            dispatch(removedPaid(upd));
            dispatch(updateAllIncentives());
            dispatch(clearErrors());
            dispatch(getSuccess({msg:`Matched ${res.data.matched}, Updated ${res.data.updated}`, status: 200, id: 'UPDATE_SUCCESS'}));
            return dispatch(userLoaded());
        })
        .catch(err => {
            console.log(err);
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'UPDATE_FAILED!'
            }
            dispatch(getErrors(errData));
            dispatch(clearSuccess());
            dispatch(userLoaded());
            return rejectWithValue(err);
        })

});