import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { tokenConfig } from "../../../helper/tokenConfig";
import { loadCheckActivation } from '../subsReducer';

export const checkSubs = createAsyncThunk('checkSubs', async(i, {dispatch, rejectWithValue, getState}) => {


    const body = JSON.stringify(i);
    return axios.post('/subs/checksubs', body, tokenConfig(getState))
        .then(res => {
            dispatch(loadCheckActivation(res.data));
            return res.data;
        })
        .catch(err => {
            return rejectWithValue(err);
        })

});
