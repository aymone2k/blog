const Article = require('../models/article.model');
const Category = require('../models/category.model');

// affichage

exports.list = (req, res)=>{
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

exports.detail = (req, res, next)=>{
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
  exports.add = (req,res,next)=>{
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
  exports.addOne = (req, res, next)=>{
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