class Comment {
    constructor(
        id,
        restaurantId,
        restaurant,
        username,
        review,
        datePosted,
        rating
    ) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.restaurant = restaurant;
        this.username = username;
        this.review = review;
        this.datePosted = datePosted;
        this.rating = rating;
    }
    getId() {
        return this.id;
    }
    getRestaurantId() {
        return this.restaurantId;
    }
    getRestaurant() {
        return this.restaurant;
    }
    getUsername() {
        return this.username;
    }
    getReview() {
        return this.review;
    }
    getDatePosted() {
        return this.datePosted;
    }
    getRating() {
        return this.rating;
    }
}

module.exports = Comment;
