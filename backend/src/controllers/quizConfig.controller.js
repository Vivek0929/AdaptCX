import { db } from '../db/db.js';

export const getQuizConfig = async (req, res) => {
  try {
    const business = await db.getBusinessById(req.businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    const useCases = await db.getUseCases(req.businessId);

    return res.status(200).json({
      question_text: business.quiz_question || 'What best describes your business?',
      options: useCases.map(uc => ({ id: uc.id, label: uc.label }))
    });
  } catch (error) {
    console.error('getQuizConfig error:', error);
    return res.status(500).json({ message: 'Failed to retrieve quiz configuration.' });
  }
};

export const updateQuizConfig = async (req, res) => {
  try {
    const { question_text } = req.body;
    const updated = await db.updateBusiness(req.businessId, { quiz_question: question_text });

    return res.status(200).json({
      message: 'Quiz configuration updated successfully',
      question_text: updated.quiz_question
    });
  } catch (error) {
    console.error('updateQuizConfig error:', error);
    return res.status(500).json({ message: 'Failed to update quiz configuration.' });
  }
};
