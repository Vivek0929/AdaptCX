import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { UseCasesPage } from './pages/UseCasesPage';
import { ContentBlocksPage } from './pages/ContentBlocksPage';
import { ContentStudioPage } from './pages/ContentStudioPage';
import { LivePreviewPage } from './pages/LivePreviewPage';
import { WidgetSetupPage } from './pages/WidgetSetupPage';
import { SettingsPage } from './pages/SettingsPage';
import { PublicSiteDemoPage } from './pages/PublicSiteDemoPage';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Marketing */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Customer Demo Site */}
          <Route path="/site/:businessId" element={<PublicSiteDemoPage />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          {/* Authenticated Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/content-blocks" element={<ContentBlocksPage />} />
            <Route path="/content-studio" element={<ContentStudioPage />} />
            <Route path="/preview" element={<LivePreviewPage />} />
            <Route path="/widget-setup" element={<WidgetSetupPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
