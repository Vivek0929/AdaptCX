const BASE_URL = 'http://localhost:5000/api';

const req = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers, signal: AbortSignal.timeout(60000) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return { status: res.status, data };
};

const runTests = async () => {
  console.log('🧪 Starting AdaptCX End-to-End Test Suite...\n');

  try {
    // 1. Health check
    console.log('1. Testing Health Endpoint...');
    const health = await req('/health');
    console.log('   ✅ Health Check:', health.data.status);

    // 2. Signup
    console.log('\n2. Testing Business Signup & Onboarding...');
    const testEmail = `founder_${Date.now()}@nexustech.io`;
    const signupRes = await req('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        business_name: 'Nexus Automation AI',
        email: testEmail,
        password: 'password12345',
        industry: 'saas_software',
        product_description: 'We build enterprise workflow automation and intelligent document processing systems for high-growth operations.',
        brand_tone: 'Authoritative, innovative, high-energy, concise'
      })
    });
    const token = signupRes.data.token;
    const businessId = signupRes.data.business.id;
    console.log(`   ✅ Signed up successfully! Tenant ID: ${businessId}`);

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 3. Verify Me
    console.log('\n3. Testing Auth Me Endpoint...');
    const meRes = await req('/auth/me', { headers: authHeaders });
    console.log(`   ✅ Authenticated as: ${meRes.data.business.business_name}`);

    // 4. Create Use Cases
    console.log('\n4. Creating Target Use Cases...');
    const uc1 = await req('/use-cases', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        label: 'Fintech & Banking Teams',
        pain_points: 'Audit compliance, legacy database latency, strict fraud prevention',
        sort_order: 1
      })
    });
    const uc2 = await req('/use-cases', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        label: 'Healthcare & Telehealth',
        pain_points: 'HIPAA compliance, EHR data silos, physician workflow fatigue',
        sort_order: 2
      })
    });
    console.log(`   ✅ Created Use Cases: "${uc1.data.useCase.label}", "${uc2.data.useCase.label}"`);

    // 5. Update Baseline Blocks
    console.log('\n5. Updating Baseline Content Blocks...');
    await req('/content-blocks/batch', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        blocks: {
          hero_headline: 'Automate Enterprise Workflows with Precision AI',
          hero_subheadline: 'Eliminate manual bottlenecks and deploy intelligent automations in minutes.',
          feature_1: 'Zero-code workflow orchestration',
          feature_2: 'Real-time auditing and anomaly detection',
          feature_3: 'SOC2 Type II & enterprise security',
          cta_text: 'Start Free 14-Day Trial',
          testimonial: '“Nexus transformed our document throughput by 300% within the first month.” — Dev Patel, VP Engineering'
        }
      })
    });
    console.log('   ✅ Baseline blocks updated.');

    // 6. Generate AI Variants
    console.log('\n6. Generating AI Content Variants for all Use Cases...');
    const genRes = await req('/content-variants/generate', {
      method: 'POST',
      headers: authHeaders
    });
    console.log(`   ✅ ${genRes.data.message}`);

    // 7. Get Grouped Variants
    console.log('\n7. Retrieving Grouped Content Variants...');
    const variantsRes = await req('/content-variants', { headers: authHeaders });
    console.log(`   ✅ Retrieved ${variantsRes.data.variants.length} total variants across ${variantsRes.data.grouped.length} use cases.`);
    const sampleUC = variantsRes.data.grouped[0];
    console.log(`   📝 Sample Tailored Headline (${sampleUC.use_case.label}):`);
    console.log(`      "${sampleUC.blocks.hero_headline?.generated_value}"`);

    // 8. Test Public Site Endpoints
    console.log('\n8. Testing Public Site Endpoint (Visitor View)...');
    const publicSite = await req(`/public/${businessId}/site`);
    console.log(`   ✅ Public site loaded: Quiz Question: "${publicSite.data.quiz_question}"`);
    console.log(`      Available options: ${publicSite.data.use_cases.map(u => u.label).join(', ')}`);

    // 9. Visitor selects Use Case
    console.log('\n9. Testing Visitor Quiz Answer / Use Case Selection...');
    const visitorSessionToken = 'test-visitor-sess-uuid-' + Date.now();
    const selectRes = await req(`/public/${businessId}/select-use-case`, {
      method: 'POST',
      body: JSON.stringify({
        use_case_id: uc1.data.useCase.id,
        session_token: visitorSessionToken
      })
    });
    console.log(`   ✅ Visitor answered quiz for "${selectRes.data.use_case_label}". Received tailored copy:`);
    console.log(`      Hero: "${selectRes.data.content.hero_headline}"`);
    console.log(`      CTA: "${selectRes.data.content.cta_text}"`);

    // 10. Visitor clicks CTA
    console.log('\n10. Testing Visitor CTA Click Event...');
    await req(`/public/${businessId}/event`, {
      method: 'POST',
      body: JSON.stringify({
        session_token: visitorSessionToken,
        event_type: 'cta_click',
        use_case_id: uc1.data.useCase.id
      })
    });
    console.log('   ✅ CTA Click event logged.');

    // 11. Insights Dashboard Verification
    console.log('\n11. Querying Dashboard Insights...');
    const insightsRes = await req('/insights/dashboard', { headers: authHeaders });
    console.log('   📊 Dashboard Summary:');
    console.log(`      Total Visits: ${insightsRes.data.summary.total_page_views}`);
    console.log(`      Quiz Answers: ${insightsRes.data.summary.total_quiz_answered}`);
    console.log(`      CTA Clicks: ${insightsRes.data.summary.total_cta_clicks}`);
    console.log(`      Quiz Completion Rate: ${insightsRes.data.summary.quiz_completion_rate}%`);
    console.log(`      Overall Conversion Rate: ${insightsRes.data.summary.overall_conversion_rate}%`);
    console.log(`      Per-Use-Case Stats:`, insightsRes.data.use_cases);

    console.log('\n🎉 ALL END-TO-END TESTS PASSED FLOCKINGLY! 🚀');
  } catch (err) {
    console.error('\n❌ Test failed with error:', err.data || err.message);
    if (err.cause) console.error('   Cause:', err.cause);
    if (err.stack) console.error('   Stack:', err.stack);
    process.exit(1);
  }
};

runTests();
