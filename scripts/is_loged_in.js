function isLoggedIn_errorRedirect(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
            req.session.returnTo = req.originalUrl || req.url;
        }
        req.session.returnTo = req.originalUrl;
        return res.redirect('/auth/login');
    }
    next();
}

function isLoggedIn_errorJson(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
            req.session.returnTo = req.originalUrl || req.url;
        }
        return res.status(401).end(JSON.stringify({message: 'You need to be lodged in, to access the route.'}));
    }
    next();
}

function logged_in(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/?status=failure'); // if not auth

    // res.locals.login = req.isAuthenticated();
    // if (req.user) {
    //     next();
    // } else {
    //     res.redirect('/login');
    // }
}

module.exports = {
    logged_in,
    isLoggedIn_errorRedirect,
    isLoggedIn_errorJson
}
