# ClickToEat
<img src="https://github.com/Coeeter/ClickToEat/blob/master/Static/images/favicon/Red%20Fork%20Restaurant%20Logo-modified.png?raw=true" align="left" width="200">
ClickToEat is a restaurant review full stack web application, built using Node.js as the backend and HTML, CSS and JavaScript for the front-end. This application was built for the final submission of my module CDEV/DBAV for my studies in Temasek Polytechnic.
<br clear="left">

## The features this app has to offer are
- User authentication using token
- Uploading of profile photo for user
- Creation and updating and deleting of user data
- Reset password link sending to user's email when forget password
- Data persistance by using MySQL database
- CRUD operations on all tables
- Users can leave a review on restaurant
- Users can like or dislike a review
- Users can see restaurant location in map
- Users can get distance between user and restaurnat
- Users can add restaurants to favorites
- Users can filter and search for restaurants from the table

## The Dependencies this app uses are
- Bcrypt for encrypting of password to be stored in the database
- Cors for any client platform to access the api
- Dotenv to read .env file properties
- Express for easier server creation
- Express-fileupload to upload files to server
- Fs to handle file system of server
- JsonWebToken to create tokens easily
- MySql to connect to the MySQL database
- Nodemailer to send emails to users

## Demonstration of the Web Application
You can watch the demonstration from [here](https://www.youtube.com/watch?v=gg-qN1EtavA)

## Installation
If you want to try running the server you can download the files in a zip folder from [here](https://github.com/Coeeter/ClickToEat/archive/refs/heads/master.zip) or clone the repository by using https://github.com/Coeeter/ClickToEat.git.<br><br>
Make sure to run the queries from `Web_API/SQL/food_beverage_restaurant.sql` to your MySQL database to get the restaurant data. <br><br>
Ensure you add these properties to the `.env` file in the root folder of this project with your values.
``` properties
HOST = HOST_OF_THIS_APP_TO_RUN_ON
PORT = PORT_OF_THIS_APP_TO_RUN_ON
DB_HOST = HOST_WHERE_DATABASE_IS_AT
DB_PORT = PORT_WHERE_DATABASE_IS_AT
DB_USER = USERNAME_OF_DATABASE_USER
DB_PASSWORD = PASSWORD_OF_DATABASE
DB_NAME = NAME_OF_DATABASE_TO_CONNECT_TO
EMAIL = EMAIL_TO_SEND_PASSWORD_RESET_LINK
EMAIL_PASSWORD = PASSWORD_OF_EMAIL_SENDING_LINK
SECRET_KEY = SECRET_KEY_FOR_ENCRYPTION
```
Finally open a terminal from the root folder of this project and execute these commands to run the Web Application
``` bash
npm install
node Web_API/Server.js
```
