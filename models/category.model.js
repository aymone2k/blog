const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title: String,
    description: String,
    author:{type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

 });

module.exports= mongoose.model('Category', categorySchema);