import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading, updateProfilePicture } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { getSuccess } from '../successReducer';

export const addProfilePicture = createAsyncThunk('addProfilePicture', async(profilePicture, {dispatch, rejectWithValue, getState}) => {

    dispatch(userLoading());

    const body = JSON.stringify({profilePicture});

    return axios.post('/auth/addprofilepicture', body, tokenConfig(getState))
        .then(res => {
            dispatch(getSuccess({msg: 'Change Success', status: 200, id: "CHG"}));
            dispatch(clearErrors());
            dispatch(updateProfilePicture(res.data));
            return dispatch(userLoaded());
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'CHANGE_ERROR'
            }
            dispatch(getErrors(errData));
            dispatch(userLoaded());
            return rejectWithValue(err);
        })

})