var express = require('express');
var router = express.Router();

const articleController = require('../controllers/article.controller');
const multerConfig = require('../middleware/multer.config');
const articleValidator = require('../middleware/validators/article.validator');
/* GET home page. */

//affichage d'articles
router.get('/', articleController.listArticle);

router.get('/article/:id', articleController.detailArticle);

// ajout d'articles

router.get('/addArticle', articleController.addArticle);

router.post('/addArticle', multerConfig, articleValidator, articleController.addOneArticle);

// modif d'articles
router.get('/editArticle/:id', articleController.editArticle);  //la route qui va afficher l'edition d'article
router.post('/editArticle/:id', multerConfig, articleController.editOneArticle) //rte pr modif l'article
module.exports = router;
