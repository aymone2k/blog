const {Validator} = require('node-input-validator');

const articleValidator =(req, res, next)=>{

    if(req.file){
        req.body.image = req.file.filename;// pmis ici uisse que image est déjà géré par multer
    }
    const v = new Validator(req.body,{
        name:'required',
        category: 'required',
        content: 'required',
        image: 'required',
    });
    v.check().then((matched) => {
        if (!matched) {
          //res.status(422).send(v.errors);
          req.flash('errorForm', v.errors );
          return res.redirect('/addArticle');
        }
        next();
      });
}

module.exports = articleValidator;