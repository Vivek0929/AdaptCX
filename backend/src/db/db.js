import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOCAL_DB_PATH = path.join(__dirname, 'local_storage.json');

// Local storage helper for resilient persistence
const getLocalData = () => {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initial = {
        businesses: [],
        use_cases: [],
        content_blocks: [],
        content_variants: [],
        visitor_sessions: [],
        events: []
      };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db file:', err);
    return {
      businesses: [],
      use_cases: [],
      content_blocks: [],
      content_variants: [],
      visitor_sessions: [],
      events: []
    };
  }
};

const saveLocalData = (data) => {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing local db file:', err);
  }
};

export const db = {
  // BUSINESSES
  async createBusiness(businessData) {
    const newBusiness = {
      id: uuidv4(),
      business_name: businessData.business_name,
      email: businessData.email.toLowerCase(),
      password_hash: businessData.password_hash,
      industry: businessData.industry,
      product_description: businessData.product_description,
      brand_tone: businessData.brand_tone,
      quiz_question: businessData.quiz_question || 'What best describes your business?',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('businesses').insert([newBusiness]).select().single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    data.businesses.push(newBusiness);
    saveLocalData(data);
    return newBusiness;
  },

  async getBusinessByEmail(email) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('businesses').select('*').eq('email', email.toLowerCase()).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }

    const data = getLocalData();
    return data.businesses.find(b => b.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getBusinessById(id) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('businesses').select('*').eq('id', id).single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }

    const data = getLocalData();
    return data.businesses.find(b => b.id === id) || null;
  },

  async updateBusiness(id, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('businesses').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    const index = data.businesses.findIndex(b => b.id === id);
    if (index === -1) return null;
    data.businesses[index] = { ...data.businesses[index], ...updates };
    saveLocalData(data);
    return data.businesses[index];
  },

  // USE CASES
  async getUseCases(businessId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('use_cases')
        .select('*')
        .eq('business_id', businessId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    }

    const data = getLocalData();
    return data.use_cases
      .filter(uc => uc.business_id === businessId)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  },

  async getUseCaseById(id, businessId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('use_cases')
        .select('*')
        .eq('id', id)
        .eq('business_id', businessId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }

    const data = getLocalData();
    return data.use_cases.find(uc => uc.id === id && uc.business_id === businessId) || null;
  },

  async createUseCase(businessId, { label, pain_points, sort_order = 0 }) {
    const newUseCase = {
      id: uuidv4(),
      business_id: businessId,
      label,
      pain_points,
      sort_order: Number(sort_order) || 0,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('use_cases').insert([newUseCase]).select().single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    data.use_cases.push(newUseCase);
    saveLocalData(data);
    return newUseCase;
  },

  async updateUseCase(id, businessId, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('use_cases')
        .update(updates)
        .eq('id', id)
        .eq('business_id', businessId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    const index = data.use_cases.findIndex(uc => uc.id === id && uc.business_id === businessId);
    if (index === -1) return null;
    data.use_cases[index] = { ...data.use_cases[index], ...updates };
    saveLocalData(data);
    return data.use_cases[index];
  },

  async deleteUseCase(id, businessId) {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('use_cases')
        .delete()
        .eq('id', id)
        .eq('business_id', businessId);
      if (error) throw error;
      return true;
    }

    const data = getLocalData();
    data.use_cases = data.use_cases.filter(uc => !(uc.id === id && uc.business_id === businessId));
    data.content_variants = data.content_variants.filter(cv => cv.use_case_id !== id);
    saveLocalData(data);
    return true;
  },

  // CONTENT BLOCKS
  async getContentBlocks(businessId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('business_id', businessId);
      if (error) throw error;
      return data || [];
    }

    const data = getLocalData();
    return data.content_blocks.filter(cb => cb.business_id === businessId);
  },

  async upsertContentBlock(businessId, blockKey, defaultValue) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('content_blocks')
        .upsert(
          {
            business_id: businessId,
            block_key: blockKey,
            default_value: defaultValue
          },
          { onConflict: 'business_id,block_key' }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    const index = data.content_blocks.findIndex(
      cb => cb.business_id === businessId && cb.block_key === blockKey
    );

    if (index >= 0) {
      data.content_blocks[index].default_value = defaultValue;
      saveLocalData(data);
      return data.content_blocks[index];
    } else {
      const newBlock = {
        id: uuidv4(),
        business_id: businessId,
        block_key: blockKey,
        default_value: defaultValue
      };
      data.content_blocks.push(newBlock);
      saveLocalData(data);
      return newBlock;
    }
  },

  // CONTENT VARIANTS
  async getContentVariants(businessId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('content_variants')
        .select('*, use_cases(id, label)')
        .eq('business_id', businessId);
      if (error) throw error;
      return data || [];
    }

    const data = getLocalData();
    return data.content_variants
      .filter(cv => cv.business_id === businessId)
      .map(cv => {
        const uc = data.use_cases.find(u => u.id === cv.use_case_id);
        return {
          ...cv,
          use_cases: uc ? { id: uc.id, label: uc.label } : null
        };
      });
  },

  async getPublishedVariantsByUseCase(businessId, useCaseId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('content_variants')
        .select('*')
        .eq('business_id', businessId)
        .eq('use_case_id', useCaseId)
        .eq('is_published', true);
      if (error) throw error;
      return data || [];
    }

    const data = getLocalData();
    return data.content_variants.filter(
      cv => cv.business_id === businessId && cv.use_case_id === useCaseId && cv.is_published !== false
    );
  },

  async upsertContentVariant(businessId, useCaseId, blockKey, generatedValue, isPublished = true) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('content_variants')
        .upsert(
          {
            business_id: businessId,
            use_case_id: useCaseId,
            block_key: blockKey,
            generated_value: generatedValue,
            is_published: isPublished,
            created_at: new Date().toISOString()
          },
          { onConflict: 'use_case_id,block_key' }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    const index = data.content_variants.findIndex(
      cv => cv.use_case_id === useCaseId && cv.block_key === blockKey
    );

    if (index >= 0) {
      data.content_variants[index].generated_value = generatedValue;
      data.content_variants[index].is_published = isPublished;
      saveLocalData(data);
      return data.content_variants[index];
    } else {
      const newVariant = {
        id: uuidv4(),
        business_id: businessId,
        use_case_id: useCaseId,
        block_key: blockKey,
        generated_value: generatedValue,
        is_published: isPublished,
        created_at: new Date().toISOString()
      };
      data.content_variants.push(newVariant);
      saveLocalData(data);
      return newVariant;
    }
  },

  async updateContentVariant(id, businessId, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('content_variants')
        .update(updates)
        .eq('id', id)
        .eq('business_id', businessId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    const index = data.content_variants.findIndex(cv => cv.id === id && cv.business_id === businessId);
    if (index === -1) return null;
    data.content_variants[index] = { ...data.content_variants[index], ...updates };
    saveLocalData(data);
    return data.content_variants[index];
  },

  // VISITOR SESSIONS
  async recordVisitorSession(businessId, sessionToken, useCaseId = null) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('visitor_sessions')
        .upsert(
          {
            business_id: businessId,
            session_token: sessionToken,
            selected_use_case_id: useCaseId,
            created_at: new Date().toISOString()
          },
          { onConflict: 'business_id,session_token' }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    const index = data.visitor_sessions.findIndex(
      vs => vs.session_token === sessionToken && vs.business_id === businessId
    );

    if (index >= 0) {
      if (useCaseId) data.visitor_sessions[index].use_case_id = useCaseId;
      saveLocalData(data);
      return data.visitor_sessions[index];
    } else {
      const newSession = {
        id: uuidv4(),
        business_id: businessId,
        use_case_id: useCaseId,
        session_token: sessionToken,
        created_at: new Date().toISOString()
      };
      data.visitor_sessions.push(newSession);
      saveLocalData(data);
      return newSession;
    }
  },

  // EVENTS
  async recordEvent(businessId, sessionToken, eventType, useCaseId = null) {
    const newEvent = {
      id: uuidv4(),
      business_id: businessId,
      use_case_id: useCaseId,
      session_token: sessionToken,
      event_type: eventType,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('events').insert([newEvent]).select().single();
      if (error) throw error;
      return data;
    }

    const data = getLocalData();
    data.events.push(newEvent);
    saveLocalData(data);
    return newEvent;
  },

  // INSIGHTS AGGREGATION
  async getInsights(businessId) {
    let useCases = await this.getUseCases(businessId);
    let events = [];

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('business_id', businessId);
      if (error) throw error;
      events = data || [];
    } else {
      const data = getLocalData();
      events = data.events.filter(e => e.business_id === businessId);
    }

    const totalPageViews = events.filter(e => e.event_type === 'page_view').length;
    const totalQuizShown = events.filter(e => e.event_type === 'quiz_shown').length;
    const totalQuizAnswered = events.filter(e => e.event_type === 'quiz_answered').length;
    const totalCtaClicks = events.filter(e => e.event_type === 'cta_click').length;

    const quizCompletionRate = totalPageViews > 0 
      ? Number(((totalQuizAnswered / Math.max(totalPageViews, 1)) * 100).toFixed(1))
      : 0;

    const overallCtaRate = totalPageViews > 0
      ? Number(((totalCtaClicks / Math.max(totalPageViews, 1)) * 100).toFixed(1))
      : 0;

    const useCaseMetrics = useCases.map(uc => {
      const ucEvents = events.filter(e => e.use_case_id === uc.id);
      const answers = ucEvents.filter(e => e.event_type === 'quiz_answered').length;
      const ctaClicks = ucEvents.filter(e => e.event_type === 'cta_click').length;
      const ctaRate = answers > 0 ? Number(((ctaClicks / answers) * 100).toFixed(1)) : 0;

      return {
        use_case_id: uc.id,
        label: uc.label,
        quiz_answered: answers,
        cta_clicks: ctaClicks,
        conversion_rate: ctaRate
      };
    });

    return {
      summary: {
        total_page_views: totalPageViews,
        total_quiz_shown: totalQuizShown,
        total_quiz_answered: totalQuizAnswered,
        total_cta_clicks: totalCtaClicks,
        quiz_completion_rate: quizCompletionRate,
        overall_conversion_rate: overallCtaRate
      },
      use_cases: useCaseMetrics,
      recent_events: events.slice(-10).reverse()
    };
  }
};
