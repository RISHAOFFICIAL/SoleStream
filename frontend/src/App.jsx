import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import ListingDetail from './pages/ListingDetail';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardOverview from './pages/DashboardOverview';
import ManageListings from './pages/ManageListings';
import SellerSettings from './pages/SellerSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute role="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="listings" element={<ManageListings />} />
            <Route path="orders" element={<div className="p-8"><h1 className="text-2xl font-bold text-neutral">Orders</h1><p className="mt-4 text-gray-500">Order history tracking coming soon.</p></div>} />
            <Route path="settings" element={<SellerSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
