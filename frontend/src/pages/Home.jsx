import React from 'react';
import { Link } from 'react-router-dom';
import sellerPersona from '../assets/seller-persona.png';
import ListingCard from '../components/marketplace/ListingCard';

const FEATURED_LISTINGS = [
  { id: '1', title: 'Soft Sand Stroll', price: '25.00', sellerHandle: 'oceanvibes', previewUrl: '' },
  { id: '2', title: 'Morning Dew', price: '19.99', sellerHandle: 'forestwalk', previewUrl: '' },
  { id: '3', title: 'Silk & Satin', price: '45.00', sellerHandle: 'elegance', previewUrl: '' },
];

const Home = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mb-12 lg:mb-0">
              <h1 className="text-5xl md:text-6xl font-extrabold text-neutral tracking-tight mb-6">
                Automate Your <br />
                <span className="text-primary">Content Sales</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-lg">
                The discreet, professional marketplace for creators. 
                Earn passive income while we handle the listing, payments, 
                and delivery.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/auth/register" 
                  className="bg-primary text-neutral px-8 py-4 rounded-xl font-bold text-lg text-center hover:bg-opacity-90 transition shadow-lg shadow-primary/20"
                >
                  Start Selling
                </Link>
                <Link 
                  to="/browse" 
                  className="bg-white text-neutral border-2 border-secondary px-8 py-4 rounded-xl font-bold text-lg text-center hover:bg-background transition"
                >
                  Browse Marketplace
                </Link>
              </div>
              <div className="mt-10 flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="text-primary mr-2">✓</span> Instant Payouts
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">✓</span> 100% Discreet
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-2">✓</span> AI Support
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <img 
                src={sellerPersona} 
                alt="SoleStream Creator" 
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
            <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-4">Designed for Discretion & Ease</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We built SoleStream to remove the friction of manual DMs and payment chasing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-2xl">💰</div>
              <h3 className="text-xl font-bold mb-4">Passive Income</h3>
              <p className="text-gray-600">List once, sell forever. Our automated checkout handles 100% of the transaction and delivery.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-2xl">🛡️</div>
              <h3 className="text-xl font-bold mb-4">Privacy First</h3>
              <p className="text-gray-600">Secure, anonymous accounts for both buyers and sellers. We never reveal your real identity.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary/10">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 text-2xl">🤖</div>
              <h3 className="text-xl font-bold mb-4">AI Content Ready</h3>
              <p className="text-gray-600">Explicitly supports AI-generated content. Perfect for creators using Ideogram or Kling AI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-neutral mb-2">Featured Packs</h2>
              <p className="text-gray-500 text-lg">Hand-picked collections from our top creators.</p>
            </div>
            <Link to="/browse" className="text-secondary font-bold hover:text-primary transition hidden sm:block">
              View All Marketplace →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_LISTINGS.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link to="/browse" className="inline-block bg-white text-neutral border-2 border-secondary px-8 py-3 rounded-xl font-bold transition">
              View All Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-neutral rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-0"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Ready to join the stream?</h2>
            <p className="text-gray-400 mb-10 text-lg relative z-10">Create your seller profile in under 2 minutes and start earning today.</p>
            <Link 
              to="/auth/register" 
              className="inline-block bg-primary text-neutral px-10 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition relative z-10"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
