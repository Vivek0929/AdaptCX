import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, Save, CheckCircle2, AlertCircle, HelpCircle, Shield, Building } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input, TextArea } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';

export const SettingsPage = () => {
  const { business, updateBusinessProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    business_name: '',
    industry: 'saas_software',
    product_description: '',
    brand_tone: '',
    quiz_question: ''
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (business) {
      setProfileData({
        business_name: business.business_name || '',
        industry: business.industry || 'saas_software',
        product_description: business.product_description || '',
        brand_tone: business.brand_tone || '',
        quiz_question: business.quiz_question || 'What best describes your business?'
      });
    }
  }, [business]);

  const industryOptions = [
    { value: 'saas_software', label: 'SaaS & Software' },
    { value: 'ecommerce_retail', label: 'E-commerce & Retail' },
    { value: 'professional_services', label: 'Professional Services / Agencies' },
    { value: 'education_coaching', label: 'Education & Coaching' },
    { value: 'other', label: 'Other Industry' }
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateBusinessProfile(profileData);
      setSuccessMsg('Settings updated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Settings & Brand Voice</h1>
            <Badge variant="indigo" size="sm">
              Configuration
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure business context, tone rules, and visitor quiz settings.
          </p>
        </div>

        <Button onClick={handleSave} size="sm" isLoading={saving} icon={Save}>
          Save Settings
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

      <form onSubmit={handleSave} className="space-y-5">
        {/* Business Profile */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3.5">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Company Profile</h2>
          </div>

          <div className="space-y-3.5">
            <Input
              label="Business Name"
              value={profileData.business_name}
              onChange={(e) => setProfileData({ ...profileData, business_name: e.target.value })}
              required
            />

            <Select
              label="Primary Industry"
              options={industryOptions}
              value={profileData.industry}
              onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
            />

            <TextArea
              label="Product / Service Description"
              rows={3}
              value={profileData.product_description}
              onChange={(e) => setProfileData({ ...profileData, product_description: e.target.value })}
              helperText="Injected into AI prompts so generated variants remain factually accurate."
              required
            />

            <Input
              label="Brand Tone & Voice"
              value={profileData.brand_tone}
              onChange={(e) => setProfileData({ ...profileData, brand_tone: e.target.value })}
              helperText="e.g. Modern, authoritative, concise, results-driven"
              required
            />
          </div>
        </div>

        {/* Quiz Config */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3.5">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Visitor Quiz Question</h2>
          </div>

          <Input
            label="Quiz Question Text"
            value={profileData.quiz_question}
            onChange={(e) => setProfileData({ ...profileData, quiz_question: e.target.value })}
            helperText="The question shown in the quiz prompt on your website."
            required
          />
        </div>

        {/* Tenant ID info */}
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Multi-Tenant ID:</span>
            <code className="font-mono text-slate-800 font-semibold">{business?.id}</code>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="md" isLoading={saving} icon={Save}>
            Save All Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
