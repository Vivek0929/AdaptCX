import { Router } from 'express';
import { signup, login, getMe, updateProfile } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { signupSchema, loginSchema, updateProfileSchema } from '../schemas/zodSchemas.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, getMe);
router.put('/profile', requireAuth, validate(updateProfileSchema), updateProfile);

export default router;
