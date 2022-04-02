const express = require('express');
const router = express.Router();
const FavoriteDb = require('../Model/FavoriteDb');
const tokenModel = require('../Model/Token');

let favoriteDb = new FavoriteDb();

//get favorites
router.get('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let username = tokenModel.verify(token);
        respond.json(await favoriteDb.getSpecificFavorites(username));
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

//create favorites
router.post('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let username = tokenModel.verify(token);
        respond.json(
            await favoriteDb.createFavorites(
                username,
                request.body.restaurantId
            )
        );
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

//delete favorites
router.delete('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let username = tokenModel.verify(token);
        respond.json(
            await favoriteDb.deleteFavorites(username, request.body.favoriteId)
        );
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

module.exports = router;
