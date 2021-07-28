const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
}


const storage = multer.diskStorage({
    destination:(req, file, callback)=>{
        callback(null, 'public/images/articles')
    },
    filename:(req, file, callback)=>{
        var name = Math.floor(Math.random() * Math.floor(15258652325)).toString();//reccup un nbre aléatoire puis on le converti en string
        name += Math.floor(Math.random() * Math.floor(8258652325)).toString();
        name += Math.floor(Math.random() * Math.floor(995258652325)).toString();//renouveler plrs fois pr plus d'aléatoire
        name += Date.now()+".";

        const extension = MIME_TYPES[file.mimetype];
        name += extension;
        callback(null, name); 
    }
})

module.exports = multer({storage}).single('image');