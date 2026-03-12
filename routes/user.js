const express = require('express');
const User = require('../model/user.js');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

// Controller
const userController = require('../controller/userController.js');

// Signup Route
router
.route('/signup')
.get(userController.signupGet)
.post(wrapAsync(userController.signupPost));

// Login Route
router
.route('/login')
.get(userController.loginGet)
.post(saveRedirectUrl, passport.authenticate('local',{failureRedirect : '/login',
                                                failureFlash : true,}), userController.loginPost);
// Logout Route
router.get('/logout', userController.logout);

module.exports = router;