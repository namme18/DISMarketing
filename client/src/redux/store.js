import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/authReducer';
import errorReducer from './reducers/errorReducer';

export default configureStore({
    reducer:{
        authReducer: authReducer,
        errorReducer: errorReducer
    }
});
