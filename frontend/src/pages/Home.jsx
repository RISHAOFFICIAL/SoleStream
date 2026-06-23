import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sellerPersona from '../assets/seller-persona.png';
import ListingCard from '../components/marketplace/ListingCard';
import { listingsAPI } from '../services/api';

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await listingsAPI.getListings({ limit: 3 });
        if (data.success) {
          setFeaturedListings(data.listings);
        }
      } catch (err) {
        console.error('Failed to fetch featured listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-5xl md:text-6xl font-extrabold text-neutral tracking-tight mb-6">
                Premium Digital <br />
                <span className="text-primary">Content Packs</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg font-medium">
                High-quality, exclusive digital content delivered instantly. 
                Discreet checkout and secure access to all premium collections.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/browse" 
                  className="bg-primary text-neutral px-8 py-4 rounded-xl font-bold text-lg text-center hover:bg-opacity-90 transition shadow-lg shadow-primary/20"
                >
                  Shop the Collection
                </Link>
                <Link 
                  to="/auth/register" 
                  className="bg-white text-neutral border-2 border-secondary px-8 py-4 rounded-xl font-bold text-lg text-center hover:bg-background transition"
                >
                  Create Account
                </Link>
              </div>
              <div className="mt-10 flex items-center space-x-6 text-sm text-gray-500 font-bold uppercase tracking-widest">
                <div className="flex items-center">
                  <span className="text-primary mr-2">✓</span> Instant Access
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">✓</span> 100% Discreet
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">✓</span> Secure
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <img 
                src={sellerPersona} 
                alt="SoleStream Content" 
                className="w-full max-w-md mx-auto drop-shadow-2xl rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-background py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-neutral mb-4 tracking-tight">Designed for Privacy & Speed</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">We ensure every transaction is fast, secure, and completely anonymous.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-2xl">⚡</div>
              <h3 className="text-xl font-bold mb-4">Instant Delivery</h3>
              <p className="text-gray-500 font-medium">Get your download link immediately after a successful Stripe payment. No waiting.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-2xl">🔒</div>
              <h3 className="text-xl font-bold mb-4">Secure Checkout</h3>
              <p className="text-gray-500 font-medium">Industry-standard encryption via Stripe. Your financial details never touch our servers.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-2xl">🖼️</div>
              <h3 className="text-xl font-bold mb-4">High Resolution</h3>
              <p className="text-gray-500 font-medium">All packs contain full-resolution, unwatermarked original files for the best experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-neutral mb-2 tracking-tight">Featured Packs</h2>
              <p className="text-gray-500 text-lg font-medium">Hand-picked premium collections available now.</p>
            </div>
            <Link to="/browse" className="text-secondary font-bold hover:text-primary transition hidden sm:block">
              View All Content →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5]"></div>
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-background p-12 rounded-2xl text-center">
              <p className="text-gray-500 font-bold uppercase tracking-widest">New packs arriving soon!</p>
            </div>
          )}

          <div className="mt-12 text-center sm:hidden">
            <Link to="/browse" className="inline-block bg-white text-neutral border-2 border-secondary px-8 py-3 rounded-xl font-bold transition">
              View All Content
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-0"></div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 relative z-10 tracking-tight">Access the Full Archive</h2>
            <p className="text-gray-400 mb-10 text-lg relative z-10 font-medium">Join SoleStream today to manage your purchases and get notified of new pack releases.</p>
            <Link 
              to="/auth/register" 
              className="inline-block bg-primary text-neutral px-10 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition relative z-10 shadow-lg shadow-primary/20"
            >
              Join SoleStream
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
