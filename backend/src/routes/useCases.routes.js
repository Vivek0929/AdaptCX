import { Router } from 'express';
import {
  getUseCases,
  createUseCase,
  updateUseCase,
  deleteUseCase
} from '../controllers/useCases.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { useCaseSchema } from '../schemas/zodSchemas.js';

const router = Router();

router.use(requireAuth);

router.get('/', getUseCases);
router.post('/', validate(useCaseSchema), createUseCase);
router.put('/:id', validate(useCaseSchema.partial()), updateUseCase);
router.delete('/:id', deleteUseCase);

export default router;
