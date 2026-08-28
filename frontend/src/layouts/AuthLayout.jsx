import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';
import { Logo } from '../components/common/Logo';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row">
      {/* Left Column: Clean Enterprise Product Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-white border-r border-slate-200 p-12 flex-col justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <Logo variant="ac" type="horizontal" size="md" showTagline={true} />
          </Link>

          <div className="mt-20 space-y-6 max-w-lg">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              Website personalization engineered for conversion performance.
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Define your audience segments once. Gemini AI crafts targeted copy variants. Match your visitor's industry instantly on their first visit.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Multi-tenant data isolation & secure server-side LLM processing',
                'Gemini AI content variants tailored to specific customer pain points',
                'Zero-latency client-side DOM replacement & persistent session memory',
                'Embedded script integration compatible with any website or CMS'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mt-0.5 shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span>Enterprise-grade architecture • Multi-tenant isolation</span>
        </div>
      </div>

      {/* Right Column: Form Viewport */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
