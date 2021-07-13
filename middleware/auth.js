const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../model/User');


const auth = (req, res, next) => {
    
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return res.status(401).json({msg: 'Please login with your account!'});

    jwt.verify(token, config.get('secret'), (err, decoded) => {
        if(err) return res.status(400).json({msg: err.message});
        User.findById(decoded.id)
            .then(user => {
                if(!user) return res.status(400).json({msg: err.message});
                req.user = user;
                next();
            })
            .catch(err => {
                return res.status(400).json({msg: err.message});
            });
    })
}

module.exports = auth;