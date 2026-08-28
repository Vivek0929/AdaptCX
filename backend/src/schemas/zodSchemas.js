import { z } from 'zod';

export const signupSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  industry: z.enum([
    'saas_software',
    'ecommerce_retail',
    'professional_services',
    'education_coaching',
    'other'
  ]),
  product_description: z.string().min(10, 'Product description must be at least 10 characters'),
  brand_tone: z.string().min(5, 'Brand tone must be at least 5 characters')
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export const useCaseSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  pain_points: z.string().min(5, 'Pain points must be at least 5 characters'),
  sort_order: z.number().int().optional().default(0)
});

export const contentBlockSchema = z.object({
  default_value: z.string().min(1, 'Default value is required')
});

export const batchContentBlocksSchema = z.object({
  blocks: z.record(
    z.enum([
      'hero_headline',
      'hero_subheadline',
      'feature_1',
      'feature_2',
      'feature_3',
      'cta_text',
      'testimonial'
    ]),
    z.string().min(1)
  )
});

export const contentVariantUpdateSchema = z.object({
  generated_value: z.string().min(1).optional(),
  is_published: z.boolean().optional()
});

export const quizConfigSchema = z.object({
  question_text: z.string().min(5, 'Question text must be at least 5 characters')
});

export const selectUseCaseSchema = z.object({
  use_case_id: z.string().uuid('Invalid use case ID'),
  session_token: z.string().min(1, 'Session token is required')
});

export const publicEventSchema = z.object({
  session_token: z.string().min(1, 'Session token is required'),
  event_type: z.enum(['page_view', 'quiz_shown', 'quiz_answered', 'cta_click']),
  use_case_id: z.string().uuid().nullable().optional()
});

export const updateProfileSchema = z.object({
  business_name: z.string().min(2).optional(),
  industry: z.enum([
    'saas_software',
    'ecommerce_retail',
    'professional_services',
    'education_coaching',
    'other'
  ]).optional(),
  product_description: z.string().min(10).optional(),
  brand_tone: z.string().min(5).optional(),
  quiz_question: z.string().min(5).optional()
});
