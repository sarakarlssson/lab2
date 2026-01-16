
const mysql = require("mysql2/promise");
require('dotenv').config();
const dataBaseInfo =
{
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}

async function createConnection() {
    const connection = await mysql.createConnection(dataBaseInfo)
    console.log('Connected to MySQL server!');
    return connection;
}

module.exports = { createConnection };