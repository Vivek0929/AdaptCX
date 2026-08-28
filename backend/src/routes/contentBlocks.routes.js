import { Router } from 'express';
import {
  getContentBlocks,
  updateContentBlock,
  batchUpdateContentBlocks
} from '../controllers/contentBlocks.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validate } from '../middleware/validate.js';
import { contentBlockSchema, batchContentBlocksSchema } from '../schemas/zodSchemas.js';

const router = Router();

router.use(requireAuth);

router.get('/', getContentBlocks);
router.put('/batch', validate(batchContentBlocksSchema), batchUpdateContentBlocks);
router.put('/:block_key', validate(contentBlockSchema), updateContentBlock);

export default router;
