const {Validator} = require('node-input-validator');

const userValidator =(req, res, next)=>{

    const v = new Validator(req.body,{
        name:'required',
        username: 'required',
        email: 'required',
        password: 'required',
        passwordConfirm: 'required|same:password',
    });
    v.check().then((matched) => {
        if (!matched) {
          //res.status(422).send(v.errors);
          req.flash('errorForm', v.errors );
          return res.redirect('/users/signup');
        }
        next();
      });
}

module.exports = userValidator;