import express from 'express';
import { register, login, getProfile, editProfile } from '../controllers/userController';
import { optionalAuth, requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', optionalAuth, getProfile)
router.patch('/:id', requireAuth, editProfile)

export default router;
