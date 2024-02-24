import { createSlice } from '@reduxjs/toolkit';
import { faker } from '@faker-js/faker';
// import { AWS_S3_REGION, S3_BUCKET_NAME } from '../../config';

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
                const user = el.room_participant_ids.find((elm) => elm._id.toString() !== user_id);
                return {
                    id: el._id,
                    user_id: user?._id,
                    name: `${user?.usr_name}`,
                    online: user?.usr_status === 'ONLINE',
                    // img: `https://${S3_BUCKET_NAME}.s3.${AWS_S3_REGION}.amazonaws.com/${user?.avatar}`,
                    // msg: el.messages.slice(-1)[0].text,
                    img: faker.image.avatar(),
                    msg: faker.music.songName(),
                    time: '9:36',
                    unread: 0,
                    pinned: false,
                    about: user?.about,
                };
            });

            state.conversations = list;
        },
        updateDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            console.log(this_conversation);
            state.conversations = state.conversations.map((el) => {
                if (el?.id !== this_conversation._id) {
                    return el;
                } else {
                    const user = this_conversation.room_participant_ids.find((elm) => elm._id.toString() !== user_id);
                    return {
                        id: this_conversation._id,
                        user_id: user?._id,
                        name: `${user?.usr_name}`,
                        online: user?.usr_status === 'ONLINE',
                        img: faker.image.avatar(),
                        msg: faker.music.songName(),
                        time: '9:36',
                        unread: 0,
                        pinned: false,
                    };
                }
            });
        },
        addDirectConversation(state, action) {
            const this_conversation = action.payload.conversation;
            const user = this_conversation.room_participant_ids.find((elm) => elm._id.toString() !== user_id);
            state.conversations = state.conversations.filter((el) => el?.id !== this_conversation._id);
            state.conversations.push({
                id: this_conversation._id,
                user_id: user?._id,
                name: `${user?.usr_name}`,
                online: user?.usr_status === 'ONLINE',
                img: faker.image.avatar(),
                msg: faker.music.songName(),
                time: '9:36',
                unread: 0,
                pinned: false,
            });
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
            console.log(formatted_messages);
            formatted_messages.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            console.log(formatted_messages);
            state.current_messages = formatted_messages;
        },
        addDirectMessage(state, action) {
            state.current_messages.push(action.payload.message);
        },
    },
});

// Reducer
export default slice.reducer;
