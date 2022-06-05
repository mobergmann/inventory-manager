const express = require('express');
const router = express.Router();
// const {body, validationResult} = require('express-validator');
// const DbInterface = require("../scripts/DbInterface");
const passport = require("passport");

// router.post('/sign_up', function (req, res, next) {
// });

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
