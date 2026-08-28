-- AdaptCX Database Schema for PostgreSQL / Supabase

-- 1. Businesses (tenants)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  industry TEXT NOT NULL,
  product_description TEXT NOT NULL,
  brand_tone TEXT NOT NULL,
  quiz_question TEXT NOT NULL DEFAULT 'What best describes your business?',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Target use cases (visitor business types) per business
CREATE TABLE IF NOT EXISTS use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  pain_points TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Baseline content blocks per business
CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  block_key TEXT NOT NULL CHECK (block_key IN ('hero_headline','hero_subheadline','feature_1','feature_2','feature_3','cta_text','testimonial')),
  default_value TEXT NOT NULL,
  UNIQUE(business_id, block_key)
);

-- 4. AI-generated tailored variants, one row per (use_case, block_key)
CREATE TABLE IF NOT EXISTS content_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  use_case_id UUID NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
  block_key TEXT NOT NULL CHECK (block_key IN ('hero_headline','hero_subheadline','feature_1','feature_2','feature_3','cta_text','testimonial')),
  generated_value TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(use_case_id, block_key)
);

-- 5. Visitor sessions (tracks which use case a visitor selected)
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  use_case_id UUID REFERENCES use_cases(id) ON DELETE SET NULL,
  session_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Analytics events (views, CTA clicks) tied to a visitor session
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  use_case_id UUID REFERENCES use_cases(id) ON DELETE SET NULL,
  session_token TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view','quiz_shown','quiz_answered','cta_click')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance & query isolation
CREATE INDEX IF NOT EXISTS idx_use_cases_business ON use_cases(business_id);
CREATE INDEX IF NOT EXISTS idx_content_blocks_business ON content_blocks(business_id);
CREATE INDEX IF NOT EXISTS idx_content_variants_business ON content_variants(business_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_business ON visitor_sessions(business_id);
CREATE INDEX IF NOT EXISTS idx_events_business ON events(business_id);
CREATE INDEX IF NOT EXISTS idx_events_use_case ON events(use_case_id);

-- Row Level Security (RLS)
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
