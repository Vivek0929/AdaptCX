import { Router } from 'express';
import {
  generateVariants,
  getContentVariants,
  updateContentVariant
} from '../controllers/contentVariants.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { contentVariantUpdateSchema } from '../schemas/zodSchemas.js';

const router = Router();

router.use(requireAuth);

router.post('/generate', generateVariants);
router.get('/', getContentVariants);
router.put('/:id', validate(contentVariantUpdateSchema), updateContentVariant);

export default router;
