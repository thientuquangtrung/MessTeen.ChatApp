const app = require("./src/app");
const { PORT } = require("./base.config");

const server = app.listen(3051, () => {
    console.log("MessTeen server start with port 3051");
});

process.on("SIGINT", () => {
    server.close(() => console.log(`exits server express`));
});
