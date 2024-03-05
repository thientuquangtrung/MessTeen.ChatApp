const { OK, CREATED } = require('../../core/success.response');
const CallService = require('./call.service');

class CallController {
    async startVideoCall(req, res) {
        new CREATED({
            message: 'Starting video call...',
            metadata: await CallService.startVideoCall(req.body),
        }).send(res);
    }
}

module.exports = new CallController();
