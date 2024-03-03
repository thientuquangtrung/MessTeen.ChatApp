import { createSlice } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';
import { revertAll } from '../globalActions';

const user_id = window.localStorage.getItem('user_id');

// const initialState = {
//     direct_chat: {
//         conversations: [],
//         current_conversation: null,
//         current_messages: [],
//     },
//     group_chat: {},
// };

const initialState = {
    conversations: [],
    current_conversation: null,
    current_messages: [],
    replyMsg: null,
};

export const slice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        fetchDirectConversations(state, action) {
            const list = action.payload.conversations.map((el) => {
                if (el.room_type === 'PRIVATE') {
                    const user = el.room_participant_ids.find((elm) => elm._id.toString() !== user_id);
                    return {
                        id: el._id,
                        user_id: user?._id,
                        name: `${user?.usr_name}`,
                        online: user?.usr_status === 'ONLINE',
                        img: [faker.image.avatar()],
                        msg: el.room_last_msg.content,
                        time: el.room_last_msg.timestamp,
                        unread: 0,
                        pinned: false,
                        about: user?.about,
                        type: el.room_type,
                        isBeingBlocked: user.usr_blocked_people.includes(user_id),
                    };
                } else {
                    return {
                        id: el._id,
                        name: el.room_title,
                        online: el.room_participant_ids.some((user) => user.usr_status === 'ONLINE'),
                        img: el.room_participant_ids.map((user) => faker.image.avatar()),
                        msg: el.room_last_msg.content,
                        time: el.room_last_msg.timestamp,
                        unread: 0,
                        pinned: false,
                        type: el.room_type,
                        participant_ids: el.room_participant_ids.map((participant) => participant._id),
                    };
                }
            });

            state.conversations = list.sort((a, b) => new Date(b.time) - new Date(a.time)); // Sort by time in descending order
        },

        updateDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            console.log('message chat', this_conversation);

            state.conversations = state.conversations
                .map((el) => {
                    if (el?.id !== this_conversation._id) {
                        return el;
                    } else {
                        const user = this_conversation.room_participant_ids.find(
                            (elm) => elm._id.toString() !== user_id,
                        );

                        // PRIVATE
                        if (this_conversation.room_type !== 'GROUP') {
                            return {
                                id: this_conversation._id,
                                user_id: user?._id,
                                name: `${user?.usr_name}`,
                                online: user?.usr_status === 'ONLINE',
                                img: [faker.image.avatar()],
                                msg: this_conversation.room_last_msg.content,
                                time: this_conversation.room_last_msg.timestamp,
                                unread: 0,
                                pinned: false,
                                type: this_conversation.room_type,
                            };
                        } else {
                            // GROUP
                            return {
                                id: this_conversation._id,
                                name: this_conversation.room_title,
                                online: this_conversation.room_participant_ids.some(
                                    (user) => user.usr_status === 'ONLINE',
                                ),
                                img: this_conversation.room_participant_ids.map((user) => faker.image.avatar()),
                                msg: this_conversation.room_last_msg.content,
                                time: this_conversation.room_last_msg.timestamp,
                                unread: 0,
                                pinned: false,
                                type: this_conversation.room_type,
                                participant_ids: this_conversation.room_participant_ids.map(
                                    (participant) => participant._id,
                                ),
                            };
                        }
                    }
                })
                .sort((a, b) => new Date(b.time) - new Date(a.time));
        },

        removeDirectConversation(state, action) {
            const this_conversation_id = action.payload.id;

            state.conversations = state.conversations
                .filter((el) => {
                    return el?.id !== this_conversation_id;
                })
                .sort((a, b) => new Date(b.time) - new Date(a.time));

            // if(state.current_conversation.id === this_conversation_id){
            //     state.current_conversation = null
            // }
        },

        addDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            state.conversations = state.conversations.filter((el) => el?.id !== this_conversation._id);

            if (this_conversation.room_type === 'PRIVATE') {
                const user = this_conversation.room_participant_ids.find((elm) => elm._id.toString() !== user_id);
                state.conversations.push({
                    id: this_conversation._id,
                    user_id: user?._id,
                    name: `${user?.usr_name}`,
                    online: user?.usr_status === 'ONLINE',
                    img: [faker.image.avatar()],
                    msg: this_conversation.room_last_msg.content,
                    time: this_conversation.room_last_msg.timestamp,
                    unread: 0,
                    pinned: false,
                    type: this_conversation.room_type,
                });
            } else {
                state.conversations.push({
                    id: this_conversation._id,
                    name: this_conversation.room_title,
                    online: this_conversation.room_participant_ids.some((user) => user.usr_status === 'ONLINE'),
                    img: this_conversation.room_participant_ids.map((user) => faker.image.avatar()),
                    msg: this_conversation.room_last_msg.content,
                    time: this_conversation.room_last_msg.timestamp,
                    unread: 0,
                    pinned: false,
                    type: this_conversation.room_type,
                    participant_ids: this_conversation.room_participant_ids.map((participant) => participant._id),
                });
            }
            state.conversations.sort((a, b) => new Date(b.time) - new Date(a.time));
        },
        setCurrentConversation(state, action) {
            state.current_conversation = action.payload;
        },
        fetchCurrentMessages(state, action) {
            const messages = action.payload.messages;
            console.log('alo', messages);
            const formatted_messages = messages.map((el) => ({
                id: el._id,
                type: 'msg',
                subtype: el.msg_parent_id ? 'reply' : el.msg_type,
                message: el.msg_content,
                incoming: el.msg_sender_id._id !== user_id,
                outgoing: el.msg_sender_id_id === user_id,
                timestamp: el.msg_timestamp,
                reactions: el.msg_reactions.map((reaction) => reaction.reaction),
                msgReply: el.msg_parent_id,
                user_name: el.msg_sender_id.usr_name,
            }));
            formatted_messages.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            state.current_messages = formatted_messages;
        },
        addDirectMessage(state, action) {
            state.current_messages.push(action.payload.message);
        },
        addMessageReaction(state, action) {
            const messageUpdate = action.payload.message;
            const messageIdToUpdate = messageUpdate._id;
            // Find the index of the message with the matching id
            const messageIndex = state.current_messages.findIndex((message) => message.id === messageIdToUpdate);

            if (messageIndex !== -1) {
                // Create a copy of the current_messages array
                const updatedMessages = [...state.current_messages];
                // Replace the message at the found index with the updated message
                updatedMessages[messageIndex] = {
                    id: messageUpdate._id,
                    type: 'msg',
                    subtype: messageUpdate.msg_parent_id ? 'reply' : messageUpdate.msg_type,
                    message: messageUpdate.msg_content,
                    incoming: messageUpdate.msg_sender_id._id !== user_id,
                    outgoing: messageUpdate.msg_sender_id._id === user_id,
                    timestamp: messageUpdate.msg_timestamp,
                    reactions: messageUpdate.msg_reactions.map((reaction) => reaction.reaction),
                    msgReply: messageUpdate.msg_parent_id,
                    user_name: messageUpdate.msg_sender_id.usr_name,
                };

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

            if (id === state.current_conversation.id) {
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
    extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
});

// Reducer
export default slice.reducer;
