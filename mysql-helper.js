"use strict";
exports.__esModule = true;
exports.DBConnector = void 0;
var mysql_1 = require("mysql");
var bcrypt = require("bcryptjs");
var DBConnector = /** @class */ (function () {
    function DBConnector(ip, port, user, password, database) {
        this._pool = (0, mysql_1.createPool)({
            host: ip,
            port: port,
            user: user,
            password: password,
            database: database
        });
    }
    DBConnector.prototype.createTables = function (onSuccess) {
        this._pool.query("CREATE TABLE IF NOT EXISTS products (id integer auto_increment, name varchar(32), description varchar(32), image_dir varchar(255), primary key (id))", function (err) {
            if (err) {
                console.log(err);
            }
            else {
                onSuccess();
            }
        });
    };
    DBConnector.prototype.validateUser = function (user, password, onSuccess, onFailure) {
        var minAccessLevel = process.env.MIN_ACCESS || 9; // Wordpress user level in order to use the POS system.
        this._pool.query("SELECT u.user_login, u.user_pass, um.meta_value FROM wp_users AS u INNER JOIN wp_usermeta AS um ON u.id = um.user_id WHERE u.user_login = ? AND um.meta_key = ?", [user, "wp_user_level"], function (err, results) {
            if (err) {
                onFailure("The server is undergoing maintenance, please try again later.", 503);
                console.log(err);
                return;
            }
            if (results.length > 0) {
                bcrypt.compare(password, results[0].user_pass, function (err, res) {
                    if (err) {
                        onFailure("Validation error.", 502);
                    }
                    else {
                        console.log(res + " authed");
                        if (res == true)
                            onSuccess(results[0].user_login + " authenticated successfully.", 200);
                        else
                            onFailure("Your password was incorrect.", 401);
                    }
                });
            }
            else {
                onFailure("Account not found or account lacks sufficient privileges", 404);
            }
        });
    };
    return DBConnector;
}());
exports.DBConnector = DBConnector;
