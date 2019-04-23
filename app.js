const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const uuidv4 = require('uuid/v4');

const {config} = require('./package');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
Object.assign(app.locals, config);

// setup session manager
app.set('sessions', new Map());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.route("/log-out")
    .all(function (req, res) {
        res.clearCookie(process.env.npm_package_config_session);
        res.redirect("/");
    });

// Check if an incoming request has an active session. If it does, continue as usual. Otherwise, require them to log in
// before allowing them to continue as usual.
app.use("/", function (req, res, next) {
    const sessionId = req.cookies[process.env.npm_package_config_session];
    const sessions = app.get('sessions');

    if (sessions.has(sessionId)) {
        req.session = sessions.get(sessionId);
        next();
    } else {
        if (req.body.username && req.body.password) {
            const account = config.accounts.find(
                account => account.username === req.body.username && account.password === req.body.password);
            if (account !== undefined) {
                const sessionId = uuidv4();
                res.cookie(process.env.npm_package_config_session, sessionId);
                sessions.set(sessionId, {
                    account,
                    createdAt: new Date(),
                    id: sessionId
                });
                console.log(`${account.username} logged in at ${new Date().toLocaleString()}`);
                res.redirect(req.body.continue);
            } else {
                res.status(401);
                res.render("log-in", {
                    continueTo: req.path,
                    title: "Log in",
                    wrongCredentials: true
                });
            }
        } else {
            res.status(401);
            res.render("log-in", {
                continueTo: req.path,
                title: "Log in"
            });
        }
    }
});

app.get("/", function (req, res) {
    res.render(`portals/${req.session.account.role}`, {
        session: req.session,
        title: `Portal - ${req.session.account.username}`
    });
});

app.post("/file-viewer", function(req, res) {
    res.sendFile(req.body.path, {
        root: "."
    });
});

module.exports = app;
