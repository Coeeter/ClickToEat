const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();

let app = express();

//declaring middleware
app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(fileUpload());

//front-end routing
app.use('/public', express.static('Static'));
app.use('/upload', express.static('Web_API/Upload'));
app.get('/', (req, res) => {
    res.redirect('/public/Login');
});
app.use('/public', require('./Routes/staticRoutes'));

//restaurant route
app.use('/restaurants', require('./Routes/restaurantRoutes'));

//all users routes
app.use('/users', require('./Routes/usersRoutes'));
app.get('/:tokenizedemail&:token', (req, res) => {
    res.sendFile(__dirname + '/Model/UpdatePassword.html');
});

//all comments routes
app.use('/comments', require('./Routes/commentRoutes'));

//all favorites routes
app.use('/favorites', require('./Routes/favoritesRoutes'));

//all likes or dislikes route
app.use('/likeOrDislike', require('./Routes/likesOrDislikesRoutes'));

app.listen(process.env.PORT, (err) => {
    if (err) throw err;
    console.log(
        `Web server running at http://${process.env.HOST}:${process.env.PORT}`
            .magenta.bold
    );
});
