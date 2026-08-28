import React, { useState, useEffect } from 'react';
import { contentBlocksApi } from '../api/client';
import { Layers, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input, TextArea } from '../components/common/Input';
import { Badge, LoadingSpinner } from '../components/common/Badge';

export const ContentBlocksPage = () => {
  const [blocks, setBlocks] = useState({
    hero_headline: '',
    hero_subheadline: '',
    feature_1: '',
    feature_2: '',
    feature_3: '',
    cta_text: '',
    testimonial: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchBlocks = async () => {
    try {
      const res = await contentBlocksApi.getAll();
      if (res.data && res.data.blockMap) {
        setBlocks({
          hero_headline: res.data.blockMap.hero_headline || '',
          hero_subheadline: res.data.blockMap.hero_subheadline || '',
          feature_1: res.data.blockMap.feature_1 || '',
          feature_2: res.data.blockMap.feature_2 || '',
          feature_3: res.data.blockMap.feature_3 || '',
          cta_text: res.data.blockMap.cta_text || '',
          testimonial: res.data.blockMap.testimonial || ''
        });
      }
    } catch (err) {
      console.error('Error loading content blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleChange = (key, value) => {
    setBlocks(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await contentBlocksApi.batchUpdate(blocks);
      setSuccessMsg('Baseline content blocks updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save content blocks.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading baseline copy blocks..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Baseline Content Copy</h1>
            <Badge variant="indigo" size="sm">
              Default Copy
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Default generic copy shown to first-time visitors before quiz completion. Gemini AI rewrites these 7 blocks for each persona.
          </p>
        </div>

        <Button onClick={handleSave} size="sm" isLoading={saving} icon={Save}>
          Save Baseline Copy
        </Button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Hero Section Copy</h2>
          </div>

          <div className="space-y-3.5">
            <Input
              label="Hero Headline"
              placeholder="e.g. Transform Your Operations with Intelligent Automation"
              value={blocks.hero_headline}
              onChange={(e) => handleChange('hero_headline', e.target.value)}
              helperText="The primary value proposition headline on your homepage."
              required
            />

            <TextArea
              label="Hero Subheadline"
              rows={3}
              placeholder="e.g. Accelerate workflows, eliminate manual errors, and scale your team without adding overhead."
              value={blocks.hero_subheadline}
              onChange={(e) => handleChange('hero_subheadline', e.target.value)}
              helperText="Supporting paragraph reinforcing the core message."
              required
            />

            <Input
              label="CTA Button Text"
              placeholder="e.g. Start Your Free Trial"
              value={blocks.cta_text}
              onChange={(e) => handleChange('cta_text', e.target.value)}
              helperText="The text on your primary call-to-action button."
              required
            />
          </div>
        </div>

        {/* Feature Bullets */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Feature Bullets (3 Blocks)</h2>
          </div>

          <div className="space-y-3.5">
            <Input
              label="Feature 1"
              placeholder="e.g. Seamless Workflow Integration"
              value={blocks.feature_1}
              onChange={(e) => handleChange('feature_1', e.target.value)}
              required
            />

            <Input
              label="Feature 2"
              placeholder="e.g. Real-Time Intelligence & Automated Reporting"
              value={blocks.feature_2}
              onChange={(e) => handleChange('feature_2', e.target.value)}
              required
            />

            <Input
              label="Feature 3"
              placeholder="e.g. Enterprise Security, SOC2 & Regulatory Compliance"
              value={blocks.feature_3}
              onChange={(e) => handleChange('feature_3', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Customer Testimonial Quote</h2>
          </div>

          <TextArea
            label="Default Customer Quote"
            rows={3}
            placeholder="e.g. “This platform cut our onboarding time in half and boosted our team efficiency instantly.” — Jordan Lee, Head of Growth"
            value={blocks.testimonial}
            onChange={(e) => handleChange('testimonial', e.target.value)}
            helperText="Gemini AI adapts this quote so it sounds authentic to each specific customer segment."
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" size="md" isLoading={saving} icon={Save}>
            Save Baseline Copy
          </Button>
        </div>
      </form>
    </div>
  );
};
