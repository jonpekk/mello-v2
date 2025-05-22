import express from 'express';
import { register, login, profile } from '../controllers/userController';
import { tryAuth } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', tryAuth, profile)

export default router;
