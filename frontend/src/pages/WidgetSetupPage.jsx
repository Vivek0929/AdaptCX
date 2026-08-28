import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Code
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const WidgetSetupPage = () => {
  const { business } = useAuth();
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedTag, setCopiedTag] = useState('');

  const getBackendUrl = () => {
    const raw = import.meta.env.VITE_API_BASE_URL;
    if (!raw || raw.startsWith('/')) {
      return typeof window !== 'undefined' && window.location.origin.includes('5173')
        ? 'http://localhost:5000'
        : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');
    }
    try {
      return new URL(raw).origin;
    } catch {
      return 'http://localhost:5000';
    }
  };

  const backendUrl = getBackendUrl();
  const scriptTag = `<script src="${backendUrl}/embed.js" data-business-id="${business?.id || 'YOUR_BUSINESS_ID'}" async></script>`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  const handleCopyAttr = (attr) => {
    navigator.clipboard.writeText(attr);
    setCopiedTag(attr);
    setTimeout(() => setCopiedTag(''), 2000);
  };

  const tags = [
    { key: 'hero_headline', tag: 'data-adaptcx="hero_headline"', desc: 'Place on your primary <h1> headline' },
    { key: 'hero_subheadline', tag: 'data-adaptcx="hero_subheadline"', desc: 'Place on your hero description paragraph' },
    { key: 'feature_1', tag: 'data-adaptcx="feature_1"', desc: 'Place on feature item 1' },
    { key: 'feature_2', tag: 'data-adaptcx="feature_2"', desc: 'Place on feature item 2' },
    { key: 'feature_3', tag: 'data-adaptcx="feature_3"', desc: 'Place on feature item 3' },
    { key: 'cta_text', tag: 'data-adaptcx="cta_text"', desc: 'Place on primary CTA button' },
    { key: 'testimonial', tag: 'data-adaptcx="testimonial"', desc: 'Place on testimonial blockquote' }
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Integration & Embed Script</h1>
            <Badge variant="indigo" size="sm">
              1-Line Embed
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Embed AdaptCX into Webflow, WordPress, Next.js, Framer, or standard HTML.
          </p>
        </div>

        {business?.id && (
          <a
            href={`/site/${business.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="sm" icon={ExternalLink}>
              View Hosted Demo
            </Button>
          </a>
        )}
      </div>

      {/* Step 1: Script */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
              1
            </span>
            <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Embed Script Tag
            </h2>
          </div>
          <Button
            size="sm"
            variant={copiedScript ? 'success' : 'primary'}
            onClick={handleCopyScript}
            icon={copiedScript ? Check : Copy}
          >
            {copiedScript ? 'Copied' : 'Copy Script'}
          </Button>
        </div>

        <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto">
          {scriptTag}
        </pre>
        <p className="text-xs text-slate-500">
          Place this snippet right before the closing <code className="text-slate-800 font-mono font-semibold">&lt;/body&gt;</code> tag on your website.
        </p>
      </div>

      {/* Step 2: HTML Attributes */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-slate-700 text-white font-bold text-[11px] flex items-center justify-center">
            2
          </span>
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Tag Target Website Elements
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Add the corresponding <code className="font-mono text-indigo-700 font-semibold">data-adaptcx</code> attribute to your existing elements:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {tags.map((t) => (
            <div
              key={t.key}
              className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-3"
            >
              <div>
                <code className="text-xs font-mono text-indigo-700 font-semibold">{t.tag}</code>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
              </div>
              <button
                onClick={() => handleCopyAttr(t.tag)}
                className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                title="Copy tag"
              >
                {copiedTag === t.tag ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Code Example */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-600" />
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            HTML Implementation Example
          </h2>
        </div>

        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`<!-- 1. Include Script -->
${scriptTag}

<!-- 2. Tagged Elements -->
<h1 data-adaptcx="hero_headline">Default Headline</h1>
<p data-adaptcx="hero_subheadline">Default Subheadline</p>
<button data-adaptcx="cta_text">Get Started</button>

<div data-adaptcx="feature_1">Default Feature 1</div>
<div data-adaptcx="feature_2">Default Feature 2</div>
<div data-adaptcx="feature_3">Default Feature 3</div>

<blockquote data-adaptcx="testimonial">Default Testimonial Quote</blockquote>`}
        </pre>
      </div>
    </div>
  );
};
