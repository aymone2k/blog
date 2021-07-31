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
    },

    updateProfile:(req, res, next)=>{
        if(!req.user){
            req.flash('warning', 'Veuillez vous connecter pour modifier le profile');
            return res.redirect('/users/login');
        }
        if(req.user._id != req.body.userId){
            req.flash('error', 'vous ne pouvez pas modifier les informations de ce compte');
            return res.redirect('/users/dashboard');
        }
        User.findOne({_id: req.body.userId}, (err, user)=>{
            if(err){
                console.log(err);
            }
            const oldUsername = user.username;

            user.name = req.body.name ? req.body.name : user.name;
            user.username = req.body.username ? req.body.username : user.username;
            user.email = req.body.email ? req.body.email : user.email;
            
            user.save((err, user)=>{
                if(err){
                    req.flash('error', 'une erreur a été détecté, veuillez essayer encore')
                    return res.redirect('/users/dashboard');
                }
                if(oldUsername != user.username){
                    req.flash('success', 'votre username a été modifié merci de vous reconnecter avec le nouveau username: '+req.body.username );
                    return res.redirect('/users/login');
                }
                req.flash('success', 'mise à jour du profile réussie');
                return res.redirect('/users/dashboard');

            })
        })
    }

    }