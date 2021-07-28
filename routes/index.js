var express = require('express');
var router = express.Router();

const articleController = require('../controllers/article.controller');
const multerConfig = require('../middleware/multer.config');
/* GET home page. */

//affichage d'articles
router.get('/', articleController.list);

router.get('/article/:id', articleController.detail);

// ajout d'articles

router.get('/addArticle', articleController.add);

router.post('/addArticle', multerConfig, articleController.addOne);

// suppression d'articles

module.exports = router;
