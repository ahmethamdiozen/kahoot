const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.static("public"));

app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./routes/auth"));
app.use("/api/quiz", require("./routes/quiz"));


module.exports = app;
