import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Copy,
  Check,
  ExternalLink,
  Terminal,
  Code,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const WidgetSetupPage = () => {
  const { business } = useAuth();
  const [activeTab, setActiveTab] = useState('nextjs');
  const [copiedCode, setCopiedCode] = useState(false);
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
  const businessId = business?.id || 'YOUR_BUSINESS_ID';

  const snippets = {
    nextjs: `// Next.js App Router (app/layout.tsx or app/layout.jsx)
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* AdaptCX AI Personalization Widget */}
        <Script
          src="${backendUrl}/embed.js"
          data-business-id="${businessId}"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}`,
    react: `// React (Vite / Create React App)
// 1. Add this script tag inside your index.html right before </body>:

<script 
  src="${backendUrl}/embed.js" 
  data-business-id="${businessId}" 
  async
></script>

// 2. In any React Component (JSX/TSX), add data-adaptcx attributes:
export const Hero = () => {
  return (
    <section>
      <h1 data-adaptcx="hero_headline">Default Headline</h1>
      <p data-adaptcx="hero_subheadline">Default Subheadline</p>
      <button data-adaptcx="cta_text">Get Started</button>
    </section>
  );
};`,
    html: `<!-- Standard HTML / Webflow / WordPress / Shopify / Framer -->
<!-- Place before closing </body> tag -->
<script 
  src="${backendUrl}/embed.js" 
  data-business-id="${businessId}" 
  async
></script>`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleCopyAttr = (attr) => {
    navigator.clipboard.writeText(attr);
    setCopiedTag(attr);
    setTimeout(() => setCopiedTag(''), 2000);
  };

  const tags = [
    { key: 'hero_headline', tag: 'data-adaptcx="hero_headline"', desc: 'Place on your primary <h1> headline in JSX' },
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Integration & Embed Code</h1>
            <Badge variant="indigo" size="sm">
              React & Next.js Ready
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Embed AdaptCX into Next.js (App & Pages router), React + Vite, Webflow, or Shopify.
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

      {/* Framework Tabs */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">Step 1</span>
            <h2 className="text-sm font-bold text-slate-900">Choose Your Framework</h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              onClick={() => setActiveTab('nextjs')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'nextjs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Next.js (App Router)
            </button>
            <button
              onClick={() => setActiveTab('react')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'react' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              React / Vite
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'html' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HTML / Webflow / CMS
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 font-mono">
              {activeTab === 'nextjs' ? 'app/layout.tsx' : activeTab === 'react' ? 'index.html / Component.jsx' : 'index.html'}
            </span>
            <Button
              size="sm"
              variant={copiedCode ? 'success' : 'primary'}
              onClick={handleCopyCode}
              icon={copiedCode ? Check : Copy}
            >
              {copiedCode ? 'Copied Snippet' : 'Copy Code'}
            </Button>
          </div>

          <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            {snippets[activeTab]}
          </pre>
        </div>
      </div>

      {/* Step 2: JSX / HTML Attributes */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-slate-700 text-white font-bold text-[11px] flex items-center justify-center">
            2
          </span>
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Tag Your JSX / HTML Elements
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          In your React / Next.js components, add the corresponding <code className="font-mono text-indigo-700 font-semibold">data-adaptcx</code> attribute to your elements:
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

      {/* Step 3: Full Next.js / React Component Example */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-600" />
          <h2 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            React / Next.js Component Example
          </h2>
        </div>

        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`// components/HeroSection.jsx (or .tsx)
export const HeroSection = () => {
  return (
    <main className="hero-container">
      {/* 1. Target Headline */}
      <h1 data-adaptcx="hero_headline">Default Headline</h1>

      {/* 2. Target Subheadline */}
      <p data-adaptcx="hero_subheadline">Default Subheadline Description</p>

      {/* 3. Target CTA Button */}
      <button data-adaptcx="cta_text">Get Started</button>

      {/* 4. Target Features */}
      <div data-adaptcx="feature_1">Default Feature 1</div>
      <div data-adaptcx="feature_2">Default Feature 2</div>
      <div data-adaptcx="feature_3">Default Feature 3</div>

      {/* 5. Target Testimonial */}
      <blockquote data-adaptcx="testimonial">Default Testimonial Quote</blockquote>
    </main>
  );
};`}
        </pre>
      </div>
    </div>
  );
};
