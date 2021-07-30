var express = require('express');
const userController = require('../controllers/user.controller');
const { guard } = require('../middleware/guard');
const sendRestMail = require('../middleware/services/email.service');
const loginValidator = require('../middleware/validators/login.validator');
const resetValidator = require('../middleware/validators/reset.validator');
const userValidator = require('../middleware/validators/user.validator');
var router = express.Router();

/**
 * login
 */
router.get('/login', (req, res, next)=> {
  res.render('login');
});

router.post('/login', loginValidator, userController.login);

/**
 * signup
 */
router.get('/signup', (req, res, next)=> {
  res.render('signup');
});

router.post('/signup', userValidator, userController.signup);

module.exports = router;

/**
 * Dashboard
 */

router.get('/dashboard', guard, (req, res)=>{
  res.render('dashboard');
})

/**
 * Logout
 */
router.get('/logout', (req, res, next)=>{
  req.logout();
  req.flash('success','goodbye' );
  res.redirect('/');
})

/**
 * Forgot Password
 */
router.get('/forgotPassword', (req, res)=>{
  res.render('forgotPassword')
})

router.post('/forgotPassword', userController.resetPassword, sendRestMail)

/**
 * Reset Password
 */
 router.get('/resetPassword/:token', userController.resetPasswordForm);
 router.post('/resetPassword/:token', resetValidator, userController.postResetPassword);