import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChildDataProvider } from './context/ChildDataContext';
import AppLayout from './components/layout/AppLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ChildRegistration from './pages/ChildRegistration';
import GrowthMeasurement from './pages/GrowthMeasurement';
import NutritionalAssessment from './pages/NutritionalAssessment';
import GrowthMonitoring from './pages/GrowthMonitoring';
import AlertsReminders from './pages/AlertsReminders';
import NutritionGuidance from './pages/NutritionGuidance';
import ChildHistory from './pages/ChildHistory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ChildDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Application Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="register" element={<ChildRegistration />} />
              <Route path="measurement" element={<GrowthMeasurement />} />
              <Route path="assessment" element={<NutritionalAssessment />} />
              <Route path="monitoring" element={<GrowthMonitoring />} />
              <Route path="alerts" element={<AlertsReminders />} />
              <Route path="guidance" element={<NutritionGuidance />} />
              <Route path="history" element={<ChildHistory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChildDataProvider>
    </AuthProvider>
  );
}
