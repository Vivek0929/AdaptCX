import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart2,
  Users,
  FileText,
  Sparkles,
  PlaySquare,
  Code,
  Sliders,
  LogOut,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  Layers
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { Logo } from '../components/common/Logo';

export const DashboardLayout = () => {
  const { business, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Analytics & Insights', icon: BarChart2 },
    { to: '/use-cases', label: 'Visitor Personas', icon: Users },
    { to: '/content-blocks', label: 'Baseline Copy', icon: FileText },
    { to: '/content-studio', label: 'AI Content Studio', icon: Sparkles },
    { to: '/preview', label: 'Live Simulator', icon: PlaySquare },
    { to: '/widget-setup', label: 'Integration & Embed', icon: Code },
    { to: '/settings', label: 'Settings & Voice', icon: Sliders }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Top Nav */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 z-40">
        <Link to="/dashboard" className="flex items-center">
          <Logo variant="ac" type="horizontal" size="sm" />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md bg-slate-100"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 z-50 transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <Link to="/dashboard" className="hidden md:flex items-center px-1 py-1 mb-6 hover:opacity-90 transition-opacity">
            <Logo variant="ac" type="horizontal" size="md" showTagline={true} />
          </Link>

          {/* Business Workspace Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Active Workspace</p>
            <p className="font-semibold text-xs text-slate-900 truncate mt-0.5">{business?.business_name || 'My Company'}</p>
            <div className="mt-1.5">
              <Badge variant="indigo" size="sm">
                {business?.industry?.replace('_', ' ') || 'SaaS'}
              </Badge>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-1.5 pt-3 border-t border-slate-200">
          {business?.id && (
            <a
              href={`/site/${business.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">Public Demo Site</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </a>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
