import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { tokenConfig } from '../../../helper/tokenConfig';
import { getErrors } from '../errorReducer';
import { activateExistingAccount } from '../subsReducer';

export const activateAccount = createAsyncThunk('activateAccount', async(data, {dispatch, rejectWithValue, getState}) => {

    const body = JSON.stringify(data);

    return axios.put('/subs/activateaccount', body, tokenConfig(getState))
        .then(res => {
            dispatch(activateExistingAccount(res.data));
            return res.data;
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'ERROR_ENCODING'
            }
            dispatch(getErrors(errData));
            return rejectWithValue(err);
        })

});