const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const passport = require('passport');

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
            return res.redirect('/');
            
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
                return res.redirect('/');
                
            })
        })

        }

}