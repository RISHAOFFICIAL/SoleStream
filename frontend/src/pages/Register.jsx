import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [role, setRole] = useState('buyer'); // 'buyer' or 'seller'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const data = await register({
        email,
        password,
        role,
        handle: role === 'seller' ? handle : undefined
      });

      if (data.success) {
        if (role === 'seller') {
          navigate('/dashboard');
        } else {
          navigate('/browse');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-background">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-secondary/20">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <Logo size={200} />
          </Link>
          <h2 className="text-3xl font-extrabold text-neutral">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Join the professional community
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Role Toggle */}
        <div className="flex p-1 bg-background rounded-2xl border border-secondary/20">
          <button
            type="button"
            onClick={() => setRole('buyer')}
            disabled={loading}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition ${
              role === 'buyer' 
                ? 'bg-white text-neutral shadow-sm' 
                : 'text-gray-400 hover:text-neutral'
            }`}
          >
            I'm a Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            disabled={loading}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition ${
              role === 'seller' 
                ? 'bg-primary text-neutral shadow-sm' 
                : 'text-gray-400 hover:text-neutral'
            }`}
          >
            I'm a Seller
          </button>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {role === 'seller' && (
              <div>
                <label htmlFor="handle" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                  Creator Handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold">@</span>
                  <input
                    id="handle"
                    name="handle"
                    type="text"
                    required={role === 'seller'}
                    className="appearance-none relative block w-full pl-8 pr-4 py-3 border border-secondary/30 placeholder-gray-400 text-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition sm:text-sm bg-background font-bold"
                    placeholder="yourhandle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 ml-1">This will be your public URL: solestream.io/seller/yourhandle</p>
              </div>
            )}

            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-secondary/30 placeholder-gray-400 text-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition sm:text-sm bg-background"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-secondary/30 placeholder-gray-400 text-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition sm:text-sm bg-background"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-secondary/30 placeholder-gray-400 text-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition sm:text-sm bg-background"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="text-[11px] text-gray-400 leading-relaxed text-center px-4">
            By creating an account, you agree to SoleStream's 
            <a href="#" className="underline mx-1">Terms of Service</a> and 
            <a href="#" className="underline mx-1">Privacy Policy</a>.
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-neutral bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? 'Creating account...' 
                : (role === 'seller' ? 'Create Creator Account' : 'Create Buyer Account')}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-bold text-secondary hover:text-neutral transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
