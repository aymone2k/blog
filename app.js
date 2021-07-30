var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
var logger = require('morgan');
const passport = require('passport');
const User = require('./models/user.model');

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
  secret: 'je saisie ma cle dencodage',//clé d'encodage pour le serveur
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


mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log ("connexion réussie à mongoDB"))
.catch(()=>console.log ("échec de connexion à mongoDB"));

//CRUD
//creation
/* var article = new Article(
  {
    name: "article",
    content: "pour le fun",
    createdAt: Date.now(),
  }
)
article.save().then(()=> console.log('article sauvegardé!')).catch(()=>console.log("article non sauvegardé"));
 */
//insertion de plrs articles

/* for (let index = 0; index < 20; index++) {
  var article = new Article(
    {
      name: `article ${index}`,
      content: `description n° ${index} pour mon article`,
     
      createdAt: Date.now(),
    }
  )
  article.save().then(()=> console.log('article sauvegardé!')).catch(()=>console.log("article non sauvegardé"));

} */ 
/* 
for (let index = 0; index < 4; index++) {
  var category = new Category(
    {
      title: `category ${index}`,
      description: `description catégorie ${index} `,
          }
  )
  category.save().then(()=> console.log('categorie sauvegardé!')).catch(()=>console.log("categorie non sauvegardé"));

} 
 */
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('je saisie ma cle dencodage'));
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
