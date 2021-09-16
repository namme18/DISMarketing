import { createSlice } from "@reduxjs/toolkit";

export const subsReducer = createSlice({
    name:'subsReducer',
    initialState:{
        subscribers: [],
        usersubs:[],
        appsgen: [],
        agentIncome:[],
        checkedSubs:[],
        checkingActivation:[],
        unclaimedSubs: [],
        forpayout: null
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
                usersubs: [action.payload, ...state.usersubs]
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
                checkedSubs: [...state.checkedSubs.filter(ch => ch.agentId === action.payload.map(sub => `${sub.agent} ||`))],
                agentIncome: [...state.agentIncome.filter(ch => ch.agentId === action.payload.map(sub => `${sub.agent} ||`))]
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
        }
    }
});

export const { loadSubs, loadUnclaimedSubs, resetCheckActivation, loadCheckActivation, addNewSubs, loadUserSubs, agentUpdateSingleSubs, loadAppsGen, forPayoutList, addAgentIncome, loadCheckedSubs, removedPaid } = subsReducer.actions;
export default subsReducer.reducer;