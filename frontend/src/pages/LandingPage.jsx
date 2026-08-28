import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Check,
  BarChart2,
  Code,
  Users,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Logo } from '../components/common/Logo';

export const LandingPage = () => {
  const [activeDemoTab, setActiveDemoTab] = useState('fintech');

  const demoVariants = {
    generic: {
      headline: 'The Intelligent Operations Platform for Growing Teams',
      subheadline: 'Streamline collaboration, automate recurring tasks, and scale organizational productivity with unified tools.',
      cta: 'Start Free Trial',
      tag: 'Baseline Version'
    },
    fintech: {
      headline: 'Regulatory-Compliant Core Infrastructure for High-Velocity Fintechs',
      subheadline: 'Automate strict AML/KYC workflows, prevent transaction fraud in real time, and scale ledger operations securely.',
      cta: 'Explore Fintech Sandbox',
      tag: 'Tailored for Fintech'
    },
    healthcare: {
      headline: 'HIPAA-Compliant Patient Workflow Automation for Modern Clinics',
      subheadline: 'Eliminate clinical data entry overhead, safeguard sensitive EHR records, and improve patient retention seamlessly.',
      cta: 'Schedule Healthcare Demo',
      tag: 'Tailored for Healthcare'
    },
    ecommerce: {
      headline: 'High-Converting Checkout & Inventory Synchronization Engine',
      subheadline: 'Prevent shopping cart abandonment, synchronize multi-channel inventory, and maximize repeat customer lifetime value.',
      cta: 'Optimize E-Commerce Store',
      tag: 'Tailored for E-Commerce'
    }
  };

  const currentCopy = demoVariants[activeDemoTab];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Logo variant="ac" type="horizontal" size="md" showTagline={true} />
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm" icon={ArrowRight}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Website Personalization Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.15]">
          Deliver website copy tailored to every visitor’s specific use case.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Eliminate generic B2B landing pages. AdaptCX asks visitors one short question, then instantly renders AI-tailored headlines, features, and CTAs designed for their industry.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto" icon={ArrowRight}>
              Start Free Trial
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              View Demo Dashboard
            </Button>
          </Link>
        </div>

        {/* Value Points */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Multi-Tenant Architecture</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Gemini & OpenAI Content Engine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>1-Line Embed Script</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Persistent Visitor Memory</span>
          </div>
        </div>
      </section>

      {/* Interactive Personalization Sandbox */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Sandbox Top Control Bar */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="text-xs font-semibold text-slate-600 ml-2">Live Personalization Simulator</span>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
              <button
                onClick={() => setActiveDemoTab('generic')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeDemoTab === 'generic' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Baseline Copy
              </button>
              <button
                onClick={() => setActiveDemoTab('fintech')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeDemoTab === 'fintech' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fintech
              </button>
              <button
                onClick={() => setActiveDemoTab('healthcare')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeDemoTab === 'healthcare' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Healthcare
              </button>
              <button
                onClick={() => setActiveDemoTab('ecommerce')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeDemoTab === 'ecommerce' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                E-Commerce
              </button>
            </div>
          </div>

          {/* Rendered Preview Page */}
          <div className="p-8 sm:p-14 text-center space-y-6 bg-gradient-to-b from-white to-slate-50">
            <div className="inline-block">
              <Badge variant={activeDemoTab === 'generic' ? 'slate' : 'indigo'} size="sm">
                {currentCopy.tag}
              </Badge>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 max-w-2xl mx-auto leading-tight">
              {currentCopy.headline}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {currentCopy.subheadline}
            </p>

            <div className="pt-2">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-xs cursor-pointer">
                {currentCopy.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Architecture & Workflow</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How AdaptCX Works</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Four streamlined steps to deliver personalized B2B web experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: '01',
                title: 'Define Personas',
                desc: 'Specify your target visitor types (e.g. Healthcare, Fintech) and their primary pain points.',
                icon: Users
              },
              {
                step: '02',
                title: 'AI Copy Generation',
                desc: 'Gemini AI writes a tailored set of 7 homepage blocks for each defined audience.',
                icon: Sparkles
              },
              {
                step: '03',
                title: 'Visitor Quiz & Swap',
                desc: 'Visitors answer a 1-click quiz question; copy swaps instantly and persists on return visits.',
                icon: Code
              },
              {
                step: '04',
                title: 'Measure Conversions',
                desc: 'Analyze quiz engagement and CTA conversion rates per segment in real time.',
                icon: BarChart2
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3">
                  <div className="text-xs font-bold text-slate-400">{card.step}</div>
                  <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-xl p-10 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to increase your website conversion rate?
          </h2>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Set up your visitor use cases in under two minutes and deploy automated personalization.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup">
              <Button size="lg" icon={ArrowRight}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="dark" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-slate-200 bg-white text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo variant="ac" type="horizontal" size="sm" showTagline={true} />
          </div>
          <div className="text-center sm:text-right text-xs space-y-1">
            <p className="font-semibold text-slate-700">AI-Powered Customer Experience Platform</p>
            <p className="text-slate-500">© 2026 AdaptCX. Built for AI for Customer Experience Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
