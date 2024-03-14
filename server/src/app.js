const express = require('express');
const cors = require('cors');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const UserModel = require('./v1/modules/User/user.model');
const withErrorHandling = require('./v1/helpers/socketAsyncHandler');
const { sendFriendRequestWS, acceptRequestWS, unfriendWS } = require('./v1/modules/User/user.ws');
const {
    startConversationWS,
    getDirectConversationsWS,
    groupConversationWS,
    addMemberToGroupWS,
    leaveGroupWS,
    joinGroupSocketWS,
    kickMemberFromGroupWS,
} = require('./v1/modules/ChatRoom/chatroom.ws');
const { sendMesssageWS, getMessagesWS, reactMessageWS } = require('./v1/modules/Message/message.ws');
const {
    startVideoCallWS,
    videoCallNotPickedWS,
    videoCallAcceptedWS,
    videoCallDeniedWS,
    videoCallBusyWS,
    endVideoCallWS,
} = require('./v1/modules/Call/call.ws');

//init dbs
require('./v1/databases/init.mongodb');
// require('./v1/databases/init.redis')

//user middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
// compress responses
app.use(compression());

// add body-parser
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

//router
app.use(require('./v1/router'));

// Error Handling Middleware called

app.use((req, res, next) => {
    const error = new Error('Path not found');
    error.status = 404;
    next(error);
});

// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

const handleSocketConnect = async (socket) => {
    console.log(JSON.stringify(socket.handshake.query));
    const user_id = socket.handshake.query['user_id'];

    console.log(`User connected at socket ID::::: ${socket.id}`);

    if (user_id != null && Boolean(user_id)) {
        try {
            const user = await UserModel.findByIdAndUpdate(user_id, {
                usr_socket_id: socket.id,
                usr_status: 'ONLINE',
            }).populate('usr_friends', 'usr_socket_id usr_status');

            const onlineFriends = user.usr_friends.filter((friend) => friend.usr_status !== 'OFFLINE');
            onlineFriends.forEach((friend) => {
                if (friend.usr_socket_id) {
                    _io.to(friend.usr_socket_id).emit('friend-online', { userId: user_id, status: true });
                }
            });

            await joinGroupSocketWS(socket, user_id);
        } catch (e) {
            console.log(e);
        }
    }

    // We can write our socket event listeners in here...
    socket.on('friend_request', withErrorHandling(socket, sendFriendRequestWS));

    socket.on('accept_request', withErrorHandling(socket, acceptRequestWS));

    socket.on('unfriend', withErrorHandling(socket, unfriendWS));

    socket.on('get_direct_conversations', withErrorHandling(socket, getDirectConversationsWS));

    // socket.on('list_groups', withErrorHandling(socket, listGroupsWS));

    socket.on('start_conversation', withErrorHandling(socket, startConversationWS));

    socket.on('group_conversation', withErrorHandling(socket, groupConversationWS));

    socket.on('add_member_to_group', withErrorHandling(socket, addMemberToGroupWS));

    socket.on('leave_group', withErrorHandling(socket, leaveGroupWS));

    socket.on('kick_from_group', withErrorHandling(socket, kickMemberFromGroupWS));

    socket.on('get_messages', withErrorHandling(socket, getMessagesWS));

    // // Handle incoming text/link messages
    socket.on('text_message', withErrorHandling(socket, sendMesssageWS));

    socket.on('react_message', withErrorHandling(socket, reactMessageWS));

    // // --------------------- HANDLE VIDEO CALL SOCKET EVENTS ---------------------- //

    // // handle start_video_call event
    socket.on('start_video_call', withErrorHandling(socket, startVideoCallWS));

    // // handle end_video_call event
    socket.on('end_video_call', withErrorHandling(socket, endVideoCallWS));

    // // handle video_call_not_picked
    socket.on('video_call_not_picked', withErrorHandling(socket, videoCallNotPickedWS));

    // handle video_call_accepted
    socket.on('video_call_accepted', withErrorHandling(socket, videoCallAcceptedWS));

    // handle video_call_denied
    socket.on('video_call_denied', withErrorHandling(socket, videoCallDeniedWS));

    // handle user_is_busy_video_call
    socket.on('user_is_busy_video_call', withErrorHandling(socket, videoCallBusyWS));

    // -------------- HANDLE SOCKET DISCONNECTION ----------------- //

    socket.on('end', async (data) => {
        console.log('closing connection');
        socket.disconnect(0);
    });

    socket.on('disconnect', async () => {
        // Find user by ID and set status as offline
        const user = await UserModel.findByIdAndUpdate(user_id, { usr_status: 'OFFLINE' }).populate(
            'usr_friends',
            'usr_socket_id usr_status',
        );

        // broadcast to all conversation rooms of this user that this user is offline (disconnected)
        console.log(`user disconnected:::::::::::`, user_id);

        if (user) {
            const onlineFriends = user.usr_friends.filter((friend) => friend.usr_status !== 'OFFLINE');
            onlineFriends.forEach((friend) => {
                if (friend.usr_socket_id) {
                    _io.to(friend.usr_socket_id).emit('friend-online', { userId: user_id, status: false });
                }
            });
        }
    });
};

module.exports = { app, handleSocketConnect };
