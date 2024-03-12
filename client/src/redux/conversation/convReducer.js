import { createSlice } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';
import { revertAll } from '../globalActions';
import { getFormattedConversation, getFormattedMessage } from '../../utils/conversations';
import { slice as appSlice } from '../app/appReducer';

const user_id = window.localStorage.getItem('user_id');

const initialState = {
    conversations: [],
    current_conversation: null,
    current_messages: [],
    replyMsg: null,
    message_page: 1,
};

export const slice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        fetchDirectConversations(state, action) {
            const list = action.payload.conversations.map((el) => {
                return getFormattedConversation(el, user_id);
            });

            state.conversations = list.sort((a, b) => new Date(b.time) - new Date(a.time)); // Sort by time in descending order
        },

        updateDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;

            state.conversations = state.conversations
                .map((el) => {
                    if (el?.id !== this_conversation._id) {
                        return el;
                    } else {
                        let formatted_conversation = getFormattedConversation(this_conversation, user_id);

                        if (state.current_conversation?.id === formatted_conversation.id) {
                            state.current_conversation = formatted_conversation;
                        }
                        return formatted_conversation;
                    }
                })
                .sort((a, b) => new Date(b.time) - new Date(a.time));
        },

        updateConversationStatus(state, action) {
            state.conversations = action.payload;
        },

        removeDirectConversation(state, action) {
            const this_conversation_id = action.payload.id;

            state.conversations = state.conversations
                .filter((el) => {
                    return el?.id !== this_conversation_id;
                })
                .sort((a, b) => new Date(b.time) - new Date(a.time));
        },

        addDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            state.conversations = state.conversations.filter((el) => el?.id !== this_conversation._id);

            const formatted_conversation = getFormattedConversation(this_conversation, user_id);
            state.conversations.push(formatted_conversation);
            state.conversations.sort((a, b) => new Date(b.time) - new Date(a.time));
        },
        setCurrentConversation(state, action) {
            state.current_conversation = action.payload;
        },
        fetchCurrentMessages(state, action) {
            const messages = action.payload.messages;
            const formatted_messages = messages.map((el) => {
                return getFormattedMessage(el, user_id);
            });
            formatted_messages.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            state.current_messages = formatted_messages;
        },
        fetchMoreMessages(state, action) {
            const messages = action.payload;
            const formatted_messages = messages.map((el) => {
                return getFormattedMessage(el, user_id);
            });
            const newMsgs = [...formatted_messages, ...state.current_messages];
            newMsgs.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            state.current_messages = newMsgs;
            state.message_page += 1;
        },
        addDirectMessage(state, action) {
            state.current_messages.push(getFormattedMessage(action.payload.message, user_id));
            const newPage = Math.ceil(state.current_messages.length / 20);
            if (newPage > state.message_page) {
                state.message_page = newPage;
            }
        },
        addMessageReaction(state, action) {
            const messageUpdate = action.payload.message;
            const messageIdToUpdate = messageUpdate._id;
            // Find the index of the message with the matching id
            const messageIndex = state.current_messages.findIndex((message) => message.id === messageIdToUpdate);

            if (messageIndex !== -1) {
                // Create a copy of the current_messages array
                let updatedMessages = [...state.current_messages];

                // Replace the message at the found index with the updated message
                updatedMessages[messageIndex] = getFormattedMessage(messageUpdate, user_id);

                // Update the state with the new array of messages
                state.current_messages = updatedMessages;
            }
        },

        setReplyMessage(state, action) {
            state.replyMsg = action.payload;
        },
        closeReplyMessage(state, action) {
            state.replyMsg = null;
        },
        updateBlockedConversation(state, action) {
            const id = action.payload.id;
            const blocked = action.payload.blocked;

            if (id === state.current_conversation?.id) {
                state.current_conversation.isBeingBlocked = blocked;
            }

            state.conversations = state.conversations.map((conversation) => {
                if (conversation.id === id) {
                    conversation.isBeingBlocked = blocked;
                }
                return conversation;
            });
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(revertAll, () => initialState)
            .addCase(appSlice.actions.selectConversation, (state, action) => {
                state.message_page = 1;
            });
    },
});

// Reducer
export default slice.reducer;
