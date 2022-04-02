let db = require('../db-connection');

class RestaurantDb {
    getAllRestaurants() {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM food_beverage.restaurant',
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
}

module.exports = RestaurantDb;
