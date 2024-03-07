import { slice } from './convReducer';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../utils/firebase';
import axios from '../../utils/axios';

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

export const FetchMoreMessages = (chatroomId, cb) => {
    return async (dispatch, getState) => {
        axios
            .get(`/message/get-all/${chatroomId}`, {
                params: {
                    page: getState().conversation.message_page + 1,
                },
            })
            .then((response) => {
                const messages = response.data.metadata;

                if (messages && messages.length > 0) {
                    dispatch(slice.actions.fetchMoreMessages(response.data.metadata));
                }
                cb();
            })
            .catch((error) => {
                console.log(error);
                cb();
            });
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

export const SendMultimedia = (multimedia, callback) => {
    return async (dispatch, getState) => {
        const file = multimedia[0];
        const key = v4();
        const storageRef = ref(storage, `message/${key}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                // Handle progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                // dispatch(slice.actions.updateIsLoading({ progress, state: true }));
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error('Error uploading file:', error);
                // dispatch(slice.actions.updateIsLoading({ progress: 0, state: false }));
            },
            async (dispatch) => {
                // Handle successful uploads
                console.log('File uploaded successfully');

                // Get the download URL of the uploaded file
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                console.log('downloadURL::::::::::::', downloadURL);

                callback(downloadURL);
                dispatch(slice.actions.setDownloadURL({ downloadURL }));
            },
        );
    };
};
