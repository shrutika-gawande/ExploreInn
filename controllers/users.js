const User = require("../models/user");

module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        //after signup auto login 
        req.login(registeredUser, (err) => {
            if (err) { return next(err); }
            req.flash("success", "Welcome to ExploreInn!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome back to ExploreInn!");
        const redirectUrl = res.locals.redirectUrl || "/listings"; // fallback
        res.redirect(redirectUrl);
    };

    module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash("success", "Logged Out Successfully!");
        res.redirect("/listings");
    });
};