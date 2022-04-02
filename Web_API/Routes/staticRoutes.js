const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Static', 'login.html'));
});
router.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Static', 'createUser.html'));
});
router.get('/ForgotPassword', (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', '..', 'Static', 'emailPassChange.html')
    );
});
router.get('/Home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Static', 'homePage.html'));
});
router.get('/Favorites', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Static', 'favorite.html'));
});
router.get('/Settings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Static', 'updateUser.html'));
});
router.get('/Settings/ResetPassword', (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', '..', 'Static', 'updateUserPassword.html')
    );
});
router.get('/Settings/DeleteAccount', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Static', 'deleteUser.html'));
});
router.get('/:name', (req, res) => {
    res.sendFile(
        path.join(__dirname, '..', '..', 'Static', 'restaurantDetails.html')
    );
});

module.exports = router;
