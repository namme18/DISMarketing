import { createAsyncThunk } from '@reduxjs/toolkit';
import { userLoaded, userLoading } from '../authReducer';
import { tokenConfig } from '../../../helper/tokenConfig';
import { addNewSubs } from '../subsReducer';
import { clearErrors, getErrors } from '../errorReducer';
import { clearSuccess, getSuccess } from '../successReducer';
import axios from 'axios';
import DataURLToFile from '../../../helper/DataURLtoFile';

export const addSubs = createAsyncThunk('addSubs', async (subsData, {dispatch, getState, rejectWithValue}) => {
    dispatch(userLoading());
    
    const formData = new FormData();
    subsData.attachments.map((obj, index) => {
        const startIndex = obj.img.indexOf('/')+1;
        const endIndex = obj.img.indexOf(';');
        const extName = obj.img.substring(startIndex, endIndex);
        const file = DataURLToFile(obj.img, `image${index}.${extName}`);
        formData.append('images', file);
    })
    formData.append('details', JSON.stringify(subsData.newSubscriber));
    
    //Headers
    
    const { token } = getState().authReducer;
    
    const config = {
        headers: {
            'Content-Type':'multipart/form-data'
        }
    }
    
    if(token){
        config.headers['authorization'] = `Bearer ${token}`;
    }
    
    //const body = JSON.stringify(newSubscriber);

    return axios.post('/subs/addsubs', formData, config)
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