import express from 'express';
import { getProfile, editProfile } from '../controllers/userController';
import { optionalAuth, requireAuth } from '../middleware/auth';
import { sanitizeBody } from '../middleware/sanitize';

const router = express.Router();

router.get('/:id', optionalAuth, getProfile)
router.patch('/:id', requireAuth, sanitizeBody, editProfile)

export default router;
