const User = require('../model/user.js');

module.exports.signupGet = (req, res) =>{
    res.render('user/user.ejs');
}

module.exports.signupPost = async (req, res) =>{
    try{
        let {username, email, password} = req.body;
        const userName = new User({email, username});
        const registeredUser =  await User.register(userName, password);
        req.login(registeredUser, (err) =>{
            if(err){
                next(err);
            }
            req.flash('success', 'Welcome to Wanderlust');
            res.redirect('/listing');
        });
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.loginGet = (req, res) =>{
    res.render('user/login.ejs');
}

module.exports.loginPost =  async(req, res) =>{
    req.flash('success', 'Welcome back to Wanderlust');
    res.redirect(res.locals.redirect || '/listing');
}

module.exports.logout =  (req, res, next) =>{
    req.logout((err) => {
        if(err){
           return next(err);
        } 
        req.flash('success', 'logout successfully!');
        res.redirect('/listing');
    });
}