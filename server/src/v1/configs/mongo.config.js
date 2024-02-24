const ENV = require('../../../base.config');

let MONGO_URI = '';

if (ENV.NODE_ENV === 'prod') {
    MONGO_URI = ENV.MONGODB_URI;
} else {
    MONGO_URI = ENV.MONGODB_URI || `mongodb://127.0.0.1:27017/messteenDEV`;
}

module.exports = {
    MONGO_URI,
};
