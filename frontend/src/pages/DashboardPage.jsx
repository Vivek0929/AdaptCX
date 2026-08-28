import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { insightsApi, useCasesApi } from '../api/client';
import {
  Users,
  MousePointer,
  HelpCircle,
  Eye,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  BarChart2,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Button } from '../components/common/Button';
import { Badge, LoadingSpinner } from '../components/common/Badge';

export const DashboardPage = () => {
  const { business } = useAuth();
  const [insights, setInsights] = useState(null);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [insightsRes, useCasesRes] = await Promise.all([
        insightsApi.getDashboard(),
        useCasesApi.getAll()
      ]);
      setInsights(insightsRes.data);
      setUseCases(useCasesRes.data.useCases || []);
    } catch (err) {
      console.error('Failed to load dashboard insights:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading business insights..." />;
  }

  const summary = insights?.summary || {
    total_page_views: 0,
    total_quiz_shown: 0,
    total_quiz_answered: 0,
    total_cta_clicks: 0,
    quiz_completion_rate: 0,
    overall_conversion_rate: 0
  };

  const sortedUseCases = [...(insights?.use_cases || [])].sort(
    (a, b) => (b.conversion_rate || 0) - (a.conversion_rate || 0)
  );
  const topUseCase = sortedUseCases.find((uc) => (uc.quiz_answered || 0) > 0);

  const chartData = (insights?.use_cases || []).map((uc) => ({
    name: uc.label,
    'Quiz Answers': uc.quiz_answered || 0,
    'CTA Clicks': uc.cta_clicks || 0,
    'Conversion %': uc.conversion_rate || 0
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Performance Insights
            </h1>
            <Badge variant="indigo" size="sm">
              Live Feed
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time analytics across visitor segments, quiz completions, and personalized CTA conversions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            isLoading={refreshing}
            icon={RefreshCw}
          >
            Refresh
          </Button>

          {business?.id && (
            <a
              href={`/site/${business.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="sm" icon={ExternalLink}>
                Public Demo Site
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Page Views */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Visits</span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.total_page_views}</div>
          <div className="text-[11px] text-slate-500">Visitor sessions tracked</div>
        </div>

        {/* Quiz Answered */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Quiz Completed</span>
            <HelpCircle className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.total_quiz_answered}</div>
          <div className="text-[11px] text-indigo-600 font-medium">
            {summary.quiz_completion_rate}% Completion Rate
          </div>
        </div>

        {/* CTA Clicks */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">CTA Conversions</span>
            <MousePointer className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{summary.total_cta_clicks}</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {summary.overall_conversion_rate}% Overall Click Rate
          </div>
        </div>

        {/* Top Converting Segment */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Persona</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {topUseCase ? topUseCase.label : 'Awaiting traffic'}
          </div>
          <div className="text-[11px] text-slate-500">
            {topUseCase ? `${topUseCase.conversion_rate}% conversion rate` : 'Collect more visitor data'}
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Use Case Engagement & Conversion Metrics</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of quiz interactions and personalized CTA conversions across visitor personas.
            </p>
          </div>
          <Link to="/use-cases">
            <Button variant="ghost" size="sm" icon={ArrowRight}>
              Manage Personas ({useCases.length})
            </Button>
          </Link>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Quiz Answers" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CTA Clicks" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">No use case interactions recorded yet.</p>
          </div>
        )}
      </div>

      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/content-studio" className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 block shadow-xs transition-colors">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-slate-900">AI Content Studio</h3>
          <p className="text-xs text-slate-500 mt-1">Review and fine-tune AI copy variants generated by Gemini AI.</p>
        </Link>

        <Link to="/preview" className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 block shadow-xs transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
            <Eye className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-slate-900">Live Simulator</h3>
          <p className="text-xs text-slate-500 mt-1">Test persona switching and preview variants across viewport sizes.</p>
        </Link>

        <Link to="/widget-setup" className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 block shadow-xs transition-colors">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-slate-900">Integration Script</h3>
          <p className="text-xs text-slate-500 mt-1">Embed the 1-line script tag on your production or staging website.</p>
        </Link>
      </div>
    </div>
  );
};
