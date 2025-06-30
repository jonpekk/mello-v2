import express from 'express';
import { getProfile, editProfile } from '../controllers/userController';
import { optionalAuth, requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/:id', optionalAuth, getProfile)
router.patch('/:id', requireAuth, editProfile)

export default router;
