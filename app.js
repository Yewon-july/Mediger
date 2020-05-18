var express = require("express");
var morgan = require("morgan");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var sessionParser = require("express-session");
var indexRouter = require("./routes/index");
var { sequelize } = require("./models");

var app = express();
sequelize.sync();
const session = sessionParser({
    secret: "Mediger",
    resave: true,
    saveUninitialized: true
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(session);
app.use("", indexRouter);
app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, req, res) => {
    res.locals.message = err.mesage;
    res.locals.error = req.app.get("env") || "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

module.exports = {
    app,
    session
};
