const { uploadFile } = require('./s3');
const util = require('util');
const fs = require('fs');
const unlinkFile = util.promisify(fs.unlink);

const uploadResultArray = async (files) => {

    const images = await files.map( async file => {
        const id = file.originalname.split('.')[0];
        const uploadResult = await uploadFile(file);
        await unlinkFile(file.path);
        const data = {
            id,
            key: uploadResult.Key,
            img: uploadResult.Location
        }
        return data;
    })

    return Promise.all(images)
        .then((res) => {
            return res;
        })
        .catch(err => {
            return err;
        })

}

module.exports = uploadResultArray;