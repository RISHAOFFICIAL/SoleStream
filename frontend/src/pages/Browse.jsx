import React, { useState } from 'react';
import ListingCard from '../components/marketplace/ListingCard';

const MOCK_LISTINGS = [
  { id: '1', title: 'Soft Sand Stroll', price: '25.00', sellerHandle: 'oceanvibes', previewUrl: '' },
  { id: '2', title: 'Morning Dew', price: '19.99', sellerHandle: 'forestwalk', previewUrl: '' },
  { id: '3', title: 'City Lights', price: '30.00', sellerHandle: 'urbanstyle', previewUrl: '' },
  { id: '4', title: 'Silk & Satin', price: '45.00', sellerHandle: 'elegance', previewUrl: '' },
  { id: '5', title: 'Mountain Peak', price: '22.50', sellerHandle: 'adventure', previewUrl: '' },
  { id: '6', title: 'Sunset Glow', price: '28.00', sellerHandle: 'goldenhour', previewUrl: '' },
];

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold text-neutral mb-6">Filters</h2>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-neutral mb-2 uppercase tracking-wide">Search</label>
              <input 
                type="text" 
                placeholder="Search packs..."
                className="w-full bg-white border border-secondary/30 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-neutral mb-2 uppercase tracking-wide">
                Max Price: ${priceRange}
              </label>
              <input 
                type="range" 
                min="0" 
                max="200" 
                step="5"
                className="w-full accent-primary"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>$0</span>
                <span>$200+</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral mb-2 uppercase tracking-wide">Category</label>
              <div className="space-y-2">
                {['Real Photo', 'AI Generated', 'Themed Pack'].map(cat => (
                  <label key={cat} className="flex items-center space-x-3 cursor-pointer group text-sm">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-gray-600 group-hover:text-neutral">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Listing Grid */}
        <main className="flex-grow">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-neutral">
              Marketplace <span className="text-gray-400 font-normal ml-2 text-lg">({MOCK_LISTINGS.length} packs)</span>
            </h1>
            <select className="bg-transparent border-none text-sm font-bold text-neutral focus:ring-0 cursor-pointer">
              <option>Newest First</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_LISTINGS.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center space-x-2">
            <button className="w-10 h-10 rounded-lg border border-secondary/20 flex items-center justify-center text-neutral font-bold hover:bg-white transition bg-white shadow-sm">1</button>
            <button className="w-10 h-10 rounded-lg border border-secondary/20 flex items-center justify-center text-gray-400 hover:text-neutral hover:bg-white transition">2</button>
            <button className="w-10 h-10 rounded-lg border border-secondary/20 flex items-center justify-center text-gray-400 hover:text-neutral hover:bg-white transition">3</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Browse;
