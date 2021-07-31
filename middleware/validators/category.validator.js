const {Validator} = require('node-input-validator');

const caterogyValidator =(req, res, next)=>{

    const v = new Validator(req.body,{
        title:'required',
        description: 'required',
    });
    v.check().then((matched) => {
        if (!matched) {
          //res.status(422).send(v.errors);
          req.flash('errorForm', v.errors );
          return res.redirect('/addCategory');
        }
        next();
      });
}

module.exports = caterogyValidator;