const mysql = require("mysql2/promise");

const userPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.USER_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


module.exports = {
    query: (sql, params) => userPool.query(sql, params),
    userPool,
};