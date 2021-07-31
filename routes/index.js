var express = require('express');
var router = express.Router();

const articleController = require('../controllers/article.controller');
const categoryController = require('../controllers/category.controller');
const { guard } = require('../middleware/guard');
const multerConfig = require('../middleware/multer.config');
const articleValidator = require('../middleware/validators/article.validator');
const caterogyValidator = require('../middleware/validators/category.validator');
/* GET home page. */

//affichage d'articles
router.get('/', articleController.listArticle);

router.get('/article/:id', articleController.detailArticle);

// ajout d'articles

router.get('/addArticle',guard, articleController.addArticle);

router.post('/addArticle', multerConfig, articleValidator, guard, articleController.addOneArticle);

// modif d'articles
router.get('/editArticle/:id',guard, articleController.editArticle);  //la route qui va afficher l'edition d'article
router.post('/editArticle/:id', multerConfig, guard, articleController.editOneArticle) //rte pr modif l'article
module.exports = router;

//suppression d'article

router.get('/deleteArticle/:id', guard, articleController.deleteArticle );

//ajouter une categorie
router.get('/addCategory', guard, (req, res)=>{
    res.render('addCategory');
});
router.post('/addCategory', guard, caterogyValidator, categoryController.addCategory);

//modifie une catégorie
router.get('/editCategory', categoryController.listCategories);

router.get('/editCategory/:id', guard, categoryController.editCategory);
router.post('/editCategory/:id', guard, caterogyValidator, categoryController.editOneCategory);