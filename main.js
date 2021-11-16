"use strict";
exports.__esModule = true;
var mysql_helper_1 = require("./mysql-helper");
var form_validator_1 = require("./form-validator");
require("dotenv").config();
var jwt = require("jsonwebtoken");
var express = require("express");
var connector = new mysql_helper_1.DBConnector(process.env.MYSQL_IP, parseInt(process.env.MYSQL_PORT), process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, process.env.MYSQL_DATABASE);
var app = express();
var port = process.env.port || 3000;
var tokenBlacklist = []; // Expired refresh tokens.
var staticDir = "./dist";
app.use(express.static(staticDir));
app.use(express.json());
connector.createTables(function () {
    app.listen(port, function () {
        console.log("Server listening on port " + port);
    });
});
app.post("/login", function (req, res) {
    var validator = new form_validator_1["default"]();
    validator.isString(req.body.user, "Username", 0, 0, false);
    validator.isString(req.body.password, "Password", 0, 0, false);
    console.log(req.body.user, req.body.password);
    if (validator.errors.length > 0) {
        res.sendStatus(404);
    }
    else {
        var authSuccess = function (message, statusCode) {
            var secret = process.env.ACCESS_TOKEN_SECRET;
            var refresh = process.env.ACCESS_TOKEN_REFRESH;
            // Send refresh token with an expiration of an hour
            var refreshToken = jwt.sign({
                exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24),
                user: req.body.user.toLowerCase()
            }, secret);
            var token = jwt.sign({
                exp: Math.floor(Date.now() / 1000 + 60 * 60),
                user: req.body.user.toLowerCase()
            }, refresh);
            console.log(message);
            res.status(statusCode).json({ refresh: refreshToken, token: token }).send();
        };
        var authFailure = function (message, statusCode) {
            res.status(statusCode).json({ msg: message }).send();
        };
        connector.validateUser(req.body.user, req.body.password, authSuccess, authFailure);
    }
});
