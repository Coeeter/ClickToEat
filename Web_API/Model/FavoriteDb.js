const db = require('../db-connection');

class FavoriteDb {
    getSpecificFavorites(username) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM food_beverage.favorites WHERE username = ?',
                [username],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
    createFavorites(username, restaurantID) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO favorites (username, restaurantID) VALUES (?, ?)',
                [username, restaurantID],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
    deleteFavorites(username, favoriteId) {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM favorites WHERE _id = ? AND username = ?',
                [favoriteId, username],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
}

module.exports = FavoriteDb;
