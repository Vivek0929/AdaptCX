import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../api/client';
import {
  Sparkles,
  CheckCircle2,
  Quote,
  ArrowRight,
  RefreshCw,
  X,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge, LoadingSpinner } from '../components/common/Badge';
import { Logo } from '../components/common/Logo';

export const PublicSiteDemoPage = () => {
  const { businessId } = useParams();

  const [siteData, setSiteData] = useState(null);
  const [content, setContent] = useState({});
  const [useCases, setUseCases] = useState([]);
  const [activeUseCase, setActiveUseCase] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);

  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [ctaModalOpen, setCtaModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState('');

  const getSessionToken = () => {
    let token = localStorage.getItem('adaptcx_public_session_token');
    if (!token) {
      token = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      localStorage.setItem('adaptcx_public_session_token', token);
    }
    return token;
  };

  const sessionToken = getSessionToken();

  const loadSite = async () => {
    try {
      const res = await publicApi.getSiteData(businessId);
      const data = res.data;
      setSiteData(data);
      setUseCases(data.use_cases || []);

      const savedUseCaseId = localStorage.getItem(`adaptcx_selected_uc_${businessId}`);

      if (savedUseCaseId && data.use_cases.some(uc => uc.id === savedUseCaseId)) {
        const matched = data.use_cases.find(uc => uc.id === savedUseCaseId);
        setActiveUseCase(matched);
        setIsPersonalized(true);

        try {
          const selectRes = await publicApi.selectUseCase(businessId, {
            use_case_id: savedUseCaseId,
            session_token: sessionToken
          });
          setContent(selectRes.data.content || data.baseline_blocks);
        } catch (err) {
          setContent(data.baseline_blocks);
        }

        publicApi.logEvent(businessId, {
          session_token: sessionToken,
          event_type: 'page_view',
          use_case_id: savedUseCaseId
        });
      } else {
        setContent(data.baseline_blocks || {});
        setIsPersonalized(false);
        setShowQuiz(true);

        publicApi.logEvent(businessId, {
          session_token: sessionToken,
          event_type: 'page_view'
        });
        publicApi.logEvent(businessId, {
          session_token: sessionToken,
          event_type: 'quiz_shown'
        });
      }
    } catch (err) {
      console.error('Failed to load public site:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSite();
  }, [businessId]);

  const handleSelectUseCase = async (uc) => {
    setSelecting(true);
    try {
      const res = await publicApi.selectUseCase(businessId, {
        use_case_id: uc.id,
        session_token: sessionToken
      });

      localStorage.setItem(`adaptcx_selected_uc_${businessId}`, uc.id);

      setContent(res.data.content);
      setActiveUseCase(uc);
      setIsPersonalized(true);
      setShowQuiz(false);

      setFeedbackToast(`Tailored for ${uc.label}`);
      setTimeout(() => setFeedbackToast(''), 3500);
    } catch (err) {
      console.error('Failed to select use case:', err);
    } finally {
      setSelecting(false);
    }
  };

  const handleCtaClick = () => {
    publicApi.logEvent(businessId, {
      session_token: sessionToken,
      event_type: 'cta_click',
      use_case_id: activeUseCase?.id || null
    });
    setCtaModalOpen(true);
  };

  const handleResetQuiz = () => {
    localStorage.removeItem(`adaptcx_selected_uc_${businessId}`);
    setActiveUseCase(null);
    setIsPersonalized(false);
    setContent(siteData?.baseline_blocks || {});
    setShowQuiz(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading website experience..." />
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 text-center text-slate-600">
        <p className="text-base font-bold text-slate-900 mb-1">Company Website Not Found</p>
        <p className="text-xs mb-4">Please verify the business ID URL.</p>
        <Link to="/">
          <Button size="sm">Go to AdaptCX Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* Top Status Bar for Evaluators */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              {siteData.business_name?.charAt(0) || 'A'}
            </div>
            <span className="font-bold text-xs text-slate-900">
              {siteData.business_name}
            </span>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              {isPersonalized ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                  <span>Tailored for: {activeUseCase?.label}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                  <span>Baseline (Generic)</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetQuiz}
              className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1.5 cursor-pointer bg-white hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-200 shadow-2xs transition-colors"
            >
              <RefreshCw className="w-3 h-3 text-slate-500" />
              <span>{isPersonalized ? 'Retake Quiz' : 'Open Quiz'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Website Canvas */}
      <main className="max-w-5xl mx-auto px-6 py-16 sm:py-24 space-y-20 flex-1 w-full">
        {/* Toast */}
        {feedbackToast && (
          <div className="fixed top-14 right-6 z-50 animate-in fade-in">
            <div className="bg-white border border-slate-200 text-slate-800 px-3.5 py-2 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{feedbackToast}</span>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-block">
            <Badge variant={isPersonalized ? 'indigo' : 'slate'} size="sm">
              {isPersonalized
                ? `Tailored Solution for ${activeUseCase?.label}`
                : 'Enterprise Solutions'}
            </Badge>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15]">
            {content.hero_headline || `Intelligent Solutions for Modern ${siteData.business_name}`}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            {content.hero_subheadline || siteData.product_description}
          </p>

          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={handleCtaClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-7 py-3 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>{content.cta_text || 'Get Started'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 3 Features Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Core Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Feature 01', text: content.feature_1 || 'Seamless integration with existing workflows' },
              { title: 'Feature 02', text: content.feature_2 || 'Real-time intelligence and automated reporting' },
              { title: 'Feature 03', text: content.feature_3 || 'Enterprise security and scale built-in' }
            ].map((feat, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-2"
              >
                <div className="w-7 h-7 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs mb-1">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase">
                  {feat.title}
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-snug">{feat.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial Quote Section */}
        <section className="bg-white border border-slate-200 p-8 rounded-xl max-w-2xl mx-auto text-center space-y-4 shadow-xs">
          <Quote className="w-6 h-6 text-slate-400 mx-auto" />
          <blockquote className="text-sm sm:text-base font-medium text-slate-700 italic leading-relaxed">
            {content.testimonial || '“This platform completely revolutionized how our team collaborates and delivers results.”'}
          </blockquote>
          <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
            {isPersonalized ? `Customer Review • ${activeUseCase?.label}` : 'Verified Customer Testimonial'}
          </div>
        </section>
      </main>

      {/* Clean Floating Quiz Prompt */}
      {showQuiz && (
        <div className="fixed bottom-5 right-5 z-50 max-w-xs w-[calc(100vw-40px)] animate-in fade-in duration-200">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-xl space-y-3 relative text-slate-900">
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-0.5">
                Personalize Experience
              </div>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">
                {siteData.quiz_question || 'What best describes your business?'}
              </h3>
            </div>

            <div className="space-y-1.5 pt-0.5">
              {useCases.length > 0 ? (
                useCases.map((uc) => (
                  <button
                    key={uc.id}
                    onClick={() => handleSelectUseCase(uc)}
                    disabled={selecting}
                    className="w-full text-left px-3 py-2 rounded-md bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white text-xs font-medium border border-slate-200 hover:border-indigo-600 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <span>{uc.label}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
                  </button>
                ))
              ) : (
                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-md border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-700">No personas defined yet</p>
                  <p className="text-[11px] leading-relaxed">
                    Open your <strong>AdaptCX Dashboard ➔ Visitor Personas</strong> to add options like <em>Healthcare</em>, <em>Fintech</em>, or <em>E-Commerce</em>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Modal */}
      {ctaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-sm w-full text-center space-y-3.5 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Conversion Event Recorded</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              CTA clicked: <span className="font-mono text-indigo-700 font-bold">"{content.cta_text}"</span>.
              <br />
              Attributed to{' '}
              <span className="font-semibold text-emerald-700">
                {activeUseCase ? `"${activeUseCase.label}"` : 'Baseline segment'}
              </span>{' '}
              in the business dashboard.
            </p>
            <Button onClick={() => setCtaModalOpen(false)} size="sm" className="w-full">
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <span>Powered by</span>
        <Link to="/" className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          <Logo variant="ac" type="horizontal" size="xs" showTagline={false} />
        </Link>
      </footer>
    </div>
  );
};
