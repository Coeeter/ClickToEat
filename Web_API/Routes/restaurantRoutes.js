const express = require('express');
const router = express.Router();
const RestaurantDb = require('../Model/RestaurantDb');
const restaurantDb = new RestaurantDb();

//get Restaurant Data
router.get('/', async (request, respond) => {
    try {
        let restaurantList = await restaurantDb.getAllRestaurants();
        if (request.query && request.query.d && request.query.d === 'mobile') {
            const masterTags = [
                'halal',
                'fastFood',
                'fineDining',
                'western',
                'asian',
                'fusion'
            ];
            restaurantList.forEach(async (restaurant) => {
                restaurant.tags = [];
                for (let tag of masterTags) {
                    if (restaurant[`tag-${tag}`] === 1) {
                        restaurant.tags.push(cleanUpTag(tag));
                    }
                    delete restaurant[`tag-${tag}`];
                }
                let building = restaurant['location-building'].slice(
                    restaurant['location-building'].indexOf(',') + 2
                );
                let unit = restaurant['location-building'].slice(
                    0,
                    restaurant['location-building'].indexOf(',')
                );
                restaurant.address = `${building} ${restaurant['location-street']}\n${unit}\nSingapore ${restaurant['location-postalCode']}`;
                for (location of ['building', 'street', 'postalCode'])
                    delete restaurant[`location-${location}`];
            });
        }
        respond.json(restaurantList);
    } catch (error) {
        respond.json(error);
    }
});

function cleanUpTag(tag) {
    switch (tag) {
        case 'halal':
            return 'Halal';
        case 'fastFood':
            return 'Fast Food';
        case 'fineDining':
            return 'Fine Dining';
        case 'western':
            return 'Western Cuisine';
        case 'asian':
            return 'Asian Cuisine';
        case 'fusion':
            return 'Fusion Cuisine';
    }
}

module.exports = router;
