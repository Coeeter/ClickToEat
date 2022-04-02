const nodeMailer = require('nodemailer');
const dotenv = require('dotenv').config();
let filePath = require('path');

let transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

function mailOptions(email, username, path) {
    let link;
    if (process.env.NODE_MODE == 'development') {
        link = `http://${process.env.HOST}:${process.env.PORT + path}`;
    } else {
        link = `https://${process.env.HOST + path}`;
    }
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Reset Password Link',
        attachments: [
            {
                filename: 'logo.png',
                path: filePath.join(__dirname, '..', 'Upload', 'logo.png'),
                cid: 'logo'
            }
        ],
        html: `<div style = "background-color: rgba(238, 238, 238, 0.534)">
                    <div style = "display: flex;background-color: #041b3f; color: white; padding: 0.5rem 1rem;">
                        <img style = "width: 74px; height: 74px;" src = "cid:logo">
                        <h1 style = "font-weight:normal!important; margin-left: .5rem;"> ClickToEat</h1>
                    </div>
                    <div style = "padding: 1rem;">
                        <h3 style="font-size: 2rem; margin-top: 0 !important; margin-bottom: 0 !important;">Hello ${username},</h3>
                        <div style = "font-size: 1rem;">There seems to be a request to change your password. Click on the button below to change your password.<br>This link will expire in <b style = "text-decoration: underline;">15 minutes</b></div><br>
                        <a href = "${link}" style = "text-decoration: none; color: white; padding: 1rem; background-color: #fa4614; font-size: 1.5rem; border-radius: .25rem;">Reset Password</a><br><br>
                        <div>If you did not request this change please ignore this.</div><br>
                        <p>Thank you, <br> ClickToEat</p>
                    </div>
               </div>`
    };
}

function sendMail(mailOptions, callback) {
    transporter.sendMail(mailOptions, callback);
}

module.exports = { mailOptions, sendMail };
