import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from '../components/common/Icon';

const DashboardOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics');
        if (response.data.success) {
          setAnalytics(response.data.analytics);
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  const formatCurrency = (cents) => {
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const stats = [
    {
      name: 'Gross Sales',
      value: formatCurrency(analytics.gross_sales_cents),
      icon: 'dollar',
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Total Transactions',
      value: analytics.total_transactions,
      icon: 'shopping-cart',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Avg Transaction',
      value: formatCurrency(analytics.average_order_value_cents),
      icon: 'trending-up',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      name: 'Store Status',
      value: 'ACTIVE',
      icon: 'award',
      color: 'bg-accent/20 text-neutral',
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Store performance and analytics overview.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-secondary/20 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon name={stat.icon} className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                {stat.name}
              </div>
            </div>
            <div className="text-3xl font-extrabold text-neutral">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm min-h-[400px] flex flex-col">
          <h2 className="text-lg font-bold text-neutral mb-8 uppercase tracking-widest">Revenue Performance</h2>
          <div className="flex-grow flex items-center justify-center bg-background rounded-xl border border-dashed border-secondary/40">
            <div className="text-center">
              <Icon name="activity" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Sales charts coming in Phase 2.</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-2xl border border-secondary/20 shadow-sm">
          <h2 className="text-lg font-bold text-neutral mb-8 uppercase tracking-widest">Admin Actions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-background hover:bg-secondary/10 rounded-xl transition font-bold text-neutral border border-secondary/20">
              <div className="flex items-center gap-3">
                <Icon name="plus-circle" className="w-5 h-5 text-primary" />
                <span>Create New Listing</span>
              </div>
              <Icon name="chevron-right" className="w-4 h-4 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-background hover:bg-secondary/10 rounded-xl transition font-bold text-neutral border border-secondary/20">
              <div className="flex items-center gap-3">
                <Icon name="settings" className="w-5 h-5 text-gray-400" />
                <span>Site Configuration</span>
              </div>
              <Icon name="chevron-right" className="w-4 h-4 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-background hover:bg-secondary/10 rounded-xl transition font-bold text-neutral border border-secondary/20">
              <div className="flex items-center gap-3">
                <Icon name="shield" className="w-5 h-5 text-blue-400" />
                <span>Security Audit</span>
              </div>
              <Icon name="chevron-right" className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
