import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading, updateProfilePicture } from "../authReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { getSuccess } from '../successReducer';
import DataURLToFile from "../../../helper/DataURLtoFile";

export const addProfilePicture = createAsyncThunk('addProfilePicture', async(profilePicture, {dispatch, rejectWithValue, getState}) => {

    dispatch(userLoading());
    const startIndex = profilePicture.indexOf('/')+1;
    const endIndex = profilePicture.indexOf(';');
    const extName = profilePicture.substring(startIndex, endIndex);
    const file = DataURLToFile(profilePicture, `profilePic.${extName}`);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', 'sample description');

    const { token } = getState().authReducer;

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    if(token){
        config.headers['authorization'] = `Bearer ${token}`;
    }

    return axios.post('/auth/addprofilepicture', formData, config)
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