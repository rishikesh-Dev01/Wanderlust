const express = require('express')
const router = express.Router()
const User = require('../Models/user.model');
const wrapAsync = require('../Utils/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl}  = require('../middleware');

const userController = require('../Controllers/users')


router 
     .route('/signup')
     .get( userController.rederSignupForm)
     .post( wrapAsync(userController.singup));


router 
     .route('/login')
     .get( userController.renderLoginForm)
     .post( 
     saveRedirectUrl,
     passport.authenticate('local', {
     failureRedirect: '/login',
     failureFlash: true,
}),
userController.login);
 

router.get('/logout', userController.logout)


module.exports = router