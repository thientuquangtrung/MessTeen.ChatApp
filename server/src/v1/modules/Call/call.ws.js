const { getInfoData } = require('../../utils');
const userModel = require('../User/user.model');
const callModel = require('./call.model');

module.exports = {
    startVideoCallWS: async (data) => {
        const { from, to, roomID } = data;

        const to_user = await userModel.findByIdAndUpdate(to, { usr_status: 'IN_CALL' });
        const from_user = await userModel.findByIdAndUpdate(from, { usr_status: 'IN_CALL' });

        // send notification to receiver of call
        _io.to(to_user?.usr_socket_id).emit('video_call_notification', {
            from: getInfoData({
                fields: ['_id', 'usr_name', 'usr_email', 'usr_avatar'],
                object: from_user,
            }),
            to,
            roomID,
            streamID: from,
            userID: to,
            // userName: to,
        });
    },

    endVideoCallWS: async (data) => {
        const { from, to, roomID } = data;

        const from_user = await userModel.findByIdAndUpdate(from, { usr_status: 'ONLINE' });
        const to_user = await userModel.findByIdAndUpdate(to, { usr_status: 'ONLINE' });

        await callModel.findOneAndUpdate(
            {
                _id: roomID,
                call_participants: { $size: 2, $all: [to, from] },
            },
            { call_status: 'Ended', call_endedAt: Date.now() },
        );

        // TODO => emit call_missed to receiver of call
        _io.to(to_user?.usr_socket_id).emit('video_call_end', {
            from,
            to,
        });
    },

    videoCallNotPickedWS: async (data) => {
        // find and update call record
        const { to, from, roomID } = data;

        const from_user = await userModel.findByIdAndUpdate(from, { usr_status: 'ONLINE' });
        const to_user = await userModel.findByIdAndUpdate(to, { usr_status: 'ONLINE' });

        await callModel.findOneAndUpdate(
            {
                _id: roomID,
                call_participants: { $size: 2, $all: [to, from] },
            },
            { call_verdict: 'Missed', call_status: 'Ended', call_endedAt: Date.now() },
        );

        // emit call_missed to receiver of call
        _io.to(to_user?.usr_socket_id).emit('video_call_missed', {
            from,
            to,
        });
    },

    videoCallAcceptedWS: async (data) => {
        const { to, from, roomID } = data;

        const from_user = await userModel.findByIdAndUpdate(from, { usr_status: 'IN_CALL' });
        const to_user = await userModel.findByIdAndUpdate(to, { usr_status: 'IN_CALL' });

        // find and update call record
        await callModel.findOneAndUpdate(
            {
                _id: roomID,
                call_participants: { $size: 2, $all: [to, from] },
            },
            { call_verdict: 'Accepted' },
        );

        // TODO => emit call_accepted to sender of call
        _io.to(from_user?.usr_socket_id).emit('video_call_accepted', {
            from,
            to,
        });
    },

    videoCallDeniedWS: async (data) => {
        // find and update call record
        const { to, from, roomID } = data;

        await callModel.findOneAndUpdate(
            {
                _id: roomID,
                call_participants: { $size: 2, $all: [to, from] },
            },
            { call_verdict: 'Denied', call_status: 'Ended', call_endedAt: Date.now() },
        );

        const from_user = await userModel.findByIdAndUpdate(from, { usr_status: 'ONLINE' });
        const to_user = await userModel.findByIdAndUpdate(to, { usr_status: 'ONLINE' });
        // TODO => emit call_denied to sender of call

        _io.to(from_user?.usr_socket_id).emit('video_call_denied', {
            from,
            to,
        });
    },

    videoCallBusyWS: async (data) => {
        const { to, from, roomID } = data;
        console.log(`videoCallBusyWS:::::::`, data);
        // find and update call record
        await callModel.findOneAndUpdate(
            {
                _id: roomID,
                call_participants: { $size: 2, $all: [to, from] },
            },
            { call_verdict: 'Busy', call_status: 'Ended', call_endedAt: Date.now() },
        );

        const from_user = await userModel.findByIdAndUpdate(from, { usr_status: 'ONLINE' });
        // TODO => emit on_another_video_call to sender of call
        _io.to(from_user?.usr_socket_id).emit('on_another_video_call', {
            from,
            to,
        });
    },
};
