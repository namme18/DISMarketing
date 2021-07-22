import { createAsyncThunk } from '@reduxjs/toolkit';
import { userLoaded, userLoading } from '../authReducer';
import { tokenConfig } from '../../../helper/tokenConfig';
import { addNewSubs } from '../subsReducer';
import { clearErrors, getErrors } from '../errorReducer';
import { clearSuccess, getSuccess } from '../successReducer';
import axios from 'axios';

export const addSubs = createAsyncThunk('addSubs', async (newSubscriber, {dispatch, getState, rejectWithValue}) => {
    dispatch(userLoading());

    const body = JSON.stringify(newSubscriber);

    return axios.post('/subs/addsubs', body, tokenConfig(getState))
        .then(subs => {
            dispatch(addNewSubs(subs.data));
            dispatch(clearErrors());
            dispatch(getSuccess({msg:'Successfully added', status: 200, id: 'ADD_SUCCESS'}));
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'ADDNEWSUBS_FAIL'
            }
            dispatch(getErrors(errData));
            dispatch(clearSuccess());
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});