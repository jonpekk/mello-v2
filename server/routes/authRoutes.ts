import express from 'express';
import { checkAuth, register, login } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/check', checkAuth);

export default router