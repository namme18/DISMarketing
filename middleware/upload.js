const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploadImages/'))
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-')+crypto.randomBytes(20).toString('hex')+ "--" +file.originalname);
    },
});


const upload = multer({storage: fileStorageEngine})

module.exports = upload;