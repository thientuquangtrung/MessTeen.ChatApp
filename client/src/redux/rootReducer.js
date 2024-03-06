import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { encryptTransform } from 'redux-persist-transform-encrypt';
// slices
import appReducer from './app/appReducer';
// import audioCallReducer from "./slices/audioCall";
import videoCallReducer from './videoCall/videoCallReducer';
import authReducer from './auth/authReducer';
import conversationReducer from './conversation/convReducer';

// ----------------------------------------------------------------------

const rootPersistConfig = {
    key: 'root',
    storage,
    stateReconciler: autoMergeLevel2,
    keyPrefix: 'redux-',
    transforms: [
        encryptTransform({
            secretKey: 'my-super-secret-key',
            onError: function (error) {
                // Handle the error.
                console.error(error);
            },
        }),
    ],
    whitelist: ['auth', 'app', 'conversation'],
    // blacklist: ['conversation'],
};

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    conversation: conversationReducer,
    // audioCall: audioCallReducer,
    videoCall: videoCallReducer,
});

export { rootPersistConfig, rootReducer };
