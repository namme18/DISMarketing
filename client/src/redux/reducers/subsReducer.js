import { createSlice } from "@reduxjs/toolkit";

export const subsReducer = createSlice({
    name:'subsReducer',
    initialState:{
        subscribers: [],
        usersubs:[],
        appsgen: [],
        agentIncome:[],
        checkedSubs:[],
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
        }
    }
});

export const { loadSubs, addNewSubs, loadUserSubs, agentUpdateSingleSubs, loadAppsGen, forPayoutList, addAgentIncome, loadCheckedSubs } = subsReducer.actions;
export default subsReducer.reducer;