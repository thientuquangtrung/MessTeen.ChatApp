import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
// slices
import appReducer from "./app/appReducer";
// import audioCallReducer from "./slices/audioCall";
// import videoCallReducer from "./slices/videoCall";
import authReducer from "./auth/authReducer";
// import conversationReducer from "./slices/conversation";

// ----------------------------------------------------------------------

const rootPersistConfig = {
    key: "root",
    storage,
    keyPrefix: "redux-",
    transforms: [
        encryptTransform({
            secretKey: "my-super-secret-key",
            onError: function (error) {
                // Handle the error.
                console.error(error);
            },
        }),
    ],
    //   whitelist: [],
    //   blacklist: [],
};

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    // conversation: conversationReducer,
    // audioCall: audioCallReducer,
    // videoCall: videoCallReducer,
});

export { rootPersistConfig, rootReducer };
