const Article = require('../models/article.model');

exports.listArticles((req, res)=>{
    if(req.isAuthenticated()){
        Article.find({author: req.user._id}, (err, articles)=>{
            if(err){
                console.log(err)
            }else{
                res.locals.articles = articles;
             }
             next();
        })
}else{
    next();
}
})