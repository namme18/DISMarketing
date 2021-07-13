import { createSlice } from "@reduxjs/toolkit";


export const successReducer = createSlice({
    name:'successReducer',
    initialState:{
        msg:{},
        status: null,
        id:null
    },
    reducers:{
        getSuccess: (state, action) => {
            return{
                ...state,
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id
            }
        },

        clearSuccess: (state) => {
            return{
                ...state,
                msg: {},
                status: null,
                id: null
            }
        }
    }
});

export const { getSuccess, clearSuccess } = successReducer.actions;
export default successReducer.reducer;