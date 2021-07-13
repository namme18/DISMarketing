const nodemailer = require('nodemailer');
const config = require('config');


const sendEmail = option => {

    const transporter = nodemailer.createTransport({
        host: config.get('host'),
        port: config.get('port'),
        auth:{
            user: config.get('user'),
            pass: config.get('pass')
        }
    });

    const mailOption = {
        from:   config.get('emailFrom'),
        to: option.to,
        subject: option.subject,
        html: option.text
    }

    transporter.sendMail(mailOption, (err, info) => {
        if(err) return console.log(err);
        return console.log(info);
    })

}

module.exports = sendEmail;