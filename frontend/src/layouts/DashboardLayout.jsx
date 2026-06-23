import React from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-white border-r border-secondary/20 min-h-screen hidden md:block">
        <div className="p-6 mb-4">
          <Link to="/">
            <Logo size={180} />
          </Link>
        </div>
        <nav className="px-4 space-y-1">
          <NavLink to="/dashboard" end className={({ isActive }) => `block px-4 py-3 rounded-xl font-bold transition ${isActive ? 'bg-primary text-neutral shadow-sm' : 'text-gray-500 hover:bg-secondary/10 hover:text-neutral'}`}>
            Admin Overview
          </NavLink>
          <NavLink to="/dashboard/listings" className={({ isActive }) => `block px-4 py-3 rounded-xl font-bold transition ${isActive ? 'bg-primary text-neutral shadow-sm' : 'text-gray-500 hover:bg-secondary/10 hover:text-neutral'}`}>
            Manage Store
          </NavLink>
          <NavLink to="/dashboard/orders" className={({ isActive }) => `block px-4 py-3 rounded-xl font-bold transition ${isActive ? 'bg-primary text-neutral shadow-sm' : 'text-gray-500 hover:bg-secondary/10 hover:text-neutral'}`}>
            Sales History
          </NavLink>
          <NavLink to="/dashboard/settings" className={({ isActive }) => `block px-4 py-3 rounded-xl font-bold transition ${isActive ? 'bg-primary text-neutral shadow-sm' : 'text-gray-500 hover:bg-secondary/10 hover:text-neutral'}`}>
            Site Settings
          </NavLink>
        </nav>
        <div className="absolute bottom-8 left-4 right-4">
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <div className="flex-grow flex flex-col">
        <header className="bg-white h-16 border-b border-secondary/20 flex items-center justify-between px-8">
          <div className="md:hidden">
            <Link to="/">
              <Logo size={140} />
            </Link>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-neutral">Store Owner</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrator</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-neutral border-2 border-white shadow-sm">
              A
            </div>
          </div>
        </header>
        <main className="flex-grow overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
