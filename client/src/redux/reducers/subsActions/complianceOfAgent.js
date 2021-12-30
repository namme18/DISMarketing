import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { userLoading } from "../authReducer";
import { getErrors } from "../errorReducer";

export const complianceOfAgent = createAsyncThunk('complianceOfAgent', async (data, {dispatch, rejectWithValue, getState}) => {
    //dispatch(userLoading());

    const formData = new FormData();
    const files = Object.values(data.files);
    files.map(file => {
        formData.append('images', file)
    })
    
    formData.append('details', JSON.stringify(data.details));

    //headers
    const { token } = getState().authReducer;

    const config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }

    if(token){
        config.headers['authorization'] = `Bearer ${token}`
    }

    return axios.put('/subs/agentcompliance', formData, config)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {
            const errData = {
                msg: err.response.data.msg,
                status: err.response.status,
                id: 'ERROR'
            }

            dispatch(getErrors(errData));
        })

});