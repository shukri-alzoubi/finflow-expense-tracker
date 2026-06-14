import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Auth
import LoginPage from './pages/auth/Login.page';
import SignupPage from './pages/auth/Signup.page';
import ForgotPasswordPage from './pages/auth/ForgotPassword.page';

// Private
import DashboardPage from './pages/private/Dahsboard.page';
import TransactionsPage from './pages/private/Transactions.page';
import CategoriesPage from './pages/private/Categories.page';
import SettingsPage from './pages/private/Settings.page';

// Shared
import LandingPage from './pages/shared/Landing.page';
import NotFoundPage from './pages/shared/NotFound.page';




function App() {
  const { user } = useState(null)

  const AuthRoute = () => {
    return !user ? <Outlet /> : <Navigate to="/dashboard" />
  }

  const ProtectedRoute = () => {
    return user ? <Outlet /> : <Navigate to="/login" />
  }

  return (<Routes>
    {/* Pages without sidebar / public pages */}
    <Route path="/" element={<LandingPage />} />

    {/* Auth Routes */}
    <Route element={<AuthRoute />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    </Route>

    {/* Protected Pages with sidebar */}
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>);
}

export default App