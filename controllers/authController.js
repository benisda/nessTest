import dbCon from '../helpers/db_connection.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';

const BCRYPT_SALT = 10;

export const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('ddd', await bcrypt.hash(password, BCRYPT_SALT))
  const [rows] = await dbCon.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length && await bcrypt.compare(password, rows[0].password)) {
    const token = uuidv6();
    await dbCon.query(
      'INSERT INTO sessions (session_id, user_id, expires_at) VALUES (?, ?, ?)',
      [token, rows[0].id, new Date(Date.now() + 3600000)]
    );
    res.json({ token, success: true });
  } else {
    res.json({ success: false });
  }
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await dbCon.query('SELECT * FROM users WHERE username = ?', [username]);
  if (rows.length) {
    res.json({ success: false });
  } else {
    await dbCon.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, await bcrypt.hash(password, BCRYPT_SALT)]);
    res.json({ success: true });
  }
};

export const logout = async (req, res) => {
  const { token } = req.body;
  await dbCon.query('DELETE FROM sessions WHERE session_id = ?', [token]);
  res.json({ success: true });
}

export const getAllUsers = async (req, res) => {
  const [rows] = await dbCon.query('SELECT * FROM users');
  res.json(rows);
}

export const deleteAllUsers = async (req, res) => {
  await dbCon.query('DELETE FROM users');
  res.json({ success: true });
}