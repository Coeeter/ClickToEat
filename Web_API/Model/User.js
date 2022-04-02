class User {
    constructor(
        id,
        username,
        password,
        email,
        phoneNum,
        firstName,
        lastName,
        imagePath,
        gender,
        address
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNum = phoneNum;
        this.firstName = firstName;
        this.lastName = lastName;
        this.imagePath = imagePath;
        this.gender = gender;
        this.address = address;
    }

    getId() {
        return this.id;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getEmail() {
        return this.email;
    }
    getPhoneNum() {
        return this.phoneNum;
    }
    getFirstName() {
        return this.firstName;
    }
    getLastName() {
        return this.lastName;
    }
    getImagePath() {
        return this.imagePath;
    }
    getGender() {
        return this.gender;
    }
    getAddress() {
        return this.address;
    }
}

module.exports = User;
