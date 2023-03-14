const maria = require('mysql');

const conn = maria.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    insecureAuth: true,
    charset: 'utf-8'
});

module.exports = conn;