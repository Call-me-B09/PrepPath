const express = require("express");
const app = express();

app.use(express.json());
app.use("/roadmap", require("./routes/roadmap.routes"));
app.use("/dashboard", require("./routes/dashboard.routes"));

module.exports = app;
