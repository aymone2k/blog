const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    name: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: String, required: true},
    image:{type: String, required: true},
    createdAt: {type: Date, required: true},

});

module.exports= mongoose.model('Article', articleSchema);