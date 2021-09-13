const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


exports.registerUser = (req, res) => {
   
    const { username, email, password } = req.body;
    if(!username || !email || !password) return res.status(404).json({msg: 'Please Enter all fields!'})


    User.findOne({email})
        .then(user => {
             if(user) return res.status(404).json({msg:'User already exist!'});
        });

    const newUser = new User({
        username,
        email,
        password
    });
    
    bcrypt.genSalt(10, (err, salt) => {
        if(err) return res.json({msg: err.message});
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) return res.json({msg: err.message});
            newUser.password = hash;
            newUser.save()
                .then(user => {
                    jwt.sign(
                        {id: user.id},
                        config.get('secret'),
                        {expiresIn: '1h'},
                        (err, token) => {
                            if(err) return res.json({msg: err.message});
                            return res.status(200).json({
                                user: {
                                    id: user._id,
                                    username: user.username,
                                    email: user.email,
                                    isApprove: user.isApproved,
                                    restrictionlevel: user.restrictionlevel,
                                    registerDate: user.registerDate,
                                    emailVerified: user.emailVerified,
                                    teamleader: user.teamleader
                                },
                                token,
                            })
                        }
                    )
                })
                .catch(err => {
                   return next(err);
                })
                .catch(() => {
                    return;
                })
        })
    })
}

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) return res.status(400).json({msg:'Please enter all fields!'});

    User.findOne({email})
        .select('+password')
        .then(user => {
            if(!user) return res.status(400).json({msg: 'Invalid cridentials!'});
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({msg: 'Invalid cridentials!'});
                    jwt.sign(
                        {id: user._id},
                        config.get('secret'),
                        {expiresIn: '1h'},
                        (err, token) => {
                            if(err) return res.status(400).json({msg: err.message});
                            return res.status(200).json({
                                user: {
                                    id: user._id,
                                    username: user.username,
                                    email: user.email,
                                    isApprove: user.isApproved,
                                    restrictionlevel: user.restrictionlevel,
                                    registerDate: user.registerDate,
                                    emailVerified: user.emailVerified,
                                    teamleader: user.teamleader
                                },
                                token
                            })
                        }
                    )
                })
                .catch(err => {
                    return next(err);
                })
                .catch(() => {
                    return;
                })
        });
}

exports.addDeductions = (req, res, next) => {

    const {agent, remarks, amount} = req.body;
    User.findById(agent)
        .then(user => {
            if(!user) return res.status(400).json({msg: 'User Not Found'});
            user.fordeductions = [...user.fordeductions, {remarks, amount,date: new Date(), payment: []}]
            user.save();
            return res.status(200).json(user);
        })
        .catch(err => {
            return next(err);
        })

}

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    console.log(req);

    if(!email) return res.status(400).json({msg: 'Please enter email'});

    User.findOne({email})
        .then(user => {
            if(!user) return res.status(404).json({msg:'email does not exist!'});
            const resetToken = crypto.randomBytes(20).toString('hex');

            user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordExpire = Date.now() + 10 * (10 * 1000);

            user.save()
                .then(user => {
                    const resetUrl = `http://localhost:3000/auth/resetpassword/${resetToken}`;
                    
                    const message = `
                    <h1>You have requested a password reset</h1>
                    <p>Please go to this link to reset your password <a href=${resetUrl} clickracking=off>${resetUrl}</a></p>
                    `;

                    sendEmail({
                        to: user.email,
                        subject: 'Password Reset Request',
                        text: message,
                    });

                    return res.status(200).json({msg: 'Email sent, please check you inbox!'});
                })
                .catch(err => {
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpire = undefined;

                    user.save();

                    return next(err);
                })
        })
}

exports.resetPassword = (req, res) => {
    const { password } = req.body;
    if(!password) return res.status(400).json({msg: 'Please enter a password'});
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

    User.findOne({resetPasswordToken, resetPasswordExpire: {$gt : Date.now()}})
        .then(user => {
            if(!user) return res.status(400).json({msg: 'Invalid reset token!'});
            bcrypt.genSalt(10, (err, salt) => {
                if(err) return res.status(400).json({msg: err.message});
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) return res.status(400).json({msg: err.message});
                    user.password = hash;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpire = undefined;

                    user.save();

                    return res.status(200).json({msg:'Password reset success! please login with your new password. Redirecting to login page...'});
                })
            })
        })
        .catch(err => {
            return next(err);
        })
}

exports.verifyEmail = (req, res) => {
    const { email } = req.body;

    if(!email) return res.status(400).json({msg: 'Please enter email'});

    User.findOne({ email })
        .then(user => {
            if(!user) return res.status(404).json({msg:'Email does not exist!'});

            const verifyToken = crypto.randomBytes(20).toString('hex');
            user.verifyEmailToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
            user.verifyEmailExpire = Date.now() + 10 * (60 * 1000);

            user.save()
                .then(user => {
                    const verifytUrl = `http://localhost:3000/home/verifiedemail/${verifyToken}`;
                    
                    const message = `
                    <h1>You have requested to verify your email</h1>
                    <p>Please go to this link to verify your email <a href=${verifytUrl} clickracking=off>${verifytUrl}</a></p>
                    `;

                    sendEmail({
                        to: user.email,
                        subject: 'Email Verification',
                        text: message,
                    });

                    return res.status(200).json({msg: 'Verification email sent'});
                })
                .catch(err => {
                    user.verifyEmailToken = undefined;
                    user.verifyEmailExpire = undefined;

                    user.save();

                    return next(err);
                })
        })
}

exports.emailVerified = (req, res) => {
    const verifyEmailToken = crypto.createHash('sha256').update(req.params.verifyToken).digest('hex');

    User.findOne({verifyEmailToken, verifyEmailExpire: {$gt: Date.now()}})
        .then(user => {
            if(!user) return res.status(400).json({msg:'Email does not exist'});
            user.emailVerified = true;
            user.verifyEmailToken = undefined;
            user.verifyEmailExpire = undefined;

            user.save();

            return res.status(200).json(user);
        })
        .catch(err => {
            return next(err);
        })
}


exports.validateUser = (req, res) => {
    const { id } = req.user;
    User.findById(id)
        .then(user => {
            if(!user) return res.status(400).json({msg: 'Email does not exist'});
            return res.status(200).json(user);
        })
        .catch(err => {
            return next(err);
        })
}

exports.approvedUser = (req, res) => {
    const { id, isApproved, teamleader, restrictionlevel } = req.body;
    if(!id || !isApproved || !restrictionlevel) return res.status(404).json({msg: 'Please complete required field!'});
    if(restrictionlevel === 'agent' && !teamleader) return res.status(404).json({msg: 'Please asign a team leader!'});
    User.findById(id)
        .then(user => {
            if(!user) return res.status(400).json({msg: 'Agent does not exist'});
            user.restrictionlevel = restrictionlevel;
            user.teamleader = teamleader;
            user.isApproved = isApproved;

            user.save();

            return res.status(200).json(user);
        })
        .catch(err => {
            return next(err);
        })
}

exports.getAllUser = (req, res) => {
    User.find()
        .sort({registerDate: -1})
        .then(allUser => {
            return res.status(200).json(allUser);
        })
        .catch(err => {
            return next(err);
        })
}