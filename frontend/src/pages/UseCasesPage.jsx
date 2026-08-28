import React, { useState, useEffect } from 'react';
import { useCasesApi } from '../api/client';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Check
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input, TextArea } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Badge, LoadingSpinner } from '../components/common/Badge';

export const UseCasesPage = () => {
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUseCase, setEditingUseCase] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    label: '',
    pain_points: '',
    sort_order: 0
  });

  const fetchUseCases = async () => {
    try {
      const res = await useCasesApi.getAll();
      setUseCases(res.data.useCases || []);
    } catch (err) {
      console.error('Error fetching use cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUseCases();
  }, []);

  const handleOpenAdd = () => {
    setEditingUseCase(null);
    setFormData({ label: '', pain_points: '', sort_order: useCases.length });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (uc) => {
    setEditingUseCase(uc);
    setFormData({
      label: uc.label,
      pain_points: uc.pain_points,
      sort_order: uc.sort_order || 0
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.label.trim()) {
      setError('Use case label is required.');
      return;
    }
    if (!formData.pain_points.trim() || formData.pain_points.length < 5) {
      setError('Pain points description must be at least 5 characters.');
      return;
    }

    setSaving(true);
    try {
      if (editingUseCase) {
        await useCasesApi.update(editingUseCase.id, formData);
      } else {
        await useCasesApi.create(formData);
      }
      setModalOpen(false);
      fetchUseCases();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save use case.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this use case? Its AI variants will also be removed.')) {
      return;
    }

    try {
      await useCasesApi.delete(id);
      fetchUseCases();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete use case.');
    }
  };

  const presets = [
    {
      label: 'Healthcare & Medical Clinics',
      pain_points: 'Strict HIPAA compliance, clinician workflow fatigue, slow patient onboarding'
    },
    {
      label: 'Fintech & Banking Teams',
      pain_points: 'Audit security, regulatory compliance, transaction fraud risks, legacy tech integration'
    },
    {
      label: 'E-Commerce Brands',
      pain_points: 'Cart abandonment, multi-channel stock sync, high ad acquisition costs'
    },
    {
      label: 'B2B SaaS Enterprises',
      pain_points: 'Long sales cycles, high customer churn, complex developer onboarding'
    }
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading visitor personas..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Visitor Personas (Use Cases)</h1>
            <Badge variant="indigo" size="sm">
              {useCases.length} Defined
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the customer segments visiting your site. AI uses their pain points to generate tailored copy.
          </p>
        </div>

        <Button onClick={handleOpenAdd} size="sm" icon={Plus}>
          Add Persona
        </Button>
      </div>

      {/* Grid of Use Cases */}
      {useCases.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 p-10 rounded-xl text-center space-y-3">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-slate-900">No visitor personas defined yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add your target customer segments (e.g. Healthcare, Fintech, E-Commerce).
            </p>
          </div>
          <Button onClick={handleOpenAdd} size="sm" icon={Plus}>
            Add First Persona
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {useCases.map((uc, index) => (
            <div
              key={uc.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Option #{index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(uc)}
                      className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(uc.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-2">{uc.label}</h3>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider block mb-1">
                    Target Pain Points & Priorities
                  </span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                    {uc.pain_points}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Quiz Sort Index: {uc.sort_order || 0}</span>
                <span className="text-indigo-600 font-medium">Ready for AI</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUseCase ? 'Edit Persona' : 'Add Visitor Persona'}
        subtitle="This option will appear in the visitor quiz on your website."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!editingUseCase && (
            <div>
              <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">
                Suggested Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData({
                        label: preset.label,
                        pain_points: preset.pain_points,
                        sort_order: useCases.length
                      });
                    }}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input
            label="Persona Label (Quiz Option Text)"
            placeholder="e.g. Healthcare & Medical Clinics"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            helperText="The option text visitors select in the quiz."
            required
          />

          <TextArea
            label="Key Pain Points & Priorities"
            rows={3}
            placeholder="e.g. Strict HIPAA compliance, staff fatigue, EHR system integration delays"
            value={formData.pain_points}
            onChange={(e) => setFormData({ ...formData, pain_points: e.target.value })}
            helperText="Gemini AI uses these pain points to retarget the copy."
            required
          />

          <Input
            label="Sort Order Index"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            helperText="Lower numbers appear first in the quiz dropdown/overlay."
          />

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={saving}
              icon={Check}
            >
              {editingUseCase ? 'Save Persona' : 'Create Persona'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
