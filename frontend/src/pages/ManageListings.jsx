import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Icon from '../components/common/Icon';
import CreateListingModal from '../components/dashboard/CreateListingModal';

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/listings');
      if (response.data.success) {
        setListings(response.data.listings);
      }
    } catch (err) {
      console.error('Failed to fetch listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleArchive = async (id) => {
    if (!window.confirm('Are you sure you want to archive this listing? It will no longer be visible to buyers.')) return;
    
    try {
      const response = await api.delete(`/admin/listings/${id}`);
      if (response.data.success) {
        fetchListings();
      }
    } catch (err) {
      console.error('Failed to archive listing', err);
    }
  };

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral tracking-tight">Content Inventory</h1>
          <p className="text-gray-500 mt-1">Manage your photo packs and pricing.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary px-6 py-3 rounded-xl font-bold text-neutral shadow-lg shadow-primary/20 hover:scale-[1.02] transition flex items-center gap-2"
        >
          <Icon name="plus" className="w-5 h-5" />
          <span>Add New Pack</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-secondary/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="p-20 text-center">
            <Icon name="package" className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral">No content packs yet</h3>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto">Upload your first pack to start your storefront.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Get started now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background border-b border-secondary/20">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Listing</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-background/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral">{listing.title}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{listing.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        listing.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral">
                      ${formatPrice(listing.price_cents)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(listing.created_at * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-neutral transition">
                          <Icon name="edit-2" className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleArchive(listing.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition"
                        >
                          <Icon name="trash-2" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateListingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchListings}
      />
    </div>
  );
};

export default ManageListings;
