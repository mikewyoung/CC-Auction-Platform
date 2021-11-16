import { DBConnector } from "./mysql-helper";
import FormValidator from "./form-validator";
require("dotenv").config();
const jwt = require("jsonwebtoken");

const express = require("express");
const connector = new DBConnector(process.env.MYSQL_IP, parseInt(process.env.MYSQL_PORT), process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, process.env.MYSQL_DATABASE);

const app = express();
const port = process.env.port || 3000;
const tokenBlacklist = []; // Expired refresh tokens.

const staticDir = "./dist";

app.use(express.static(staticDir));
app.use(express.json());

connector.createTables(()=>{
    app.listen(port, ()=>{
        console.log(`Server listening on port ${port}`);
    });
})

app.post("/login", (req, res)=>{
    const validator = new FormValidator();
    validator.isString(req.body.user, "Username", 0, 0, false);
    validator.isString(req.body.password, "Password", 0, 0, false);
    console.log(req.body.user, req.body.password);
    if (validator.errors.length > 0){
        res.sendStatus(404);
    }else{

        const authSuccess = (message: string, statusCode: number) =>{
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const refresh = process.env.ACCESS_TOKEN_REFRESH;
            // Send refresh token with an expiration of an hour
            const refreshToken = jwt.sign({
                exp: Math.floor(Date.now() / 1000 + 60*60*24),
                user: req.body.user.toLowerCase()
            }, secret);

            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000 + 60 * 60),
                user: req.body.user.toLowerCase()
            }, refresh);

            console.log(message);

            res.status(statusCode).json({refresh: refreshToken, token: token}).send();
        }

        const authFailure = (message: string, statusCode: number) => {
            res.status(statusCode).json({msg: message}).send();
        }

        connector.validateUser(req.body.user, req.body.password, authSuccess, authFailure);
    }
})