import { createSlice } from "@reduxjs/toolkit";
import { default_type } from "mime";

export const subsReducer = createSlice({
    name:'subsReducer',
    initialState:{
        subscribers: [],
    },
    reducers:{
        loadSubs: (state, action) => {
            return{
                ...state,
                subscribers: action.payload
            }
        }
    }
});

export const { getAllSubs } = subsReducer.actions;
export default subsReducer.reducer;