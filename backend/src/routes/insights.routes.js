import { Router } from 'express';
import { getDashboardInsights } from '../controllers/insights.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/dashboard', getDashboardInsights);

export default router;
