import { createSlice } from '@reduxjs/toolkit';
import { socket } from '../../socket';

const initialState = {
    open_video_dialog: false,
    open_video_notification_dialog: false,
    call_queue: [], // can have max 1 call at any point of time
    incoming: false,
};

export const slice = createSlice({
    name: 'videoCall',
    initialState,
    reducers: {
        pushToVideoCallQueue(state, action) {
            // check video_call_queue in redux store

            if (state.call_queue.length === 0) {
                state.call_queue.push(action.payload.call);
                if (action.payload.incoming) {
                    //receiver
                    state.open_video_notification_dialog = true; // this will open up the call notification dialog
                    state.incoming = true;
                } else {
                    // caller
                    state.open_video_dialog = true; // this will open up the call dialog
                    state.incoming = false;
                }
            } else {
                const call_details = action.payload.call;
                // if queue is not empty then emit user_is_busy => in turn server will send this event to sender of call
                socket.emit('user_is_busy_video_call', { ...call_details });
            }

            // Ideally queue should be managed on server side
        },
        resetVideoCallQueue(state, action) {
            state.call_queue = [];
            state.open_video_notification_dialog = false;
            state.incoming = false;
        },
        closeNotificationDialog(state, action) {
            state.open_video_notification_dialog = false;
        },
        updateCallDialog(state, action) {
            state.open_video_dialog = action.payload.state;
            state.open_video_notification_dialog = false;
        },
    },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------
