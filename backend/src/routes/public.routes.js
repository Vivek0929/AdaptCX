import { Router } from 'express';
import {
  getPublicSiteData,
  selectUseCase,
  logPublicEvent
} from '../controllers/public.controller.js';
import { validate } from '../middleware/validate.js';
import { publicApiLimiter } from '../middleware/rateLimit.js';
import { selectUseCaseSchema, publicEventSchema } from '../schemas/zodSchemas.js';

const router = Router({ mergeParams: true });

// Rate limit public unauthenticated endpoints
router.use(publicApiLimiter);

router.get('/site', getPublicSiteData);
router.post('/select-use-case', validate(selectUseCaseSchema), selectUseCase);
router.post('/event', validate(publicEventSchema), logPublicEvent);

export default router;
