const fs = require('fs');
const Jimp = require('jimp');

const dataURLToFile = (dataurl, filename) => {

    const buffer = Buffer.from(dataurl, "base64");
    // Jimp.read(buffer, (err, res) => {
    //     if (err) throw new Error(err);
    //     res.quality(5).write("resized.jpg");
    // });

    fs.writeFileSync("profile.jpg", buffer); 
    
}

module.exports = dataURLToFile;