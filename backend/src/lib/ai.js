import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Expected JSON response schema for content variants
export const generatedVariantSchema = z.object({
  hero_headline: z.string().min(1),
  hero_subheadline: z.string().min(1),
  feature_1: z.string().min(1),
  feature_2: z.string().min(1),
  feature_3: z.string().min(1),
  cta_text: z.string().min(1),
  testimonial: z.string().min(1)
});

// Helper to sanitize and extract JSON from model responses
const extractJSON = (text) => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  
  const firstBrace = clean.indexOf('{');
  const lastBrace = clean.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    clean = clean.substring(firstBrace, lastBrace + 1);
  }
  
  return JSON.parse(clean);
};

// Timeout wrapper helper
const withTimeout = (promise, ms = 15000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms))
  ]);
};

// Fallback intelligent copy generator if keys are absent/exhausted
const generateSmartFallbackCopy = (useCase, baselineBlocks, business) => {
  const label = useCase.label;
  const pain = useCase.pain_points;

  return {
    hero_headline: baselineBlocks.hero_headline
      ? `${baselineBlocks.hero_headline.replace(/\.$/, '')} — Built for ${label}`
      : `The Solution Engineered for ${label}`,
    hero_subheadline: baselineBlocks.hero_subheadline
      ? `Tailored to tackle ${pain.toLowerCase()}. ${baselineBlocks.hero_subheadline}`
      : `Overcome ${pain.toLowerCase()} with precision tools crafted specifically for ${label.toLowerCase()} teams.`,
    feature_1: baselineBlocks.feature_1
      ? `${baselineBlocks.feature_1} (Optimized for ${label})`
      : `Tailored workflows designed to directly solve ${pain.toLowerCase()}`,
    feature_2: baselineBlocks.feature_2
      ? `${baselineBlocks.feature_2} with automated ${label} compliance`
      : `Real-time intelligence and automated reporting for ${label} operations`,
    feature_3: baselineBlocks.feature_3
      ? `${baselineBlocks.feature_3} built for scale in ${label}`
      : `Enterprise security & frictionless onboarding dedicated to ${label} leaders`,
    cta_text: baselineBlocks.cta_text
      ? `${baselineBlocks.cta_text} for ${label}`
      : `Accelerate Your ${label} Growth`,
    testimonial: `“We were struggling with ${pain.toLowerCase()} until we implemented this. It immediately felt like it was built from the ground up for our ${label.toLowerCase()} needs.” — Sarah Jenkins, VP at ${label} Innovations`
  };
};

/**
 * Primary generator: Google Gemini API (gemini-3.1-flash-lite / gemini-3.6-flash)
 * Secondary fallback: OpenAI API (gpt-4o-mini / gpt-4o)
 * Tertiary fallback: Smart contextual copy generator
 */
export const generateVariantsWithAI = async ({ business, useCase, baselineBlocks }) => {
  const { getSystemPrompt, getUserPrompt } = await import('../prompts/generateVariants.prompt.js');
  const systemPrompt = getSystemPrompt(business);
  const userPrompt = getUserPrompt({ useCase, baselineBlocks });

  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. TRY GOOGLE GEMINI (PRIMARY)
  if (geminiKey && geminiKey !== 'replace_with_gemini_api_key' && !geminiKey.includes('placeholder')) {
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.5-flash'];
    const genAI = new GoogleGenerativeAI(geminiKey);

    for (const modelName of candidateModels) {
      try {
        console.log(`[AI Engine] [Primary] Calling Google Gemini ("${modelName}") for "${useCase.label}"...`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json'
          }
        });

        const combinedPrompt = `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}`;
        const result = await withTimeout(model.generateContent(combinedPrompt), 15000);
        const text = result.response.text();
        const parsed = extractJSON(text);
        const validated = generatedVariantSchema.parse(parsed);
        console.log(`[AI Engine] 🎉 Google Gemini ("${modelName}") successfully generated variants for "${useCase.label}"!`);
        return validated;
      } catch (err) {
        console.warn(`[AI Engine] Google Gemini model "${modelName}" failed/timeout (${err.message}). Trying next candidate...`);
      }
    }
  }

  // 2. TRY OPENAI (SECONDARY FALLBACK)
  if (openaiKey && openaiKey !== 'replace_with_openai_api_key' && !openaiKey.includes('placeholder')) {
    const openaiModels = ['gpt-4o-mini', 'gpt-4o'];
    const openai = new OpenAI({ apiKey: openaiKey });

    for (const modelName of openaiModels) {
      try {
        console.log(`[AI Engine] [Secondary] Calling OpenAI ("${modelName}") for "${useCase.label}"...`);
        const response = await withTimeout(
          openai.chat.completions.create({
            model: modelName,
            response_format: { type: 'json_object' },
            temperature: 0.7,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ]
          }),
          15000
        );

        const responseText = response.choices?.[0]?.message?.content || '';
        const parsed = extractJSON(responseText);
        const validated = generatedVariantSchema.parse(parsed);
        console.log(`[AI Engine] 🎉 OpenAI ("${modelName}") successfully generated variants for "${useCase.label}"!`);
        return validated;
      } catch (err) {
        console.warn(`[AI Engine] OpenAI model "${modelName}" failed/quota reached (${err.message}). Trying next...`);
      }
    }
  }

  // 3. TERTIARY FALLBACK: CONTEXTUAL SMART GENERATOR
  console.log(`[AI Engine] Using contextual smart copy generator for "${useCase.label}".`);
  const smartCopy = generateSmartFallbackCopy(useCase, baselineBlocks, business);
  return generatedVariantSchema.parse(smartCopy);
};
