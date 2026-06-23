import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from '../components/common/Icon';

const AdminSettings = () => {
  const [profile, setProfile] = useState({
    handle: 'SoleStream',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/admin/profile');
        if (response.data.success) {
          setProfile(response.data.profile);
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const response = await api.put('/admin/profile', {
        bio: profile.bio,
        handle: profile.handle
      });
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Store settings updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update store settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-neutral tracking-tight">Store Configuration</h1>
        <p className="text-gray-500 mt-1">Manage your public storefront identity and settings.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl border border-secondary/20 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-secondary/10 flex items-center gap-3">
            <Icon name="settings" className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-neutral uppercase tracking-widest text-sm">Branding & Identity</h2>
          </div>
          <div className="p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-bold border ${
                message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Store Name / Handle</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-400 font-bold">@</span>
                    <input
                      type="text"
                      className="w-full pl-8 pr-4 py-3 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background font-bold text-neutral"
                      value={profile.handle}
                      onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">System Status</label>
                  <div className="w-full px-4 py-3 border border-secondary/10 rounded-xl bg-green-50 text-green-600 font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Online & Processing
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Store Description (Meta)</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-neutral font-medium"
                  placeholder="Official SoleStream storefront description..."
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-8 py-3 rounded-xl font-bold text-neutral transition shadow-lg ${
                    saving ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary hover:shadow-primary/20'
                  }`}
                >
                  {saving ? 'Updating Site...' : 'Save Site Settings'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Payments Section */}
        <section className="bg-white rounded-2xl border border-secondary/20 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-secondary/10 flex items-center gap-3">
            <Icon name="credit-card" className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-neutral uppercase tracking-widest text-sm">Payment Gateway</h2>
          </div>
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral text-lg">Direct Stripe Integration</h3>
                <p className="text-gray-500 text-sm font-medium">Checkout is currently active using the platform's primary API keys.</p>
              </div>
              <div className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-widest">
                System Managed
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Section */}
        <section className="bg-red-50/30 rounded-2xl border border-red-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-red-100 flex items-center gap-3">
            <Icon name="alert-triangle" className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-red-600 uppercase tracking-widest text-sm">Danger Zone</h2>
          </div>
          <div className="p-8 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-neutral">Maintenance Mode</h3>
              <p className="text-gray-500 text-sm font-medium">Disable public browsing and checkouts temporarily.</p>
            </div>
            <button className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-200">
              Enable Maintenance
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSettings;
