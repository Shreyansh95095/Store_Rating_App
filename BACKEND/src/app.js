const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes);

module.exports = app;