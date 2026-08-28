import { db } from '../db/db.js';

export const getUseCases = async (req, res) => {
  try {
    const useCases = await db.getUseCases(req.businessId);
    return res.status(200).json({ useCases });
  } catch (error) {
    console.error('getUseCases error:', error);
    return res.status(500).json({ message: 'Failed to retrieve use cases.' });
  }
};

export const createUseCase = async (req, res) => {
  try {
    const { label, pain_points, sort_order } = req.body;
    const newUseCase = await db.createUseCase(req.businessId, {
      label,
      pain_points,
      sort_order
    });
    return res.status(201).json({
      message: 'Use case created successfully',
      useCase: newUseCase
    });
  } catch (error) {
    console.error('createUseCase error:', error);
    return res.status(500).json({ message: 'Failed to create use case.' });
  }
};

export const updateUseCase = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.getUseCaseById(id, req.businessId);
    if (!existing) {
      return res.status(404).json({ message: 'Use case not found.' });
    }

    const updated = await db.updateUseCase(id, req.businessId, req.body);
    return res.status(200).json({
      message: 'Use case updated successfully',
      useCase: updated
    });
  } catch (error) {
    console.error('updateUseCase error:', error);
    return res.status(500).json({ message: 'Failed to update use case.' });
  }
};

export const deleteUseCase = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await db.getUseCaseById(id, req.businessId);
    if (!existing) {
      return res.status(404).json({ message: 'Use case not found.' });
    }

    await db.deleteUseCase(id, req.businessId);
    return res.status(200).json({ message: 'Use case deleted successfully' });
  } catch (error) {
    console.error('deleteUseCase error:', error);
    return res.status(500).json({ message: 'Failed to delete use case.' });
  }
};
