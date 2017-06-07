var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/', loggedIn, function(req, res, next) {
    res.render('user/profile');
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/signup', function(req, res, next){
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
        failureRedirect: '/user/signup',
        failureFlash: true
    }), function(req, res, next) {
        res.redirect('/user');
    }
);

router.get('/signin', function(req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function(req, res, next) {
        res.redirect('/');
    }
);

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

function loggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}


module.exports = router;
