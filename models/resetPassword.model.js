const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const resetPasswordSchema = mongoose.Schema({
    username: {type: String, required: true},
    resetPasswordToken:{type: String, required: true},
    resetExpires: {type: Number, required: true},
    createdAt: {type: Date, default: Date.now()},

});

resetPasswordSchema.plugin(passportLocalMongoose);

module.exports= mongoose.model('ResetPassword', resetPasswordSchema);