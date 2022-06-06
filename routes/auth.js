const express = require('express');
const router = express.Router();
// const {body, validationResult} = require('express-validator');
// const DbInterface = require("../scripts/DbInterface");
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
    // return res.status(200).end(JSON.stringify(_user));
    return res.redirect('/?status=login_needed'); //status(200).end(JSON.stringify(_user));

});

// todo redirect to targeted url (/cpanel/products or /cpanel/users)
router.post('/sign_in',
    passport.authenticate(
        'local',
        { failureRedirect: '/?auth=failure' }),
    function (req, res, next) {
        res.redirect("/board");
        // res.redirect(req.session.returnTo || '/');
        delete req.session.returnTo;
    }
);

router.get('/sign_out', (req, res, next) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;
