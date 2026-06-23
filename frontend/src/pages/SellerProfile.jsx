import React from 'react';
import { useParams } from 'react-router-dom';
import ListingCard from '../components/marketplace/ListingCard';

const SellerProfile = () => {
  const { handle } = useParams();

  // Mock data for the seller
  const seller = {
    handle: handle || 'oceanvibes',
    bio: 'Professional wellness and lifestyle photographer specializing in natural beach aesthetics. All content is captured with high-end equipment.',
    avatarUrl: '',
    stats: {
      sales: '1.2k',
      rating: '4.9',
      listings: '24'
    },
    listings: [
      { id: '1', title: 'Soft Sand Stroll', price: '25.00', sellerHandle: handle || 'oceanvibes', previewUrl: '' },
      { id: '2', title: 'Morning Dew', price: '19.99', sellerHandle: handle || 'oceanvibes', previewUrl: '' },
      { id: '3', title: 'Coastal Breeze', price: '30.00', sellerHandle: handle || 'oceanvibes', previewUrl: '' },
    ]
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-white border-b border-secondary/20 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 bg-secondary/20 rounded-full flex-shrink-0 border-4 border-white shadow-sm overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${seller.handle}&background=A8E6CF&color=333333`} alt={seller.handle} />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-extrabold text-neutral">@{seller.handle}</h1>
                <div className="flex justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-primary/20 text-neutral text-xs font-bold rounded-full uppercase tracking-wider">
                    Verified Creator
                  </span>
                  <span className="px-3 py-1 bg-accent/30 text-neutral text-xs font-bold rounded-full uppercase tracking-wider">
                    Top Seller
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 max-w-2xl mb-8 leading-relaxed">
                {seller.bio}
              </p>
              
              <div className="flex justify-center md:justify-start gap-12">
                <div>
                  <div className="text-2xl font-extrabold text-neutral">{seller.stats.listings}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Packs</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-neutral">{seller.stats.sales}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sales</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-neutral">{seller.stats.rating}/5</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-xl font-bold text-neutral mb-8 uppercase tracking-widest">Available Packs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {seller.listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
