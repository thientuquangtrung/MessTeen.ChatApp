const { CREATED, OK } = require("../../core/success.response");
const SampleService = require("./sample.service");

class SampleController {
    sampleFunction = async (req, res, next) => {
        new CREATED({
            message: "Sample successful!",
            metadata: await SampleService.sampleServiceFunc(req.body),
        }).send(res);
    };
}

module.exports = new SampleController();
