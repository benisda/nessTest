import mysql from 'mysql2/promise';

const dbCon = await mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    database: "test"
});

export default dbCon;