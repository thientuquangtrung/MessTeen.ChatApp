const { ErrorResponse } = require("../core/error.response");
const logger = require("../utils/logger");

module.exports = asyncHandler = (fn) => {
    return (res, req, next) => {
        fn(res, req, next).catch((error) => {
            logger.error(error.message);

            if (error instanceof ErrorResponse) {
                next(error);
            } else {
                next(new Error(`Something went wrong! Please try again.`));
            }
        });
    };
};
