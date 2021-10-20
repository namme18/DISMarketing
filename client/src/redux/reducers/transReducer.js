import { createSlice } from '@reduxjs/toolkit';

export const transReducer = createSlice({
    name: 'transReducer',
    initialState: {
        userTrans: [],
        grandTrans: []
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
        }
    }
});

export const { loadGrandTrans, loadUserTrans } = transReducer.actions;
export default transReducer.reducer;