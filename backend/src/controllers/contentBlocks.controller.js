import { db } from '../db/db.js';

const VALID_BLOCK_KEYS = [
  'hero_headline',
  'hero_subheadline',
  'feature_1',
  'feature_2',
  'feature_3',
  'cta_text',
  'testimonial'
];

export const getContentBlocks = async (req, res) => {
  try {
    const blocks = await db.getContentBlocks(req.businessId);
    
    // Map into convenient key-value object as well as array
    const blockMap = {};
    VALID_BLOCK_KEYS.forEach(key => {
      const found = blocks.find(b => b.block_key === key);
      blockMap[key] = found ? found.default_value : '';
    });

    return res.status(200).json({ blocks, blockMap });
  } catch (error) {
    console.error('getContentBlocks error:', error);
    return res.status(500).json({ message: 'Failed to retrieve baseline content blocks.' });
  }
};

export const updateContentBlock = async (req, res) => {
  try {
    const { block_key } = req.params;
    const { default_value } = req.body;

    if (!VALID_BLOCK_KEYS.includes(block_key)) {
      return res.status(400).json({
        message: `Invalid block_key. Must be one of: ${VALID_BLOCK_KEYS.join(', ')}`
      });
    }

    const updated = await db.upsertContentBlock(req.businessId, block_key, default_value);
    return res.status(200).json({
      message: 'Content block updated successfully',
      block: updated
    });
  } catch (error) {
    console.error('updateContentBlock error:', error);
    return res.status(500).json({ message: 'Failed to update content block.' });
  }
};

export const batchUpdateContentBlocks = async (req, res) => {
  try {
    const { blocks } = req.body;
    const results = [];

    for (const [key, value] of Object.entries(blocks)) {
      if (VALID_BLOCK_KEYS.includes(key)) {
        const updated = await db.upsertContentBlock(req.businessId, key, value);
        results.push(updated);
      }
    }

    return res.status(200).json({
      message: 'Baseline content blocks updated successfully',
      blocks: results
    });
  } catch (error) {
    console.error('batchUpdateContentBlocks error:', error);
    return res.status(500).json({ message: 'Failed to update content blocks in batch.' });
  }
};
