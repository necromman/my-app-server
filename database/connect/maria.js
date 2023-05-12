const maria = require('mariadb');

const pool = maria.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    insecureAuth: true,
    connectionLimit: 5,
    charset: 'EUCKR_KOREAN_CI' // charset for EUC-KR in MariaDB
});

pool.getConnection()
    .then(conn => {
        console.log(`Connected to MariaDB: ${process.env.DB_HOST}`);
        conn.release(); // release to pool
    })
    .catch(err => {
        console.log(`Unable to connect to MariaDB: ${err}`);
    });

module.exports = pool;