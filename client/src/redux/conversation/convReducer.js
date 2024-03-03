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
                        online: user.usr_status === 'ONLINE',
                        img: [faker.image.avatar()],
                        msg: el.room_last_msg.content,
                        time: el.room_last_msg.timestamp,
                        unread: 0,
                        pinned: false,
                        about: user?.about,
                        type: el.room_type,
                        isBeingBlocked: user.usr_blocked_people.includes(user_id),
                        participant_ids: el.room_participant_ids.map((participant) => participant._id),
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
            console.log(this_conversation);

            state.conversations = state.conversations
                .map((el) => {
                    if (el?.id !== this_conversation._id) {
                        return el;
                    } else {
                        const user = this_conversation.room_participant_ids.find(
                            (elm) => elm._id.toString() !== user_id,
                        );

                        // PRIVATE
                        if (this_conversation.room_type === 'PRIVATE') {
                            return {
                                id: this_conversation._id,
                                user_id: user?._id,
                                name: `${user?.usr_name}`,
                                online: user.usr_status === 'ONLINE',
                                img: [faker.image.avatar()],
                                msg: this_conversation.room_last_msg.content,
                                time: this_conversation.room_last_msg.timestamp,
                                unread: 0,
                                pinned: false,
                                type: this_conversation.room_type,
                                participant_ids: this_conversation.room_participant_ids.map(
                                    (participant) => participant._id,
                                ),
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

        updateConversationStatus(state, action) {
            state.conversations = action.payload;
        },

        addDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            state.conversations = state.conversations.filter((el) => el?.id !== this_conversation._id);

            if (this_conversation.room_type === 'PRIVATE') {
                const user = this_conversation.room_participant_ids.find((elm) => elm._id.toString() !== user_id);
                state.conversations.push({
                    id: this_conversation._id,
                    user_id: user?._id,
                    name: user.usr_status === 'ONLINE',
                    img: [faker.image.avatar()],
                    msg: this_conversation.room_last_msg.content,
                    time: this_conversation.room_last_msg.timestamp,
                    unread: 0,
                    pinned: false,
                    type: this_conversation.room_type,
                    participant_ids: this_conversation.room_participant_ids.map((participant) => participant._id),
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
            const formatted_messages = messages.map((el) => ({
                id: el._id,
                type: 'msg',
                subtype: el.msg_type,
                message: el.msg_content,
                incoming: el.msg_sender_id !== user_id,
                outgoing: el.msg_sender_id === user_id,
                timestamp: el.msg_timestamp,
            }));
            formatted_messages.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            state.current_messages = formatted_messages;
        },
        addDirectMessage(state, action) {
            state.current_messages.push(action.payload.message);
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
