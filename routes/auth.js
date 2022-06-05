const express = require('express');
const router = express.Router();
// const {body, validationResult} = require('express-validator');
// const DbInterface = require("../scripts/DbInterface");
const passport = require("passport");
const {body} = require("express-validator");

const user_validation = [
    body("name").isLength({min: 3}),
    body("mail").isEmail(),
    body("pw_hash").notEmpty(),
    body("registration_date").isDate({format: "%Y-%m-%d %H:%M:%S"})
];


router.post('/sign_up', user_validation, function (req, res, next) {
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
