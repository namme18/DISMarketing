import { configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/authReducer';
import errorReducer from './reducers/errorReducer';
import subsReducer from './reducers/subsReducer';
import successReducer from './reducers/successReducer';
import transReducer from './reducers/transReducer';

export default configureStore({
    reducer:{
        authReducer: authReducer,
        errorReducer: errorReducer,
        subsReducer: subsReducer,
        successReducer: successReducer,
        transReducer: transReducer
    }
});
