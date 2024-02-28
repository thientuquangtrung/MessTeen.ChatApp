const callModel = require('./call.model');
const userModel = require('../User/user.model');

class CallService {
    static async startVideoCall({ from, to }) {
        const from_user = await userModel.findById(from);
        const to_user = await userModel.findById(to);
        // TODO: check if user is busy

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
            from: to_user,
            roomID: new_video_call._id,
            streamID: to,
            userID: from,
            userName: from,
        };
    }
}

module.exports = CallService;
