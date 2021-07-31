const Category = require("../models/category.model");
const User = require('../models/user.model');

exports.addCategory = (req, res, next)=>{
    
    const newCategory = new Category({
        ...req.body,
        author: req.user,
    });
    newCategory.save((err, category)=>{
        if(err){
            console.log(err.message)
        }
        req.flash('success', `la catégorie: ${req.body.title} a été ajoutée`);
        res.redirect('/addCategory');
    })
}

exports.listCategories = (req, res, next)=>{
    
    Category.find().then((categories)=>{
        res.render('listCategory', {'categories':categories})
    })
};

exports.editCategory = (req, res, next)=>{
    Category.findOne({_id: req.params.id}, (err, category)=>{
        if(err){
            req.flash('error', err.message);
            res.redirect('/')
        }
        return res.render('editCategory',{category:category})       
    })
};

exports.editOneCategory = (req, res, next)=>{
    const id = req.params.id;
    Category.findOne({_id: id, author: req.user._id},(err, category)=>{
        if(err){
            req.flash('error', err.message)
            return res.redirect('/editCategorie'+id);
        }
        if(!category){
            req.flash('error', 'vous ne disposez pas les droits pour modifier cette catégorie')
            return res.redirect('/');
        }
        category.title = req.body.title ? req.body.title: category.title;
        category.description = req.body.description ? req.body.description : category.description;

        category.save((err, category)=>{
            if(err){
                req.flash('error', err.message)
                return res.render('/editCategory/'+id);
            }
            req.flash('success', `la catégorie a été modifiée`)
            return res.redirect('/editCategory/'+id);
        })
    } )
}