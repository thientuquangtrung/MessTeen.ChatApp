const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: "debug",
    format: format.combine(
        format.timestamp({ format: "MMM-DD-YYYY HH:mm:ss" }),
        format.align(),
        format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`),
    ),
    transports: [
        new transports.File({
            dirname: "src/v1/logs",
            filename: "info.log",
            level: "info",
            format: format.combine(format.printf((i) => (i.level === "info" ? `${i.level}: ${i.timestamp} ${i.message}` : ""))),
        }),
        new transports.File({
            dirname: "src/v1/logs",
            filename: "error.log",
            level: "error",
        }),
    ],
});

module.exports = logger;
