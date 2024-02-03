import { createSlice } from "@reduxjs/toolkit";

// ----------------------------------------------------------------------

const initialState = {
    isLoggedIn: false,
    token: "",
    isLoading: false,
    user: null,
    user_id: null,
    email: "",
    error: false,
};

export const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateIsLoading(state, action) {
            state.error = action.payload.error;
            state.isLoading = action.payload.isLoading;
        },
        logIn(state, action) {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
            state.user_id = action.payload.user_id;
        },
        signOut(state, action) {
            state.isLoggedIn = false;
            state.token = "";
            state.user_id = null;
        },
        updateRegisterEmail(state, action) {
            state.email = action.payload.email;
        },
    },
});

// Reducer
export default slice.reducer;