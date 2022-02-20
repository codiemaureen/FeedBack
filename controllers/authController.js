const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login',
    successRedirect: '/',
    successFlash: 'You have successfully logged in'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have successfully logged out 👋');
    res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next(); 
        return;
    }
    req.flash('error', 'You must be logged in!');
    res.redirect('/login');
};