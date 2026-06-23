import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo from '../components/common/Logo';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <nav className="bg-white shadow-sm border-b border-secondary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Logo size={180} />
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/browse" className="text-neutral hover:text-primary transition">Browse</Link>
              <Link to="/auth/login" className="text-neutral hover:text-primary transition">Login</Link>
              <Link to="/auth/register" className="bg-primary text-neutral px-4 py-2 rounded-xl font-medium hover:bg-opacity-90 transition">Sell Content</Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-neutral text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo size={150} className="brightness-0 invert mb-4" />
              <p className="text-gray-400 text-sm">
                The professional marketplace for feet content creators. 
                Discreet, automated, and secure.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/browse" className="hover:text-primary transition">Browse Marketplace</Link></li>
                <li><Link to="/auth/register" className="hover:text-primary transition">Become a Seller</Link></li>
                <li><Link to="/auth/login" className="hover:text-primary transition">Account Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Trust & Privacy</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 SoleStream. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
