import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import ListingDetail from './pages/ListingDetail';
import SellerProfile from './pages/SellerProfile';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardOverview from './pages/DashboardOverview';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/seller/:handle" element={<SellerProfile />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="listings" element={<div className="p-8"><h1 className="text-2xl font-bold">My Listings</h1><p className="mt-4 text-gray-500">Listings management coming soon.</p></div>} />
          <Route path="orders" element={<div className="p-8"><h1 className="text-2xl font-bold">Orders</h1><p className="mt-4 text-gray-500">Order history coming soon.</p></div>} />
          <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1><p className="mt-4 text-gray-500">Profile and payout settings coming soon.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
