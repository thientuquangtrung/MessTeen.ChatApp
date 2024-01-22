const app = require("./src/app");
const { PORT } = require("./base.config");

const server = app.listen(PORT, () => {
    console.log(`MessTeen server start with port ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => console.log(`exits server express`));
});
