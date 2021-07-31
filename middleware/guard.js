//verif si user isAuthenticated

exports.guard = (req, res, next)=>{
    if(!req.user){
        req.flash('warning', 'veuillez vous authentifier');
        return res.redirect('/users/login');
    }
    next();
}