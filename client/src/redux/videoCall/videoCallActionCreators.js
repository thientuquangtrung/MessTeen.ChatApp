import { slice } from './videoCallReducer';
import axios from '../../utils/axios';

export const StartVideoCall = (from, to) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.resetVideoCallQueue());
        axios
            .post('/calls/start-video-call', { from, to })
            .then((response) => {
                // for user who MAKE the call
                dispatch(
                    slice.actions.pushToVideoCallQueue({
                        call: response.data.metadata,
                        incoming: false,
                    }),
                );
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

// for user who RECEIVE the call
export const PushToVideoCallQueue = (call) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.pushToVideoCallQueue({ call, incoming: true }));
    };
};

export const ResetVideoCallQueue = () => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.resetVideoCallQueue());
    };
};

export const CloseVideoNotificationDialog = () => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.closeNotificationDialog());
    };
};

export const UpdateVideoCallDialog = ({ state }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateCallDialog({ state }));
    };
};
