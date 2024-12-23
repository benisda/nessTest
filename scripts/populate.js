import dbCon from '../helpers/db_connection.js';

const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
        )
    `;
    await dbCon.query(query);
}

const createSessionTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        expires_at DATETIME NOT NULL
        )
    `;
    await dbCon.query(query);
}

const populateUserTable = async () => {
    const query = `
        INSERT INTO users (username, password)
        VALUES  ('admin', 'admin'),
                ('admin1', 'admin1'),
                ('admin2', 'admin2')
    `;
    await dbCon.query(query);
}

const messageHistory = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS message_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME NOT NULL
        )
    `;
    await dbCon.query(query);
}

export default async () => {
    // createUserTable();
    // createSessionTable();
    // populateUserTable();
    messageHistory();
};