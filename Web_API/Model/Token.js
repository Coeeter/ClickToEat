const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
let buffer = new Buffer.from(process.env.SECRET_KEY);
const key = buffer.toString('base64');

function sign(username) {
    return jwt.sign(username, key);
}

function verify(token) {
    return jwt.verify(token, key);
}

function specificSign(username, specificKey, expiry) {
    return expiry
        ? jwt.sign(username, specificKey, expiry)
        : jwt.sign(username, specificKey);
}

function specificVerify(token, specificKey) {
    return jwt.verify(token, specificKey);
}

module.exports = { sign, verify, specificSign, specificVerify };
