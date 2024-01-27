const ENV = require("../../../base.config");

module.exports = {
    host: ENV.MONGO_DB_HOST || "127.0.0.1",
    port: ENV.MONGO_DB_PORT || 27017,
    name: ENV.MONGO_DB_NAME || "messteenPROD",
};

