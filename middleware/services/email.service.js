const nodemailer = require('nodemailer');

const sendRestMail = (req, res, next)=>{
    var tranporter = nodemailer.createTranporter({
        service:'gmail',
        auth:{
            user: '',
            pass: '',
        }
    });
    var message = "<br>Message:"+req.body.message;
    var mailOptions ={
        from:'',
        to: req.body.email,
        subject: 'mise a jour de votre password',
        html: message,
    }

    transporter.sendMail(mailOptions, (err, infos)=>{
        if(err){
            console.log(err);
            req.flash('err', err.message );
            return res.redirect('/users/forgotPassword');
        }else{
            console.log(infos);
            req.flash('success', 'un mail viens de vous etre envoyé pour le reset de votre mot de pass:'+req.body.email+'veuillez clique sur le lien pour renouveler votre mot de passe');
            return res.redirect('/users/forgotPassword');
        }
    })
}

module.exports = sendRestMail;