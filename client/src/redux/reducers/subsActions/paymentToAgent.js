import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { tokenConfig } from "../../../helper/tokenConfig";
import { userLoaded, userLoading } from "../authReducer";
import { getForPayout } from "./getForPayout";
import { clearSuccess, getSuccess } from "../successReducer";
import { clearErrors, getErrors } from "../errorReducer";
import { removedPaid } from "../subsReducer";
import { updateAllIncentives } from "../authReducer";
import { addGrandTrans, addUserTrans } from "../transReducer";
import DataURLToFile from '../../../helper/DataURLtoFile';

export const paymentToAgent = createAsyncThunk('paymentToAgent', async({subscribers, password, myImage, imagePerAgent}, {dispatch, rejectWithValue, getState}) => {
    
    dispatch(userLoading());
    const formData = new FormData();
    const mainTransImageFile = DataURLToFile(myImage, `mainTransaction.png`);
    formData.append('images', mainTransImageFile);

    imagePerAgent.map(imageURL => {
        if(imageURL.image.length > 30){
            const file = DataURLToFile(imageURL.image, `${imageURL.id}.png`);
            formData.append('images', file);
        }
    })
    formData.append('details', JSON.stringify({subscribers, password}));
    //Headers
    const { token } = getState().authReducer;

    const config = {
        headers:{
            'Content-Type':'multipart/form-data'
        }
    }

    if(token){
        config.headers['authorization'] = `Bearer ${token}`;
    }

    return axios.post('/subs/paymenttoagent', formData, config)
        .then(res => {
            console.log(res);
            const upd = res.data.subscribers;
            dispatch(getForPayout());
            dispatch(removedPaid(upd));
            dispatch(updateAllIncentives());
            dispatch(clearErrors());
            if(res.data.userTrans){
                dispatch(addUserTrans(res.data.userTrans));
            }
            dispatch(addGrandTrans(res.data.grandTrans));
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