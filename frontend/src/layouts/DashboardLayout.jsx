import React from 'react';
import { Link, Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-white border-r border-secondary/20 min-h-screen hidden md:block">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-neutral">Sole</span>
            <span className="text-primary font-light">Stream</span>
          </Link>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <NavLink to="/dashboard" end className={({ isActive }) => `block px-4 py-2 rounded-xl transition ${isActive ? 'bg-primary text-neutral' : 'text-neutral hover:bg-accent/50'}`}>
            Overview
          </NavLink>
          <NavLink to="/dashboard/listings" className={({ isActive }) => `block px-4 py-2 rounded-xl transition ${isActive ? 'bg-primary text-neutral' : 'text-neutral hover:bg-accent/50'}`}>
            My Listings
          </NavLink>
          <NavLink to="/dashboard/orders" className={({ isActive }) => `block px-4 py-2 rounded-xl transition ${isActive ? 'bg-primary text-neutral' : 'text-neutral hover:bg-accent/50'}`}>
            Orders
          </NavLink>
          <NavLink to="/dashboard/settings" className={({ isActive }) => `block px-4 py-2 rounded-xl transition ${isActive ? 'bg-primary text-neutral' : 'text-neutral hover:bg-accent/50'}`}>
            Settings
          </NavLink>
        </nav>
      </aside>
      <div className="flex-grow flex flex-col">
        <header className="bg-white h-16 border-b border-secondary/20 flex items-center justify-end px-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Seller Account</span>
            <div className="w-8 h-8 rounded-full bg-secondary"></div>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
