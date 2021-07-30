const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');
var randomToken = require('random-token');
const Reset = require('../models/resetPassword.model');

module.exports = {
   login:(req, res, next)=>{
    const user= new User({
        username: req.body.username,
        password: req.body.password,
    })

    req.login(user, (err)=>{
        if(err){
            req.flash('error', err.message);
            return res.redirect('/users/login');
        }
        passport.authenticate("local", {failureRedirect: '/users/login', failureFlash:'mdp ou username invalide'})(req, res, (err, user)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/login');
            }
            req.flash('success', 'welcome to blog login');
            return res.redirect('/users/dashboard');
            
        })
    })
   },

   signup:(req, res, next)=>{
       //codage en dur sans passport
      /*   bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/signup');
            }

            const newUser = User({...req.body, password: hash});

            console.log(newUser);
            newUser.save((err, user)=>{
                if(err){
                    req.flash('error', err.message);
                    return res.redirect('/users/signup');
                }
                req.flash('success', 'votre compte a été crée vous pouvez vons connecter');
                return res.redirect('/users/login');
            }) 
        });*/
        
        //avec passport
        const newUser = User({
            username :req.body.username,
            name:req.body.name,
            email: req.body.email,
            //le mdp n'est pas à stocker, il sera géré par passport
        })
        //enregistrement
        User.register(newUser, req.body.password, (err, user)=>{
            if(err){
                req.flash('error', err.message)
                return res.redirect('/users/signup');
                    }
        //Authentification
           
            passport.authenticate("local")(req, res, (err, newUser)=>{
                if(err){
                    req.flash('error', err.message);
                    return res.redirect('/users/signup');
                }
                req.flash('success', 'welcome to blog register');
                return res.redirect('/users/login');
                
            })
        })

        },

    resetPassword:(req, res, next)=>{
        User.findOne({username: req.body.username}, (err, user)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/forgotPassword');
            }
            if(!user){
                req.flash('error', 'Username inconnu');
                return res.redirect('/users/forgotPassword');
            }
            //créer un token 
            const token = randomToken(32);
            const reset = new Reset({
                username: req.body.username,
                resetPasswordToken: token,
                resetExpires: Date.now() + 3600000
            })
            reset.save((err, reset)=>{
                if(err){
                    req.flash('error', err.message);
                    return res.redirect('/users/forgotPassword');
                }
                 //envoi email de reinitialisation
                 req.body.email = user.email;
                 req.body.message = "<h3> Bonjour"+user.username+"</h3><br>cliquez sur ce lien pour reinitialiser votre MDP:<br>"+req.protocol+"://"+req.get('host')+"/users/resetPassword/"+token;
                 next();

            })
        });

    },

    resetPasswordForm:(req, res, next)=>{
        const token = req.params.token;
        Reset.findOne({resetPasswordToken: token, resetExpires: {$gt:Date.now()}}, (err, reset)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/forgotPassword');
            }
            if(!reset){
                req.flash('error', 'token invalide!');
                return res.redirect('/users/forgotPassword');
            }
            req.flash('success', 'vous pouvez reset votre password');
            return res.render('resetPassword');
            
        })
    },

    postResetPassword:(req, res, next)=>{
        const token = req.params.token;
        const password = req.body.password;

        Reset.findOne({resetPasswordToken: token, resetExpires: {$gt:Date.now()}}, (err, reset)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/forgotPassword');
            }
            if(!reset){
                req.flash('error', 'token invalide!');
                return res.redirect('/users/forgotPassword');
            }
            //chercher l'user pour change mdp
            User.findOne({username: reset.username}, (err, user)=>{
                if(err){
                    req.flash('error', err.message);
                    return res.redirect('/users/forgotPassword');
                }
                if(!user){
                    req.flash('error', 'Username inconnu');
                    return res.redirect('/users/forgotPassword');
                }
                user.setPassword(password, (err)=>{
                    if(err){
                        req.flash('error', 'impossible de changer le mdp');
                        return res.redirect('/users/forgotPassword');
                    }

                    user.save();
                    Reset.deleteMany({username: user.username}, (err, message)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log(message);
                    });
                })
            })
            
            req.flash('success', 'votre mdp a été mis à jour, vous pouvez vous connecter');
            return res.redirect('/users/login');
        })
    }

    }