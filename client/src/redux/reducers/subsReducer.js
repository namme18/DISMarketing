import { createSlice } from "@reduxjs/toolkit";

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
        },

        addNewSubs: (state, action) => {
            return{
                ...state,
                subscribers: [action.payload, ...state.subscribers]
            }
        }
    }
});

export const { loadSubs, addNewSubs } = subsReducer.actions;
export default subsReducer.reducer;