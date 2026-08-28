import React, { useState, useEffect } from 'react';
import { contentVariantsApi, contentBlocksApi, useCasesApi } from '../api/client';
import {
  Smartphone,
  Monitor,
  Sparkles,
  Quote,
  Zap,
  ArrowRight,
  Globe
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge, LoadingSpinner } from '../components/common/Badge';

export const LivePreviewPage = () => {
  const [useCases, setUseCases] = useState([]);
  const [groupedVariants, setGroupedVariants] = useState([]);
  const [baselineBlocks, setBaselineBlocks] = useState({});
  const [selectedUseCaseId, setSelectedUseCaseId] = useState('baseline');
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [variantsRes, useCasesRes, baselineRes] = await Promise.all([
        contentVariantsApi.getAll(),
        useCasesApi.getAll(),
        contentBlocksApi.getAll()
      ]);

      setUseCases(useCasesRes.data.useCases || []);
      setGroupedVariants(variantsRes.data.grouped || []);
      setBaselineBlocks(baselineRes.data.blockMap || {});
    } catch (err) {
      console.error('Error loading preview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading live preview simulator..." />;
  }

  const activeGroup = groupedVariants.find(g => g.use_case.id === selectedUseCaseId);
  const activeUseCase = useCases.find(uc => uc.id === selectedUseCaseId);

  const currentContent = {
    hero_headline:
      selectedUseCaseId !== 'baseline' && activeGroup?.blocks?.hero_headline?.generated_value
        ? activeGroup.blocks.hero_headline.generated_value
        : baselineBlocks.hero_headline || 'Transform Your Business with Intelligent Solutions',
    hero_subheadline:
      selectedUseCaseId !== 'baseline' && activeGroup?.blocks?.hero_subheadline?.generated_value
        ? activeGroup.blocks.hero_subheadline.generated_value
        : baselineBlocks.hero_subheadline || 'Supercharge your operations and unlock unprecedented growth.',
    feature_1:
      selectedUseCaseId !== 'baseline' && activeGroup?.blocks?.feature_1?.generated_value
        ? activeGroup.blocks.feature_1.generated_value
        : baselineBlocks.feature_1 || 'Seamless integration with existing workflows',
    feature_2:
      selectedUseCaseId !== 'baseline' && activeGroup?.blocks?.feature_2?.generated_value
        ? activeGroup.blocks.feature_2.generated_value
        : baselineBlocks.feature_2 || 'Automated real-time analytics & intelligence',
    feature_3:
      selectedUseCaseId !== 'baseline' && activeGroup?.blocks?.feature_3?.generated_value
        ? activeGroup.blocks.feature_3.generated_value
        : baselineBlocks.feature_3 || 'Enterprise security & regulatory compliance',
    cta_text:
      selectedUseCaseId !== 'baseline' && activeGroup?.blocks?.cta_text?.generated_value
        ? activeGroup.blocks.cta_text.generated_value
        : baselineBlocks.cta_text || 'Start Your Free Trial',
    testimonial:
      selectedUseCaseId !== 'baseline' && activeGroup?.blocks?.testimonial?.generated_value
        ? activeGroup.blocks.testimonial.generated_value
        : baselineBlocks.testimonial || '“This platform revolutionized how our team operates.” — Jordan Lee, Operations Lead'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Live Content Simulator</h1>
            <Badge variant="indigo" size="sm">
              Instant Preview
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Test how your website copy renders across different customer personas.
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Persona Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-600">Viewing As:</span>
            <select
              value={selectedUseCaseId}
              onChange={(e) => setSelectedUseCaseId(e.target.value)}
              className="bg-transparent text-xs font-bold text-indigo-700 focus:outline-none cursor-pointer"
            >
              <option value="baseline" className="bg-white text-slate-900">
                Baseline (Default / Generic)
              </option>
              {useCases.map((uc) => (
                <option key={uc.id} value={uc.id} className="bg-white text-slate-900">
                  {uc.label} (AI Variant)
                </option>
              ))}
            </select>
          </div>

          {/* Device Toggle */}
          <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Frame */}
      <div className="flex justify-center">
        <div
          className={`w-full transition-all duration-200 ${
            deviceMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
          }`}
        >
          {/* Clean Browser Shell */}
          <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
            {/* Top Browser Bar */}
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
              <div className="bg-white px-3 py-0.5 rounded text-[11px] text-slate-600 font-mono flex items-center gap-1.5 border border-slate-200 shadow-2xs">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>https://yourcompany.com</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
                {selectedUseCaseId === 'baseline' ? 'Baseline' : activeUseCase?.label}
              </div>
            </div>

            {/* Rendered Website Canvas */}
            <div className="p-8 sm:p-12 space-y-12 text-slate-900 bg-white">
              {/* Hero Section */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-block">
                  <Badge variant={selectedUseCaseId === 'baseline' ? 'slate' : 'indigo'} size="sm">
                    {selectedUseCaseId === 'baseline'
                      ? 'Generic Landing Experience'
                      : `Personalized for ${activeUseCase?.label}`}
                  </Badge>
                </div>

                <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  {currentContent.hero_headline}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                  {currentContent.hero_subheadline}
                </p>

                <div className="pt-2">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer">
                    {currentContent.cta_text}
                  </button>
                </div>
              </div>

              {/* 3 Features */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Core Platform Capabilities
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { title: 'Feature 01', text: currentContent.feature_1 },
                    { title: 'Feature 02', text: currentContent.feature_2 },
                    { title: 'Feature 03', text: currentContent.feature_3 }
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5"
                    >
                      <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-indigo-600 text-xs mb-1 shadow-2xs">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-[11px] font-semibold text-slate-500 uppercase">
                        {feat.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-800">{feat.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl max-w-xl mx-auto text-center space-y-3">
                <Quote className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-medium">
                  {currentContent.testimonial}
                </p>
                <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Verified Endorsement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
