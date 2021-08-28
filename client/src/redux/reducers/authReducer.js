import { createSlice } from "@reduxjs/toolkit";

export const authReducer = createSlice({
    name: 'authReducer',
    initialState:{
        user: JSON.parse(localStorage.getItem('user')),
        allUsers: null,
        token: JSON.parse(localStorage.getItem('token')),
        isAuthenticated: false,
        isLoading: false,
        msg:null,
    },
    reducers: {
        loadUser: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', JSON.stringify(action.payload.token));
            return{
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true
            }
        },

        logoutUser: () => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return{
                user: {},
                token: null,
                isAuthenticated: false
            }
        },

        userLoading: (state) => {
            return{
                ...state,
                isLoading: true
            }
        },

        userLoaded: (state) => {
            return{
                ...state,
                isLoading: false,
            }
        },

        userValidated: (state, action) => {
            localStorage.setItem('user', JSON.stringify(action.payload));
            return{
                ...state,
                isLoading:false,
                isAuthenticated: true,
                user: action.payload,
            }
        },

        resetMsg: (state, action) => {
            return{
                ...state,
                msg:action.payload
            }
        },

        clearResetMsg: (state) => {
            return{
                ...state,
                msg: null
            }
        },

        emailVerifiedSuccess: (state, action) => {
            return{
                ...state,
                user: action.payload
            }
        },

        loadAllUsers: (state, action) => {
            return {
                ...state,
                allUsers: action.payload
            }
        },

        approvedUser: (state, action) => {
            return {
                ...state,
                allUsers:[
                    ...state.allUsers.map(user => user._id === action.payload._id ? action.payload : user)
                ]
            }
        },

        updateAllUsers: (state, action) => {
            return{
                ...state,
                allUsers: [...state.allUsers.map(user => user._id === action.payload._id ? action.payload : user)]
            }
        },

        updateAllIncentives: (state, action) => {
            return{
                ...state,
                allUsers: [...state.allUsers.map(user => {return {...user, incentives: [], deductions: [], fordeductions: [...user.fordeductions.filter(ded => ded.amount > 0)]}})]
            }
        }
    }
});

export const { loadUser, updateAllIncentives, updateAllUsers,  logoutUser, userLoading, userLoaded, userValidated, resetMsg, clearResetMsg, emailVerifiedSuccess, loadAllUsers, approvedUser } = authReducer.actions;
export default authReducer.reducer;