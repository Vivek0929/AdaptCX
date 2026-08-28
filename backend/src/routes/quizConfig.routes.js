import { Router } from 'express';
import { getQuizConfig, updateQuizConfig } from '../controllers/quizConfig.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { quizConfigSchema } from '../schemas/zodSchemas.js';

const router = Router();

router.use(requireAuth);

router.get('/', getQuizConfig);
router.put('/', validate(quizConfigSchema), updateQuizConfig);

export default router;
