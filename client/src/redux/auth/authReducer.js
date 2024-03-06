import { createSlice } from '@reduxjs/toolkit';
import { revertAll } from '../globalActions';

// ----------------------------------------------------------------------

const initialState = {
    isLoggedIn: false,
    token: '',
    refreshToken: '',
    isLoading: false,
    user: null,
    user_id: null,
    email: '',
    error: false,
};

export const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateIsLoading(state, action) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
        logIn(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.user_id = action.payload.user_id;
            state.email = action.payload.email;
            state.user = action.payload.user;
        },
        saveNewTokens(state, action) {
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        // signOut(state, action) {
        //     state.isLoggedIn = false;
        //     state.token = '';
        //     state.refreshToken = '';
        //     state.user_id = null;
        // },
        updateRegisterEmail(state, action) {
            state.email = action.payload.email;
        },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

// Reducer
export default slice.reducer;
