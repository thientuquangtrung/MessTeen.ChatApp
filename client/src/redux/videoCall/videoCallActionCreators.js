import { slice } from './videoCallReducer';
import axios from '../../utils/axios';
import { showSnackbar } from '../app/appActionCreators';

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
                console.log(`call error:::`, err);
                dispatch(
                    showSnackbar({ severity: 'error', message: err?.error?.message || 'Cannot start video call' }),
                );
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
