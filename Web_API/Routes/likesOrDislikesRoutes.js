const express = require('express');
const router = express.Router();
const LikesOrDislikesDb = require('../Model/LikesOrDislikesDb');
const tokenModel = require('../Model/Token');

const likesOrDislikesDb = new LikesOrDislikesDb();

//get likes and dislikes
router.get('/', async (request, respond) => {
    try {
        respond.json(await likesOrDislikesDb.getAllLikesOrDislikes());
    } catch (error) {
        respond.json(error);
    }
});

//create likes and dislikes
router.post('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let username = tokenModel.verify(token);
        if (
            request.body.isLiked === request.body.isDisliked ||
            (request.body.isLiked != 0 && request.body.isLiked != 1) ||
            (request.body.isDisliked != 0 && request.body.isDisliked != 1)
        ) {
            return respond.json({
                result: 'Invalid isLiked and isDisliked values'
            });
        }
        respond.json(
            await likesOrDislikesDb.createLikesOrDislikes(
                username,
                request.body.commentId,
                request.body.isLiked,
                request.body.isDisliked
            )
        );
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

//delete likes and dislikes
router.delete('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let username = tokenModel.verify(token);
        respond.json(
            await likesOrDislikesDb.deleteLikesOrDislikes(
                username,
                request.body.id
            )
        );
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

module.exports = router;
