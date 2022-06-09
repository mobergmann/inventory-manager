const express = require('express');
const router = express.Router();
const passport = require("passport");
const {body} = require("express-validator");
const bcrypt = require("bcrypt");
const DbInterface = require("../scripts/DbInterface");

const user_validation = [
    body("name").isLength({min: 3}),
    body("mail").isEmail(),
    body("password").notEmpty()//.isStrongPassword()
];


router.post('/sign_up', user_validation, function (req, res, next) {
    try {
        let hash = bcrypt.hashSync(req.body.password, 12);
        let date = new Date().toString();

        let user = {
            name: req.body.name,
            mail: req.body.mail,
            pw_hash: hash,
            registration_date: date // todo {format: "%Y-%m-%d %H:%M:%S"}
        };

        let _user = DbInterface.new_user(user);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).end(JSON.stringify(_user));
    }
    catch (e) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).end(JSON.stringify(e));
    }
});

router.post('/sign_in',
    passport.authenticate(
        'local',
        { failureRedirect: '/?auth=failure' }),
    function (req, res, next) {

    res.setHeader('Content-Type', 'application/json');
        delete req.session.returnTo;
        return res.status(200).end();
    }
);

router.get('/sign_out', (req, res, next) => {
    req.logout(() => {
        return res.status(200).end();
    });
});


module.exports = router;
