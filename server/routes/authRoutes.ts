import express from 'express';
import { checkAuth, register, login } from '../controllers/authController';
import { sanitizeBody } from '../middleware/sanitize';

const router = express.Router();

router.post('/register', sanitizeBody, register);
router.post('/login', sanitizeBody, login);
router.get('/check', checkAuth);

export default router