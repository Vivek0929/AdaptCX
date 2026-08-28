import { db } from '../db/db.js';

export const getPublicSiteData = async (req, res) => {
  try {
    const { businessId } = req.params;

    const business = await db.getBusinessById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    const useCases = await db.getUseCases(businessId);
    const rawBlocks = await db.getContentBlocks(businessId);

    // Format baseline blocks into a map with sensible defaults
    const baselineMap = {
      hero_headline: `Intelligent Solutions for Modern ${business.business_name}`,
      hero_subheadline: business.product_description,
      feature_1: 'Seamless workflow integration',
      feature_2: 'Real-time analytics and tracking',
      feature_3: 'Enterprise security & scale',
      cta_text: 'Get Started Now',
      testimonial: `“AdaptCX completely transformed our website engagement.” — Marketing Lead`
    };

    rawBlocks.forEach(b => {
      baselineMap[b.block_key] = b.default_value;
    });

    return res.status(200).json({
      business_id: business.id,
      business_name: business.business_name,
      industry: business.industry,
      quiz_question: business.quiz_question || 'What best describes your business?',
      use_cases: useCases.map(uc => ({
        id: uc.id,
        label: uc.label,
        sort_order: uc.sort_order
      })),
      baseline_blocks: baselineMap
    });
  } catch (error) {
    console.error('getPublicSiteData error:', error);
    return res.status(500).json({ message: 'Failed to retrieve site data.' });
  }
};

export const selectUseCase = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { use_case_id, session_token } = req.body;

    const business = await db.getBusinessById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    // Validate that the use_case_id strictly belongs to this businessId
    const useCase = await db.getUseCaseById(use_case_id, businessId);
    if (!useCase) {
      return res.status(400).json({ message: 'Invalid use case for this business.' });
    }

    // 1. Record / update visitor session
    await db.recordVisitorSession(businessId, session_token, use_case_id);

    // 2. Log quiz_answered event
    await db.recordEvent(businessId, session_token, 'quiz_answered', use_case_id);

    // 3. Get published variants for this use case
    const publishedVariants = await db.getPublishedVariantsByUseCase(businessId, use_case_id);
    
    // 4. Get baseline blocks to use as fallbacks for any missing/unpublished block
    const rawBlocks = await db.getContentBlocks(businessId);
    const resolvedContent = {};

    // Defaults
    rawBlocks.forEach(b => {
      resolvedContent[b.block_key] = b.default_value;
    });

    // Override with tailored published variants
    publishedVariants.forEach(v => {
      if (v.is_published !== false && v.generated_value) {
        resolvedContent[v.block_key] = v.generated_value;
      }
    });

    return res.status(200).json({
      message: 'Use case selected successfully',
      use_case_id,
      use_case_label: useCase.label,
      content: resolvedContent
    });
  } catch (error) {
    console.error('selectUseCase error:', error);
    return res.status(500).json({ message: 'Failed to process use case selection.' });
  }
};

export const logPublicEvent = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { session_token, event_type, use_case_id } = req.body;

    const business = await db.getBusinessById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found.' });
    }

    // If use_case_id is provided, verify it belongs to this business
    let validUseCaseId = null;
    if (use_case_id) {
      const uc = await db.getUseCaseById(use_case_id, businessId);
      if (uc) {
        validUseCaseId = uc.id;
      }
    }

    // Record event
    const event = await db.recordEvent(businessId, session_token, event_type, validUseCaseId);

    // Also update visitor session if applicable
    if (event_type === 'page_view') {
      await db.recordVisitorSession(businessId, session_token, validUseCaseId);
    }

    return res.status(200).json({
      message: 'Event logged successfully',
      event
    });
  } catch (error) {
    console.error('logPublicEvent error:', error);
    return res.status(500).json({ message: 'Failed to log event.' });
  }
};
