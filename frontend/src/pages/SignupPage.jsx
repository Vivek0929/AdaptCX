import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, TextArea } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    password: '',
    industry: 'saas_software',
    product_description: '',
    brand_tone: 'Professional, innovative, and results-driven'
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const industryOptions = [
    { value: 'saas_software', label: 'SaaS & Software' },
    { value: 'ecommerce_retail', label: 'E-commerce & Retail' },
    { value: 'professional_services', label: 'Professional Services / Agencies' },
    { value: 'education_coaching', label: 'Education & Coaching' },
    { value: 'other', label: 'Other Industry' }
  ];

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
      if (!formData.business_name || !formData.email || !formData.password) {
        setError('Please complete all account fields.');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      setStep(2);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    if (!formData.product_description || formData.product_description.length < 10) {
      setError('Please provide a descriptive explanation of what your business sells (at least 10 characters).');
      return;
    }
    if (!formData.brand_tone || formData.brand_tone.length < 5) {
      setError('Please specify your brand tone (e.g. Modern, authoritative, concise).');
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.message || 'Signup failed. Please try again.';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-7 rounded-xl space-y-5 shadow-lg">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
            Step {step} of 2 • {step === 1 ? 'Account Setup' : 'Business Context & Voice'}
          </span>
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Logo variant="ac" type="mark" size="xs" />
            </div>
            <div className="flex gap-1">
              <span className={`w-5 h-1 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-800'}`} />
              <span className={`w-5 h-1 rounded-full ${step === 2 ? 'bg-indigo-600' : 'bg-slate-800'}`} />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {step === 1 ? 'Create Business Workspace' : 'Company Context & Voice'}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {step === 1
            ? 'Set up your company profile to access the personalization engine'
            : 'Gemini AI uses this context to craft tone-accurate copy for your visitors'}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-3.5">
        {step === 1 ? (
          <>
            <Input
              label="Company Name"
              placeholder="e.g. Acme Enterprise Technologies"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              required
            />

            <Input
              label="Work Email"
              type="email"
              placeholder="alex@acme.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password (min 8 chars)"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button type="submit" className="w-full mt-2" size="md" icon={ArrowRight}>
              Continue to Product Details
            </Button>
          </>
        ) : (
          <>
            <Select
              label="Primary Industry"
              options={industryOptions}
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />

            <TextArea
              label="What does your product/service do?"
              rows={3}
              placeholder="e.g. We provide an automated HIPAA-compliant telehealth management system for clinics and hospitals."
              value={formData.product_description}
              onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
              helperText="Be specific about what you sell. Gemini AI will use this to keep generated copy grounded."
              required
            />

            <Input
              label="Brand Voice / Tone"
              placeholder="e.g. Professional, authoritative, concise, results-driven"
              value={formData.brand_tone}
              onChange={(e) => setFormData({ ...formData, brand_tone: e.target.value })}
              helperText="Guides the vocabulary and style of the AI copywriting."
              required
            />

            <div className="flex gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/3"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="w-2/3"
                isLoading={isLoading}
                icon={Sparkles}
              >
                Launch Workspace
              </Button>
            </div>
          </>
        )}
      </form>

      <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
        Already have a workspace?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
};
