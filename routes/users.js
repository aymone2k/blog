var express = require('express');
const userController = require('../controllers/user.controller');
const { guard } = require('../middleware/guard');
const loginValidator = require('../middleware/validators/login.validator');
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