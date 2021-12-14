import { createSlice } from "@reduxjs/toolkit";

export const subsReducer = createSlice({
    name:'subsReducer',
    initialState:{
        subscribers: null,
        usersubs:null,
        appsgen: null,
        agentIncome:[],
        checkedSubs:[],
        checkingActivation:[],
        unclaimedSubs: null,
        forpayout: null,
        clearCS: false,
        forspp: null
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
                usersubs: [action.payload, ...state.usersubs],
                appsgen: [action.payload, ...state.appsgen]
            }
        },

        loadUserSubs: (state, action) => {
            return{
                ...state,
                usersubs: action.payload
            }
        },

        agentUpdateSingleSubs: (state, action) => {
            return{
                ...state,
                usersubs: [...state.usersubs.map(sub => action.payload._id === sub._id ? action.payload : sub)]
            }
        },

        loadAppsGen: (state, action) => {
            return{
                ...state,
                appsgen: action.payload
            }
        },

        forPayoutList: (state, action) => {
            return{
                ...state,
                forpayout: action.payload
            }
        },

        addAgentIncome: (state, action) => {
            return{
                ...state,
                agentIncome: [
                    ...state.agentIncome.filter(agent => agent.agentId !== action.payload.agentId),
                    {agentId:action.payload.agentId, id: action.payload.id, plan: action.payload.plan}
                    
                ]
            }
        },

        loadCheckedSubs: (state, action) => {
            return{
                ...state,
                checkedSubs: [
                    ...state.checkedSubs.filter(agent => agent.agentId !== action.payload.agentId),
                    action.payload
                ]
            }
        },

        removedPaid: (state, action) => {
            return{
                ...state,
                clearCS: true,
                checkedSubs: [...state.checkedSubs.filter(ch => ch.agentId === action.payload.map(sub => `${sub.agent} ||`))],
                agentIncome: [...state.agentIncome.filter(ch => ch.agentId === action.payload.map(sub => `${sub.agent} ||`))]
            }
        },

        setClearCSToFalse: (state, action) => {
            return{
                ...state,
                clearCS: false,
            }
        },

        loadCheckActivation: (state, action) => {
            return{
                ...state,
                checkingActivation: [...state.checkingActivation, action.payload]
            }
        },

        resetCheckActivation: (state, action) =>{
            return{
                ...state,
                checkingActivation: []
            }
        },

        loadUnclaimedSubs: (state, action) => {
            return{
                ...state,
                unclaimedSubs: action.payload
            }
        },

        removedSingleClaimedSubs: (state, action) => {
            return{
                ...state,
                unclaimedSubs: [...state.unclaimedSubs.filter(sub => sub._id !== action.payload._id)]
            }
        },

        encodeNewAccount: (state, action) => {
            return{
                ...state,
                subscribers: [action.payload, ...state.subscribers]
            }
        },

        activateExistingAccount: (state, action) => {
            return{
                ...state,
                subscribers: [...state.subscribers.map(sub => sub._id === action.payload._id ? action.payload : sub)]
            }
        },

        clearDataSubs: (state, action) => {
            return{
                ...state,
                subscribers: null,
                unclaimedSubs: null,
                usersubs: null
            }
        },

        loadForSpp: (state, action) => {
            return{
                ...state,
                forspp: action.payload
            }
        },

        updateForSpp: (state, action) => {
            return{
                ...state,
                forspp: [...state.forspp.map(sub => sub._id === action.payload._id ? action.payload : sub)],
                usersubs: [action.payload, ...state.usersubs.filter(sub => sub._id !== action.payload._id)]
            }
        }
    }
});

export const { activateExistingAccount, updateForSpp, loadForSpp, clearDataSubs, encodeNewAccount, removedSingleClaimedSubs, loadSubs, loadUnclaimedSubs, resetCheckActivation, loadCheckActivation, addNewSubs, loadUserSubs, agentUpdateSingleSubs, loadAppsGen, forPayoutList, addAgentIncome, loadCheckedSubs, removedPaid, setClearCSToFalse } = subsReducer.actions;
export default subsReducer.reducer;