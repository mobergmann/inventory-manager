const express = require('express');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
// const basicAuth = require('express-basic-auth');
// Security
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
// const session = require('cookie-session');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcrypt");
// Custom
const DbInterface = require("./scripts/DbInterface");
// const auth = require('./scripts/auth');
const {logged_in} = require("./scripts/is_loged_in")

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const boardRouter = require('./routes/board');
const authRouter = require('./routes/auth');
const {body} = require("express-validator");


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(basicAuth({authorizer: auth}));

//#region Security

//#region Session

let _session = {
    name: 'session',
    keys: [Math.random().toString()],
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secureProxy: true,
    },
};
// only in production enable certain features
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    _session.cookie.secure = true;
}

// app.use(session(_session));
app.use(session({secret: Math.random().toString()}))

//#endregion

//#region Passport

app.use(passport.initialize());
app.use(passport.session());

// Strategy
passport.use(
    'local',
    new Strategy({
            usernameField: "name",
            passwordField: "password"
        },
        async (name, password, next) => {
            try {
                let user = DbInterface.get_user(name);

                if (!user) {
                    return next(null, false, {message: "User does not exist"});
                }

                // if password is invalid
                if (!bcrypt.compareSync(password, user.pw_hash)) {
                    return next(null, false, {message: "Password is not valid."});
                }

                // user found and password valid
                return next(null, user);
            } catch (e) {
                return next(null, false, {message: e.message});
            }
        }
    )
);

// Serialisation
passport.serializeUser((user, callback) => {
    callback(null, user.id);
});

// Deserialisation
passport.deserializeUser(async (id, callback) => {
    try {
        let user = DbInterface.get_user_by_id(id);
        callback(null, user);
    } catch (e) {
        return callback(e);
    }
});

//#endregion

//#endregion

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api', logged_in, apiRouter);
app.use('/board', logged_in, boardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
