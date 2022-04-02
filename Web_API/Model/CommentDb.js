let db = require('../db-connection');

class CommentDb {
    getAllComments() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM food_beverage.comment', (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    }
    createComment(comment) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO comment(restaurantId, restaurant, username, review, datePosted, rating) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    comment.getRestaurantId(),
                    comment.getRestaurant(),
                    comment.getUsername(),
                    comment.getReview(),
                    comment.getDatePosted(),
                    comment.getRating()
                ],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
    updateComment(comment) {
        return new Promise((resolve, reject) => {
            db.query(
                'UPDATE comment SET review = ?, rating = ?, datePosted = ? WHERE _id = ? AND username = ?',
                [
                    comment.getReview(),
                    comment.getRating(),
                    comment.getDatePosted(),
                    comment.getId(),
                    comment.getUsername()
                ],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
    deleteComment(commentId, username) {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM comment WHERE _id = ? AND username = ?',
                [commentId, username],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
}

module.exports = CommentDb;
