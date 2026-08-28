import React, { useState, useEffect } from 'react';
import { contentVariantsApi, useCasesApi, contentBlocksApi } from '../api/client';
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Layers,
  Users
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { TextArea, Input } from '../components/common/Input';
import { Badge, LoadingSpinner } from '../components/common/Badge';

export const ContentStudioPage = () => {
  const [groupedVariants, setGroupedVariants] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [baselineBlocks, setBaselineBlocks] = useState({});
  const [activeUseCaseId, setActiveUseCaseId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [savingVariantId, setSavingVariantId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [editedValues, setEditedValues] = useState({});

  const fetchData = async () => {
    try {
      const [variantsRes, useCasesRes, baselineRes] = await Promise.all([
        contentVariantsApi.getAll(),
        useCasesApi.getAll(),
        contentBlocksApi.getAll()
      ]);

      const fetchedUseCases = useCasesRes.data.useCases || [];
      setUseCases(fetchedUseCases);
      setGroupedVariants(variantsRes.data.grouped || []);
      setBaselineBlocks(baselineRes.data.blockMap || {});

      if (fetchedUseCases.length > 0 && !activeUseCaseId) {
        setActiveUseCaseId(fetchedUseCases[0].id);
      }
    } catch (err) {
      console.error('Error loading content studio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateAI = async () => {
    if (useCases.length === 0) {
      setErrorMsg('Please create at least one visitor persona before generating AI variants.');
      return;
    }

    setGenerating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await contentVariantsApi.generate();
      setSuccessMsg(res.data.message || 'AI copy variants generated successfully.');
      await fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to generate AI copy variants.');
    } finally {
      setGenerating(false);
    }
  };

  const handleValueChange = (variantId, val) => {
    setEditedValues(prev => ({
      ...prev,
      [variantId]: {
        ...(prev[variantId] || {}),
        generated_value: val
      }
    }));
  };

  const handleTogglePublish = async (variantId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await contentVariantsApi.update(variantId, { is_published: newStatus });
      await fetchData();
    } catch (err) {
      console.error('Toggle publish error:', err);
    }
  };

  const handleSaveVariant = async (variantId) => {
    const edit = editedValues[variantId];
    if (!edit || edit.generated_value === undefined) return;

    setSavingVariantId(variantId);
    try {
      await contentVariantsApi.update(variantId, { generated_value: edit.generated_value });
      setSuccessMsg('Variant updated.');
      setTimeout(() => setSuccessMsg(''), 2500);
      await fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update variant.');
    } finally {
      setSavingVariantId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading AI Content Studio..." />;
  }

  const activeGroup = groupedVariants.find(g => g.use_case.id === activeUseCaseId) || groupedVariants[0];
  const activeUseCaseObj = useCases.find(uc => uc.id === activeUseCaseId);

  const blockLabels = {
    hero_headline: 'Hero Headline',
    hero_subheadline: 'Hero Subheadline',
    feature_1: 'Feature 1',
    feature_2: 'Feature 2',
    feature_3: 'Feature 3',
    cta_text: 'CTA Button Text',
    testimonial: 'Social Proof / Testimonial'
  };

  const blockKeys = [
    'hero_headline',
    'hero_subheadline',
    'feature_1',
    'feature_2',
    'feature_3',
    'cta_text',
    'testimonial'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI Content Studio</h1>
            <Badge variant="indigo" size="sm">
              Gemini & OpenAI
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, edit, and publish tailored copy variants across all customer personas.
          </p>
        </div>

        <Button
          onClick={handleGenerateAI}
          size="sm"
          isLoading={generating}
          icon={Sparkles}
        >
          {generating ? 'Generating AI Variants...' : 'Generate All Variants with AI'}
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

      {/* Segment Tabs */}
      {useCases.length > 0 ? (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
          {useCases.map((uc) => {
            const isSelected = uc.id === activeUseCaseId;
            return (
              <button
                key={uc.id}
                onClick={() => setActiveUseCaseId(uc.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {uc.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-8 rounded-xl text-center">
          <p className="text-xs text-slate-500">Please define visitor personas on the Personas page first.</p>
        </div>
      )}

      {/* Active Persona Context Card */}
      {activeUseCaseObj && (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
              Active Persona Context:
            </span>
            <span className="text-xs font-bold text-slate-900">{activeUseCaseObj.label}</span>
            <p className="text-xs text-slate-500 mt-0.5">Pain Points: {activeUseCaseObj.pain_points}</p>
          </div>
          <Badge variant="indigo" size="sm">
            7 Blocks
          </Badge>
        </div>
      )}

      {/* Content Comparison Matrix */}
      <div className="space-y-4">
        {blockKeys.map((key) => {
          const variantData = activeGroup?.blocks?.[key];
          const hasVariant = !!variantData;
          const isPublished = variantData ? variantData.is_published !== false : false;
          const currentValue =
            editedValues[variantData?.id]?.generated_value !== undefined
              ? editedValues[variantData.id].generated_value
              : variantData?.generated_value || '';

          const isEdited =
            variantData &&
            editedValues[variantData.id]?.generated_value !== undefined &&
            editedValues[variantData.id].generated_value !== variantData.generated_value;

          return (
            <div
              key={key}
              className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-4 items-start"
            >
              {/* Baseline Column */}
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    {blockLabels[key]}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Baseline</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed italic">
                  "{baselineBlocks[key] || 'No baseline configured'}"
                </div>
              </div>

              {/* AI Tailored Variant Column */}
              <div className="lg:col-span-7 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>AI Variant</span>
                    </span>
                    {hasVariant && (
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isPublished ? 'Live' : 'Draft'}
                      </span>
                    )}
                  </div>

                  {hasVariant && (
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(variantData.id, isPublished)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      {isPublished ? (
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-[11px] font-medium">{isPublished ? 'Published' : 'Unpublished'}</span>
                    </button>
                  )}
                </div>

                {hasVariant ? (
                  <div className="space-y-2">
                    {key === 'hero_subheadline' || key === 'testimonial' ? (
                      <TextArea
                        rows={3}
                        value={currentValue}
                        onChange={(e) => handleValueChange(variantData.id, e.target.value)}
                        className="text-xs bg-white border-slate-300 text-slate-900"
                      />
                    ) : (
                      <Input
                        value={currentValue}
                        onChange={(e) => handleValueChange(variantData.id, e.target.value)}
                        className="text-xs bg-white border-slate-300 text-slate-900"
                      />
                    )}

                    {isEdited && (
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSaveVariant(variantData.id)}
                          isLoading={savingVariantId === variantData.id}
                          icon={Save}
                          className="text-xs py-1"
                        >
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center text-xs text-slate-500">
                    Awaiting AI generation. Click "Generate All Variants" above.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
