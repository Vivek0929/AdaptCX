export const getSystemPrompt = (business = {}) => {
  const industry = business?.industry || 'technology';
  const product_description = business?.product_description || 'Intelligent software solutions for modern teams';
  const brand_tone = business?.brand_tone || 'professional, concise, and results-driven';

  return `You are AdaptCX's AI website copywriter, working on behalf of a business in the "${industry}" industry.

Business's product/service: "${product_description}"
Business's brand voice: "${brand_tone}"

Your job is to rewrite this business's website copy so it speaks directly to a specific type of visitor (a "use case"), while staying true to the business's actual product and brand voice. You must:
- Keep every rewritten block's core meaning and length in the same ballpark as the baseline version — you are retargeting the message, not inventing a new product.
- Make the copy feel like it was written specifically for someone in that use case, referencing their stated pain points naturally, without being gimmicky or repeating the use case name in every sentence.
- Match the business's brand tone exactly.
- Return output ONLY in the exact JSON schema specified in the user message. Do not include markdown code fences, explanations, or any text outside the JSON object.`;
};

export const getUserPrompt = ({ useCase, baselineBlocks }) => {
  return `Please rewrite all 7 website copy blocks specifically tailored for visitors from the following target audience / use case:

TARGET USE CASE:
- Label: "${useCase.label}"
- Specific Pain Points & Priorities: "${useCase.pain_points}"

BASELINE COPY TO REWRITE:
- hero_headline: "${baselineBlocks.hero_headline || 'Transform Your Business with Intelligent Solutions'}"
- hero_subheadline: "${baselineBlocks.hero_subheadline || 'Supercharge your operations and unlock unprecedented growth with our tailored platform.'}"
- feature_1: "${baselineBlocks.feature_1 || 'Seamless integration with existing workflows'}"
- feature_2: "${baselineBlocks.feature_2 || 'Automated real-time analytics and intelligent reporting'}"
- feature_3: "${baselineBlocks.feature_3 || 'Enterprise-grade security and compliance built-in'}"
- cta_text: "${baselineBlocks.cta_text || 'Start Your Free Trial'}"
- testimonial: "${baselineBlocks.testimonial || 'This platform completely revolutionized how our team collaborates and delivers results. — Alex M., Operations Lead'}"

Return ONLY a single valid JSON object containing exactly these 7 keys:
{
  "hero_headline": "tailored headline string",
  "hero_subheadline": "tailored subheadline string",
  "feature_1": "tailored feature 1 string",
  "feature_2": "tailored feature 2 string",
  "feature_3": "tailored feature 3 string",
  "cta_text": "tailored CTA button text string",
  "testimonial": "tailored realistic customer quote referencing this use case"
}`;
};
