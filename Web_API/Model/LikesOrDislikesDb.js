const db = require('../db-connection');

class LikesOrDislikes {
    getAllLikesOrDislikes() {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM food_beverage.likesordislikes',
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
    createLikesOrDislikes(username, commentId, isLiked, isDisliked) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO likesordislikes (username, commentId, isLiked, isDisliked) VALUES (?, ?, ?, ?)',
                [username, commentId, isLiked, isDisliked],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
    deleteLikesOrDislikes(username, id) {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM likesordislikes WHERE username = ? AND _id = ?',
                [username, id],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
}

module.exports = LikesOrDislikes;
