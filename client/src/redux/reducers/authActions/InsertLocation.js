import { createAsyncThunk } from '@reduxjs/toolkit';
import { tokenConfig } from '../../../helper/tokenConfig';
import { getErrors } from '../errorReducer';
import axios from 'axios';
import { updateUserLocation } from '../authReducer';

export const InsertLocation = createAsyncThunk('InsertLocation', async(dataLoc, {getState, dispatch, rejectWithValue}) => {

    const body = JSON.stringify(dataLoc);
    return axios.post('/auth/insertlocationinfo', body, tokenConfig(getState))
        .then(res => {
            updateUserLocation(res.data);
            return res.data.inoutinfo;
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id:'INSERT_FAIL'
            }
            dispatch(getErrors(errData));
            return rejectWithValue(err);
        })

});