const Article = require('../models/article.model');
const Category = require('../models/category.model');
const fs = require('fs');

// affichage

exports.listArticle = (req, res)=>{
     //res.render('index', { title: 'Express' });
  Article.find()
  .then((articles)=>{
    res.render('index', {title:'Mon Blog', 'articles': articles })
   // res.status(200).json(articles)
  })
  .catch((err)=>{
    //res.status(204).json(err)
  });
}

exports.detailArticle = (req, res, next)=>{
    idArticle = req.params.id;
    Article.findOne({_id: idArticle})
    .then((article)=>{
      res.render('detailArticle', {article: article})
    })
    .catch((err)=>{
      res.redirect('/');
    });
  }

  // methode permettant de produire l'affichage de addarticle
  exports.addArticle = (req,res,next)=>{
      Category.find()
      .then((categories)=>{
        res.render('addArticle',
         {categories: categories, success: req.flash('success'), error: req.flash('error') });
            })
        .catch(()=>{
          res.redirect('/');
      });
  }
//methode permettant d'ajouter un article
  exports.addOneArticle = (req, res, next)=>{
    var article = new Article( {
        ...req.body, 
        image: `${req.protocol}://${req.get('host')}/images/articles/${req.file.filename}`,
        createdAt:Date.now()});
        //console.log(article);
      article.save((err, article)=>{
         if(err){
             req.flash('error', 'erreur survenue')
             return res.redirect('/addArticle');
         } 
         req.flash('success', 'votre message a été envoyé')
         return res.redirect('/');
     });
/*  article.save(err, article).then(()=> 
       // res.render('addArticle', {success: "votre article a été ajouté"}))
       req.flash('success', 'votre message a été envoyé'),
        console.log(req.flash('success', 'mon succes')),
       res.redirect('/'))

    .catch(()=>
       // res.render('addArticle', {error:"sorry "})); 
         req.flash('error', 'erreur survenue') ,
         console.log(req.flash('error', 'erreur survenue')),
         res.redirect('/addArticle')) */
  }
   
     /*    )
    .catch((err)=>
       ,
        res.redirect('/addArticle'));  */

exports.editArticle =(req, res)=>{
  const id = req.params.id;
  Article.findOne({_id: id}, (err, article)=>{
    if(err){
      req.flash('error', err.message);
      return res.redirect('/');
    }
    Category.find((err, categories)=>{
      if(err){
        req.flash('error', err.message);
        return res.redirect('/');
      }
      return res.render('editArticle', {categories: categories, article: article})
    })
  })
}

exports.editOneArticle =(req, res)=>{
  const id = req.params.id;
  Article.findOne({_id: id}, (err, article)=>{
    if(err){
      req.flash('error', err.message)
      return res.redirect('/editArticle/'+id);
    }

    if(req.file){//s'il ya un fichier penser à supprimer l'ancienne image
      const filename = article.image.split('/articles/')[1];
      fs.unlink(`public/images/articles/${filename}`, ()=>{
        console.log('image supprimée:' +filename);
      })
    }
  article.name = req.body.name ? req.body.name : article.name; //est ce ke nom est modifié? si oui on le MAJ si non on conserve l'ancien 
  article.category = req.body.category ? req.body.category : article.category;
  article.content = req.body.content ? req.body.content : article.content;
  article.image = req.file ? `${req.protocol}://${req.get('host')}/images/articles/${req.file.filename}` : article.image;
//fonctionne mais l'ancienne image est restée sur le serveur, il faut penser à la supprimer 
  article.save((err, article)=>{
    if(err){
      req.flash('error', err.message)
      return res.redirect('/editArticle/'+id);
  }
  req.flash('success', "modifs effectuées!");
  return res.redirect('/editArticle/'+id);
})
})
}