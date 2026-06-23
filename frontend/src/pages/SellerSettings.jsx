import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from '../components/common/Icon';

const SellerSettings = () => {
  const [profile, setProfile] = useState({
    handle: '',
    bio: '',
    avatar_url: '',
    stripe_connect_account_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/seller/profile');
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
      const response = await api.put('/seller/profile', {
        bio: profile.bio,
        handle: profile.handle
      });
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleStripeOnboard = async () => {
    try {
      const response = await api.post('/seller/stripe/onboard');
      if (response.data.onboarding_url) {
        window.location.href = response.data.onboarding_url;
      }
    } catch (err) {
      console.error('Failed to start Stripe onboarding', err);
      alert('Could not initiate Stripe onboarding. Please try again later.');
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
        <h1 className="text-2xl font-extrabold text-neutral tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your creator identity and payouts.</p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white rounded-2xl border border-secondary/20 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-secondary/10 flex items-center gap-3">
            <Icon name="user" className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-neutral uppercase tracking-widest text-sm">Public Profile</h2>
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
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Creator Handle</label>
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
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email (Private)</label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-4 py-3 border border-secondary/10 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
                    value="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Bio</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-neutral"
                  placeholder="Tell your fans about yourself..."
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
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Payouts Section */}
        <section className="bg-white rounded-2xl border border-secondary/20 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-secondary/10 flex items-center gap-3">
            <Icon name="credit-card" className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-neutral uppercase tracking-widest text-sm">Payouts & Earnings</h2>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-md">
                <h3 className="font-bold text-neutral text-lg mb-2">Stripe Connect</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We use Stripe to securely process your earnings and send payouts. Connect your account to start receiving money.
                </p>
              </div>
              
              {profile.stripe_connect_account_id ? (
                <div className="flex items-center gap-3 px-6 py-3 bg-green-50 border border-green-100 rounded-xl text-green-600 font-bold">
                  <Icon name="check-circle" className="w-5 h-5" />
                  <span>Account Connected</span>
                </div>
              ) : (
                <button
                  onClick={handleStripeOnboard}
                  className="bg-neutral text-white px-8 py-3 rounded-xl font-bold hover:bg-neutral/90 transition shadow-lg flex items-center gap-2"
                >
                  <Icon name="external-link" className="w-4 h-4" />
                  <span>Setup Payouts</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Membership Section */}
        <section className="bg-accent/10 rounded-2xl border border-accent/30 shadow-sm overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-2 py-0.5 bg-accent text-neutral text-[10px] font-extrabold rounded uppercase tracking-tighter">Premium</span>
                <h3 className="font-extrabold text-neutral text-lg">SoleStream Plus</h3>
              </div>
              <p className="text-gray-600 text-sm max-w-sm">
                Unlock automated watermarking, bulk uploads, and deep analytics for just $9.99/mo.
              </p>
            </div>
            <button className="bg-accent text-neutral px-8 py-3 rounded-xl font-extrabold hover:bg-accent/80 transition shadow-lg whitespace-nowrap">
              Upgrade Now
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SellerSettings;
