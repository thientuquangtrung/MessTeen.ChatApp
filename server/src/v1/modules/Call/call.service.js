const callModel = require('./call.model');
const userModel = require('../User/user.model');
const { getInfoData } = require('../../utils');
const { ConflictRequestError } = require('../../core/error.response');

class CallService {
    static async startVideoCall({ from, to }) {
        const from_user = await userModel.findById(from);
        const to_user = await userModel.findById(to);
        // TODO: check if user is busy
        if (to_user.usr_status !== 'ONLINE') {
            throw new ConflictRequestError(`User is busy`);
        }

        // create a new call videoCall Doc and send required data to client
        const new_video_call = await callModel.create({
            call_participants: [from, to],
            call_from: from_user._id,
            call_to: to_user._id,
            call_status: 'Ongoing',
            call_type: 'VIDEO',
        });

        // return object info of stream
        return {
            from: getInfoData({
                fields: ['_id', 'usr_name', 'usr_email', 'usr_avatar'],
                object: to_user,
            }),
            roomID: new_video_call._id,
            streamID: to,
            userID: from,
            userName: from,
        };
    }

    static async getCallLogs(user_id) {
        const call_logs = [];

        // const audio_calls = await callModel
        //     .find({
        //         call_participants: { $all: [user_id] },
        //     })
        //     .populate('call_from call_to');

        const video_calls = await callModel
            .find({
                call_participants: { $all: [user_id] },
            })
            .populate('call_from call_to');

        // console.log(audio_calls, video_calls);

        // for (let elm of audio_calls) {
        //     const missed = elm.verdict !== 'Accepted';
        //     if (elm.from._id.toString() === user_id.toString()) {
        //         const other_user = elm.to;

        //         // outgoing
        //         call_logs.push({
        //             id: elm._id,
        //             img: other_user.avatar,
        //             name: other_user.firstName,
        //             online: true,
        //             incoming: false,
        //             missed,
        //         });
        //     } else {
        //         // incoming
        //         const other_user = elm.from;

        //         // outgoing
        //         call_logs.push({
        //             id: elm._id,
        //             img: other_user.avatar,
        //             name: other_user.firstName,
        //             online: true,
        //             incoming: false,
        //             missed,
        //         });
        //     }
        // }

        for (let element of video_calls) {
            const missed = element.call_verdict !== 'Accepted';
            if (element.call_from._id.toString() === user_id.toString()) {
                const other_user = element.call_to;

                // outgoing
                call_logs.push({
                    id: element._id,
                    img: other_user.usr_avatar,
                    name: other_user.usr_name,
                    online: other_user.usr_status !== 'OFFLINE',
                    incoming: false,
                    missed,
                    start: element.call_startedAt,
                    end: element.call_endedAt,
                });
            } else {
                // incoming
                const other_user = element.call_from;

                // outgoing
                call_logs.push({
                    id: element._id,
                    img: other_user.usr_avatar,
                    name: other_user.usr_name,
                    online: other_user.usr_status !== 'OFFLINE',
                    incoming: true,
                    missed,
                    start: element.call_startedAt,
                    end: element.call_endedAt,
                });
            }
        }

        return call_logs;
    }
}

module.exports = CallService;
