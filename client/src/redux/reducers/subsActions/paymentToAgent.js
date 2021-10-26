import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { getForPayout } from "./getForPayout";
import { clearSuccess, getSuccess } from "../successReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { removedPaid } from "../subsReducer";
import { updateAllIncentives } from "../authReducer";
import { getUserTrans } from '../transActions/getUserTrans';
import { getGrandTrans } from '../transActions/getGrandTrans';

export const paymentToAgent = createAsyncThunk('paymentToAgent', async({subscribers, password, myImage, imagePerAgent}, {dispatch, rejectWithValue, getState}) => {

    dispatch(userLoading());

    const body = JSON.stringify({subscribers, password, myImage, imagePerAgent});

    return axios.post('/subs/paymenttoagent', body, tokenConfig(getState))
        .then(res => {
            const upd = JSON.parse(res.config.data).subscribers;
            dispatch(getForPayout());
            dispatch(removedPaid(upd));
            dispatch(updateAllIncentives());
            dispatch(clearErrors());
            dispatch(getUserTrans());
            dispatch(getGrandTrans());
            dispatch(getSuccess({msg:`Matched ${res.data.matched}, Updated ${res.data.updated}`, status: 200, id: 'UPDATE_SUCCESS'}));
            dispatch(userLoaded());
            return true;
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'UPDATE_FAILED!'
            }
            dispatch(getErrors(errData));
            dispatch(clearSuccess());
            dispatch(userLoaded());
            rejectWithValue(err);
            return false;
        })

});