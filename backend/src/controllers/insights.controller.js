import { db } from '../db/db.js';

export const getDashboardInsights = async (req, res) => {
  try {
    const insights = await db.getInsights(req.businessId);
    return res.status(200).json(insights);
  } catch (error) {
    console.error('getDashboardInsights error:', error);
    return res.status(500).json({ message: 'Failed to retrieve dashboard insights.' });
  }
};
