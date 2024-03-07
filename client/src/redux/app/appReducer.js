import { createSlice } from '@reduxjs/toolkit';
import { revertAll } from '../globalActions';

const initialState = {
    user: {},
    // sideBar: {
    //     open: false,
    //     type: "CONTACT", // can be CONTACT, STARRED, SHARED
    // },
    // isLoggedIn: true,
    // tab: 0, // [0, 1, 2, 3]
    snackbar: {
        open: null,
        severity: null,
        message: null,
    },
    users: [], // all users of app who are not friends and not requested yet
    all_users: [],
    friends: [], // all friends
    friendRequests: [], // all friend requests
    sentRequests: [], // sent friend requests
    blockedFriends: [],
    // chat_type: null,
    room_id: null,
    call_logs: [],

    //slidebar
    sidebar: {
        open: false,
        type: 'CONTACT',
    },
    isLoading: {
        state: false,
        progress: 0, //over 100
    },
};

export const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        fetchCallLogs(state, action) {
            state.call_logs = action.payload.call_logs.sort((a, b) => new Date(b.start) - new Date(a.start));
        },
        // fetchUser(state, action) {
        //     state.user = action.payload.user;
        // },
        updateUser(state, action) {
            state.user = action.payload.user;
        },
        // // Toggle Sidebar
        // toggleSideBar(state) {
        //     state.sideBar.open = !state.sideBar.open;
        // },
        // updateSideBarType(state, action) {
        //     state.sideBar.type = action.payload.type;
        // },
        // updateTab(state, action) {
        //     state.tab = action.payload.tab;
        // },

        openSnackBar(state, action) {
            state.snackbar.open = true;
            state.snackbar.severity = action.payload.severity;
            state.snackbar.message = action.payload.message;
        },
        closeSnackBar(state) {
            state.snackbar.open = false;
            state.snackbar.message = null;
        },
        updateUsers(state, action) {
            state.users = action.payload.users;
        },
        // updateAllUsers(state, action) {
        //     state.all_users = action.payload.users;
        // },
        updateFriends(state, action) {
            state.friends = action.payload.friends;
        },
        updateFriendRequests(state, action) {
            state.friendRequests = action.payload.requests;
        },
        updateSentFriendRequests(state, action) {
            state.sentRequests = action.payload.requests;
        },
        updateBlockedFriends(state, action) {
            state.blockedFriends = action.payload.listBlockedFriends;
        },
        selectConversation(state, action) {
            // state.chat_type = 'individual';
            state.room_id = action.payload.room_id;
        },

        toggleSidebar(state, action) {
            state.sidebar.open = !state.sidebar.open;
        },
        updatedSidebarType(state, action) {
            state.sidebar.type = action.payload.type;
        },
        updateIsLoading(state, action) {
            state.isLoading = action.payload;
        },
    },
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

// Reducer
export default slice.reducer;
