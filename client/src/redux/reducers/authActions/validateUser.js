import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logoutUser, userLoaded, userLoading, userValidated } from '../authReducer';
import { tokenConfig } from '../../../helper/tokenConfig';
import { getErrors } from '../errorReducer';


export const validateUser = createAsyncThunk('validateUser', async (any, {getState, rejectWithValue, dispatch}) => {
    dispatch(userLoading());
    return axios.post('/auth/validate',tokenConfig(getState) ,tokenConfig(getState))
        .then(user => {
           return dispatch(userValidated(user.data));
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                statue: err.response.status,
                id: 'VALIDATE_ERROR'
            }
            dispatch(getErrors(errData));
            dispatch(logoutUser());
            dispatch(userLoaded());
            return rejectWithValue(err);
        })
});