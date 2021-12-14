const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../model/User');

const logger = async (req, res, next) => {
    const date = new Date();
    const dateFormat = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = await jwt.verify(token, config.get('secret'));
    const user = await User.findById(decoded.id);
    const username = user.username;
    const restrictionlevel = user.restrictionlevel;
    console.log(`[${username}-${restrictionlevel}] [${dateFormat}] ${method} ${url} ${status}`);
    next();
}

module.exports = logger;