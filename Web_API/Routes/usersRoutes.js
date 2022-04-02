const express = require('express');
const router = express.Router();

const UserDb = require('../Model/UserDb');
const User = require('../Model/User');
const bcrypt = require('bcrypt');
const tokenModel = require('../Model/Token');
const fs = require('fs');
const Email = require('../Model/Email');
const path = require('path');
let userDb = new UserDb();

//get user list
router.get('/', async (request, respond) => {
    try {
        respond.json(await userDb.getUserList());
    } catch (error) {
        respond.json(error);
    }
});

//get profile of user
router.get('/:token', async (request, respond) => {
    try {
        let username = tokenModel.verify(request.params.token);
        respond.json(await userDb.getProfile(username));
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

//create user
router.post('/', async (request, respond) => {
    let isMobile = false;
    if (request.query && request.query.d == 'mobile') {
        isMobile = true;
    }
    let uploadedFile;
    let imagePath = null;
    if (request.files) {
        uploadedFile = request.files.uploadFile;
        let now = new Date();
        imagePath = now.getTime() + now.getDate() + uploadedFile.name;
    }

    let password = bcrypt.hashSync(request.body.password, 10);

    let user = new User(
        null,
        request.body.username,
        password,
        request.body.email,
        request.body.phoneNum,
        request.body.firstName,
        request.body.lastName,
        imagePath,
        request.body.gender,
        request.body.address
    );

    try {
        let result = await userDb.createUser(user);
        if (result && imagePath) {
            imagePath = path.join(__dirname, '..', 'Upload', imagePath);
            uploadedFile.mv(imagePath, (err) => {
                if (err) throw err;
            });
        }
        respond.json(result);
    } catch (error) {
        if (isMobile) {
            let code = error.code;
            let errorPoint = getErrorPoint(error.sqlMessage);
            if (code == 'ER_DUP_ENTRY') {
                return respond.json({
                    result: `${errorPoint} is already used by another user.\nPlease choose another ${errorPoint}.`
                });
            }
            if (code == 'ER_DATA_TOO_LONG') {
                return respond.json({
                    result: `${errorPoint} is too long.\nPlease choose another ${errorPoint}.`
                });
            }
        }
        respond.json(error);
    }
});

//update user
router.post('/updateUsers/:token', async (request, respond) => {
    let password;
    if (request.body.password)
        password = bcrypt.hashSync(request.body.password, 10);
    try {
        let decoded = tokenModel.verify(request.params.token);
        let uploadedFile;
        let imagePath = null;
        let oldImagePath = null;
        if (request.files) {
            uploadedFile = request.files.uploadFile;
            let now = new Date();
            // imagePath = __dirname + "/Upload/" + now.getTime() + now.getDate() + uploadedFile.name;
            imagePath = now.getTime() + now.getDate() + uploadedFile.name;
            let profile = await userDb.getProfile(decoded);
            try {
                if (!profile) return respond.json({ result: 'Invalid Token' });
                oldImagePath = profile[0].imagePath;
            } catch (error) {
                console.log(error);
            }
        }
        let user = new User(
            null,
            request.body.username,
            password,
            request.body.email,
            request.body.phoneNum,
            request.body.firstName,
            request.body.lastName,
            imagePath,
            request.body.gender,
            request.body.address
        );
        await userDb.updateUser(user, decoded);
        request.body.password
            ? respond.json({ result: tokenModel.sign(decoded) })
            : respond.json({ result: tokenModel.sign(request.body.username) });
        if (!imagePath) return;
        imagePath = path.join(__dirname, '..', 'Upload', imagePath);
        uploadedFile.mv(imagePath, (err) => {
            if (err) throw err;
        });
        if (!oldImagePath) return;
        oldImagePath = path.join(__dirname, '..', 'Upload', oldImagePath);
        fs.unlinkSync(oldImagePath);
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

//delete user
router.delete('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let decoded = tokenModel.verify(token);
        let imagePath;
        let result = await userDb.getProfile(decoded);
        try {
            if (!result) return respond.json({ result: 'Invalid Token' });
            let profile = result[0];
            imagePath = profile.imagePath;
            if (imagePath) {
                imagePath = path.join(__dirname, '..', 'Upload', imagePath);
                fs.unlinkSync(imagePath);
            }
        } catch (error) {
            console.log(error);
        }
        respond.json(await userDb.deleteUser(decoded));
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

// log in user
router.post('/login', async (request, respond) => {
    let username;
    let password = request.body.password;
    if (request.body.token) {
        try {
            username = tokenModel.verify(request.body.token);
        } catch (error) {
            return respond.json({ result: 'Invalid Token' });
        }
    } else {
        username = request.body.username;
    }
    try {
        let result = await userDb.logInUser(username);
        try {
            bcrypt.compareSync(password, result[0].password)
                ? respond.json({ result: tokenModel.sign(username) })
                : respond.json({ result: 'Invalid Password' });
        } catch (error) {
            respond.json({ result: 'Invalid Username' });
        }
    } catch (error) {
        respond.json(error);
    }
});

//forgot password
router.post('/forgotPassword', async (request, respond) => {
    let email = request.body.email;
    if (request.body.fromEmail) {
        try {
            email = tokenModel.verify(email).email;
        } catch (error) {
            return respond.json({ result: 'Invalid Email' });
        }
    }
    try {
        let result = await userDb.forgotPassword(email);
        if (!result.length) return respond.json({ result: 'Invalid Email' });
        let username = result[0].username;
        let hashedpassword = result[0].password;
        if (request.body.fromEmail) {
            let token = request.body.token;
            try {
                let decoded = tokenModel.specificVerify(token, hashedpassword);
                respond.json({
                    result:
                        username == decoded.username
                            ? tokenModel.sign(decoded.username)
                            : 'Invalid Token'
                });
            } catch (error) {
                respond.json({ result: 'Invalid Token' });
            }
        } else {
            let token = tokenModel.specificSign({ username }, hashedpassword, {
                expiresIn: '15min'
            });
            let tokenizedemail = tokenModel.sign({ email });
            let url = `/${tokenizedemail}&${token}`;
            Email.sendMail(
                Email.mailOptions(email, username, url),
                (errorOfSending, resultOfSending) => {
                    errorOfSending
                        ? respond.json(errorOfSending)
                        : respond.json(resultOfSending);
                }
            );
        }
    } catch (error) {
        respond.json(error);
    }
});

function getErrorPoint(sqlMessage) {
    let errorPoints = [
        ['username', 'Username'],
        ['email', 'Email'],
        ['phoneNum', 'Phone Number'],
        ['firstName', 'Name'],
        ['lastName', 'Name']
    ];
    for (item of errorPoints) {
        if (sqlMessage.includes(item[0])) return item[1];
    }
}

module.exports = router;
