const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const fs = require("fs");

const accounts = require('../accounts');

const sessions = {};

/* GET home page. */
router.route('/').all(function (req, res, next) {
    const session = sessions[req.cookies["SessionId"]];

    if (session) {
        if (req.body.filepath && /[~$%]/g.test(req.body.filepath) === false) {
            fs.readFile(req.body.filepath, ((err, data) => {
                res.render(`dashboards/${session.role}`, {
                    output: err || data,
                    session,
                    title: "Dashboard"
                });
            }));
        } else {
            res.render(`dashboards/${session.role}`, {
                session,
                title: "Dashboard"
            });
        }
    } else {
        res.redirect("/login")
    }
});

router.get('/log-out', function (req, res) {
    res.clearCookie("SessionId");
    res.redirect("/");
});

router.get('/login', function (req, res, next) {
    res.render('login', {
        title: "Login"
    });
});

router.post("/authenticate", function (req, res, next) {
    const account = accounts.find(account =>
        account.username === req.body.username && account.password === req.body.password
    );

    if (account) {
        const sessionId = uuidv4();
        res.cookie("SessionId", sessionId);
        sessions[sessionId] = {
            role: account.role,
            username: account.username
        };
        res.redirect("/")
    } else {
        res.redirect(401, "/login");
    }
});

module.exports = router;
