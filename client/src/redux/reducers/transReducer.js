import { createSlice } from '@reduxjs/toolkit';

export const transReducer = createSlice({
    name: 'transReducer',
    initialState: {
        userTrans: null,
        grandTrans: null
    },
    reducers:{
        loadUserTrans: (state, action) => {
            return{
                ...state,
                userTrans: action.payload
            }
        },

        loadGrandTrans: (state, action) => {
            return{
                ...state,
                grandTrans: action.payload
            }
        },

        addGrandTrans: (state, action) => {
            return{
                ...state,
                grandTrans: [action.payload, ...state.grandTrans]
            }
        },

        addUserTrans: (state, action) => {
            return{
                ...state,
                userTrans: [action.payload, ...state.userTrans]
            }
        },

        clearDataTrans: (state, action) => {
            return{
                ...state,
                userTrans: null,
                grandTrans: null
            }
        }
    }
});

export const { loadGrandTrans, clearDataTrans, loadUserTrans, addGrandTrans, addUserTrans } = transReducer.actions;
export default transReducer.reducer;