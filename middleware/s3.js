require('dotenv').config();
const aws = require('aws-sdk');
const fs = require('fs');
const crypto = require('crypto');
const axios = require('axios');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
    region,
    accessKey,
    secretAccessKey,
    signatureVersion: 'v4'
})

//getuploadurl from the s3 bucket

exports.getUploadUrl = async (file, filename) => {
    //const filename = crypto.randomBytes(20).toString('hex');
    const params = {
        Bucket: bucketName,
        Key: filename,
        Expires: 60
    }
    
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    
    const headers = {
        'Content-Type': "multipart/form-data"
    }
    
    return axios.put(uploadUrl, file, headers)
    .then(result => {
            const status = result.status;
            const imgUrl = uploadUrl.split('?')[0];

            const data = {
                status,
                imgUrl,
                completeUrl: uploadUrl
            }

            return data;
        })
        .catch(err => {
            return err;
        })       
}

//upload a file to s3
exports.uploadFile = file => {
    const fileStream = fs.createReadStream(file.path);
    
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise();   

} 

//download a file from s3

exports.getFileStream = fileKey => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    }

    return s3.getObject(downloadParams).createReadStream();
}

//delete a file from s3

exports.deleteFile = fileKey => {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }

    return s3.deleteObject(deleteParams, (err, data) => {
       if(err){
            console.log(`ERROR: ${err}`);
       }else{
            console.log('Successfully deleted!');
       }
    })
}