import express from 'express';
import { login, register, logout, getAllUsers, deleteAllUsers } from '../controllers/authController.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/users', getAllUsers);
router.get('/deleteAllUsers', deleteAllUsers);

export default router;