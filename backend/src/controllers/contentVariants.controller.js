import { db } from '../db/db.js';
import { generateVariantsWithAI } from '../lib/ai.js';

export const generateVariants = async (req, res) => {
  try {
    const businessId = req.businessId;
    const business = req.business;

    // 1. Fetch all use cases for this business
    const useCases = await db.getUseCases(businessId);
    if (!useCases || useCases.length === 0) {
      return res.status(400).json({
        message: 'No use cases defined. Please create at least one use case before generating AI variants.'
      });
    }

    // 2. Fetch current baseline blocks
    const rawBlocks = await db.getContentBlocks(businessId);
    const baselineBlocks = {};
    rawBlocks.forEach(b => {
      baselineBlocks[b.block_key] = b.default_value;
    });

    const results = [];
    const errors = [];

    // 3. Loop over each use case and generate variants
    for (const useCase of useCases) {
      try {
        const generated = await generateVariantsWithAI({
          business,
          useCase,
          baselineBlocks
        });

        // Upsert each of the 7 blocks
        const savedBlocks = {};
        for (const [blockKey, value] of Object.entries(generated)) {
          const saved = await db.upsertContentVariant(
            businessId,
            useCase.id,
            blockKey,
            value,
            true
          );
          savedBlocks[blockKey] = saved;
        }

        results.push({
          use_case_id: useCase.id,
          label: useCase.label,
          variants: generated
        });
      } catch (genErr) {
        console.error(`Error generating for use case ${useCase.label}:`, genErr);
        errors.push({
          use_case_id: useCase.id,
          label: useCase.label,
          error: genErr.message
        });
      }
    }

    return res.status(200).json({
      message: `Successfully generated tailored content variants for ${results.length} use cases.`,
      generated: results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('generateVariants error:', error);
    return res.status(500).json({ message: 'Internal server error during content variant generation.' });
  }
};

export const getContentVariants = async (req, res) => {
  try {
    const variants = await db.getContentVariants(req.businessId);
    const useCases = await db.getUseCases(req.businessId);

    // Group variants by use case for clean UI consumption
    const grouped = useCases.map(uc => {
      const ucVariants = variants.filter(v => v.use_case_id === uc.id);
      const variantMap = {};
      ucVariants.forEach(v => {
        variantMap[v.block_key] = {
          id: v.id,
          generated_value: v.generated_value,
          is_published: v.is_published,
          created_at: v.created_at
        };
      });

      return {
        use_case: {
          id: uc.id,
          label: uc.label,
          pain_points: uc.pain_points,
          sort_order: uc.sort_order
        },
        blocks: variantMap
      };
    });

    return res.status(200).json({ variants, grouped });
  } catch (error) {
    console.error('getContentVariants error:', error);
    return res.status(500).json({ message: 'Failed to retrieve content variants.' });
  }
};

export const updateContentVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { generated_value, is_published } = req.body;

    const updates = {};
    if (generated_value !== undefined) updates.generated_value = generated_value;
    if (is_published !== undefined) updates.is_published = is_published;

    const updated = await db.updateContentVariant(id, req.businessId, updates);
    if (!updated) {
      return res.status(404).json({ message: 'Content variant not found.' });
    }

    return res.status(200).json({
      message: 'Content variant updated successfully',
      variant: updated
    });
  } catch (error) {
    console.error('updateContentVariant error:', error);
    return res.status(500).json({ message: 'Failed to update content variant.' });
  }
};
