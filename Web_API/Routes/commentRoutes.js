const express = require('express');
const router = express.Router();
const CommentDb = require('../Model/CommentDb');
const Comment = require('../Model/Comment');
const tokenModel = require('../MOdel/Token');

const commentDb = new CommentDb();

//get all comments
router.get('/', async (request, respond) => {
    try {
        const commentList = await commentDb.getAllComments();
        if (request.query && request.query.d == 'mobile') {
            for (let i = 0; i < commentList.length; i++) {
                let datePosted = new Date(commentList[i].datePosted)
                commentList[i].datePosted = `${datePosted.toDateString()} ${datePosted.toLocaleTimeString()}`
            }
        }
        respond.json(commentList);
    } catch (error) {
        respond.json(error);
    }
});

//create comment
router.post('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let username = tokenModel.verify(token);
        let now = new Date();
        let comment = new Comment(
            null,
            request.body.restaurantId,
            request.body.restaurant,
            username,
            request.body.review,
            now,
            request.body.rating
        );
        respond.json(await commentDb.createComment(comment));
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

//update comment
router.put('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let username = tokenModel.verify(token);
        let now = new Date();
        let comment = new Comment(
            request.body.id,
            request.body.restaurantId,
            request.body.restaurant,
            username,
            request.body.review,
            now,
            request.body.rating
        );
        respond.json(await commentDb.updateComment(comment));
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

//delete comment
router.delete('/:token', async (request, respond) => {
    let token = request.params.token;
    try {
        let username = tokenModel.verify(token);
        respond.json(await commentDb.deleteComment(request.body.id, username))
    } catch (error) {
        respond.json({ result: 'Invalid Token' });
    }
});

module.exports = router;
