var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
var logger = require('morgan');
const passport = require('passport');
const User = require('./models/user.model');
const dotenv = require('dotenv').config();

const mongoose = require('mongoose');
const Article = require('./models/article.model');
const Category = require('./models/category.model');



var indexRouter = require('./routes');
var usersRouter = require('./routes/users');

var app = express();
app.use(express.json());//prise en chage du json
app.use(express.urlencoded({extended: false}));// prise en charge des formulaires html


//initialisation de la session

app.use(session({
  secret: process.env.SESSION_SECRET,//clé d'encodage pour le serveur
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
  },
}));

// init flash
app.use(flash());

//init passport
app.use(passport.initialize());
app.use(passport.session());

//passport-local-mongoose
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
  if(req.isAuthenticated()){
    Article.find({author: req.user._id}, (err, articles)=>{
        if(err){
            console.log(err)
        }else{
          console.log(articles);
            res.locals.articles = articles;
         }
         next();
    })
}else{
next();
}
})


//middleware pour mettre des infos en local ce st des fonctionnalitées de flash
app.use((req, res, next)=>{
  if(req.user){
    res.locals.user = req.user; //partt ou on se trouvera ds notre site on aura les infos du user idetifié
  }
  res.locals.warning = req.flash('warning');
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.errorForm = req.flash('errorForm');
  
  next();
})


mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log ("connexion réussie à mongoDB"))
.catch(()=>console.log ("échec de connexion à mongoDB"));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
