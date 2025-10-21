import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PageShell from './layouts/PageShell';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import TemplatesPage from './pages/TemplatesPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';

const App = () => (
  <PageShell>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/:username" element={<ProfilePage />} />
    </Routes>
  </PageShell>
);

export default App;
