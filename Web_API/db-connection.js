const dotenv = require('dotenv').config();
const colors = require('colors');
//connecting to database
let mySql = require('mysql');
let connection = mySql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
connection.connect((err) => {
    if (err) throw err;
    console.log('connected to db'.cyan.bold);
});
module.exports = connection;
