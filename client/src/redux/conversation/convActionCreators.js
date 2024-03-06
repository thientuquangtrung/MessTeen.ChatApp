import { slice } from './convReducer';

export const FetchDirectConversations = ({ conversations }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.fetchDirectConversations({ conversations }));
    };
};

export const AddDirectConversation = ({ conversation }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.addDirectConversation({ conversation }));
    };
};

export const UpdateDirectConversation = ({ conversation }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateDirectConversation({ conversation }));
    };
};

export const UpdateConversationStatus = (updatedConversations) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateConversationStatus(updatedConversations));
    };
};

export const RemoveDirectConversation = ({ id }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.removeDirectConversation({ id }));
    };
};

export const SetCurrentConversation = (current_conversation) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.setCurrentConversation(current_conversation));
    };
};

export const FetchCurrentMessages = ({ messages }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.fetchCurrentMessages({ messages }));
    };
};

export const AddDirectMessage = (message) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.addDirectMessage({ message }));
    };
};
export const AddMessageReaction = ({ message }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.addMessageReaction({ message }));
    };
};
export const SetReplyMessage = (payload) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.setReplyMessage(payload));
    };
};
export const CloseReplyMessage = (payload) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.closeReplyMessage(payload));
    };
};

export const UpdateBlockedConversation = ({ id, blocked }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.updateBlockedConversation({ id, blocked }));
    };
};

export const ShowListGroup = ({ groups }) => {
    return async (dispatch, getState) => {
        dispatch(slice.actions.showListGroup({ groups }));
    };
};