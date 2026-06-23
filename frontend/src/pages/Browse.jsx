import React, { useState, useEffect } from 'react';
import ListingCard from '../components/marketplace/ListingCard';
import { listingsAPI } from '../services/api';

const Browse = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(200);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_listings: 0
  });

  const fetchListings = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        search: searchTerm || undefined,
        max_price: priceRange * 100 // Convert to cents
      };
      
      const data = await listingsAPI.getListings(params);
      if (data.success) {
        setListings(data.listings);
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings(1);
    }, 500); // Debounce search/filter

    return () => clearTimeout(timer);
  }, [searchTerm, priceRange]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchListings(newPage);
    }
  };

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
                max="500" 
                step="10"
                className="w-full accent-primary"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>$0</span>
                <span>$500+</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral mb-2 uppercase tracking-wide">Category</label>
              <div className="space-y-2 text-gray-400 italic text-sm">
                Filters coming soon...
              </div>
            </div>
          </div>
        </aside>

        {/* Listing Grid */}
        <main className="flex-grow">
            <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-neutral">
              All Collections {pagination.total_listings > 0 && (
                <span className="text-gray-400 font-normal ml-2 text-lg">({pagination.total_listings} packs)</span>
              )}
            </h1>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-100 rounded-2xl aspect-[4/5]"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center">
              <p className="font-bold">Error loading listings</p>
              <p className="text-sm">{error}</p>
              <button onClick={() => fetchListings(1)} className="mt-4 text-sm underline">Try again</button>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-cream p-12 rounded-2xl text-center">
              <p className="text-neutral font-medium">No listings found matching your criteria.</p>
              <button 
                onClick={() => { setSearchTerm(''); setPriceRange(200); }} 
                className="mt-4 text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="mt-16 flex justify-center space-x-2">
                  {[...Array(pagination.total_pages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-lg border border-secondary/20 flex items-center justify-center font-bold transition shadow-sm ${
                        pagination.current_page === i + 1 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-gray-400 hover:text-neutral'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Browse;
