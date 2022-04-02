let db = require('../db-connection');

class UserDb {
    getUserList() {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT _id, username, firstName, lastName, imagePath FROM food_beverage.user',
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }

    getProfile(username) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT _id, username, email, phoneNum, firstName, lastName, imagePath, gender, address FROM food_beverage.user WHERE binary username = ?',
                [username],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }

    createUser(user) {
        return new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO user(username, password, email, phoneNum, firstName, lastName, imagePath, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    user.getUsername(),
                    user.getPassword(),
                    user.getEmail(),
                    user.getPhoneNum(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getImagePath(),
                    user.getGender(),
                    user.getAddress()
                ],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }

    logInUser(username) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT password FROM food_beverage.user WHERE binary username = ?',
                [username],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }

    forgotPassword(email) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT username, password FROM food_beverage.user WHERE binary email = ?',
                [email],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }

    updateUser(user, decoded) {
        return new Promise((resolve, reject) => {
            if (user.getPassword()) {
                return db.query(
                    'UPDATE user SET password = ? WHERE binary username = ?',
                    [user.getPassword(), decoded],
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
            }
            if (user.getImagePath()) {
                return db.query(
                    'UPDATE user SET username = ?, email = ?, phoneNum = ?, firstName = ?, lastName = ?, gender = ?, address = ?, imagePath = ? WHERE binary username = ?',
                    [
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhoneNum(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getGender(),
                        user.getAddress(),
                        user.getImagePath(),
                        decoded
                    ],
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
            }
            return db.query(
                'UPDATE user SET username = ?, email = ?, phoneNum = ?, firstName = ?, lastName = ?, gender = ?, address = ? WHERE binary username = ?',
                [
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNum(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getGender(),
                    user.getAddress(),
                    decoded
                ],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }

    deleteUser(username) {
        return new Promise((resolve, reject) => {
            db.query(
                'DELETE FROM user WHERE binary username = ?',
                [username],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
        });
    }
}

module.exports = UserDb;
