import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ListingCard from '../components/marketplace/ListingCard';
import { sellersAPI } from '../services/api';

const SellerProfile = () => {
  const { handle } = useParams();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        setLoading(true);
        const data = await sellersAPI.getSeller(handle);
        if (data.success) {
          setProfile(data.profile);
          setListings(data.listings);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [handle]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen animate-pulse">
        <div className="bg-white border-b border-secondary/20 pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 bg-gray-100 rounded-full"></div>
              <div className="flex-grow space-y-4">
                <div className="h-10 bg-gray-100 rounded w-1/4"></div>
                <div className="h-20 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-neutral mb-4">Seller not found</h2>
        <p className="text-gray-500">{error || "The creator you're looking for doesn't exist."}</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-white border-b border-secondary/20 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 bg-secondary/20 rounded-full flex-shrink-0 border-4 border-white shadow-sm overflow-hidden">
              <img 
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.handle}&background=A8E6CF&color=333333`} 
                alt={profile.handle} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-extrabold text-neutral">@{profile.handle}</h1>
                <div className="flex justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-primary/20 text-neutral text-xs font-bold rounded-full uppercase tracking-wider">
                    Verified Creator
                  </span>
                  {profile.is_premium && (
                    <span className="px-3 py-1 bg-accent/30 text-neutral text-xs font-bold rounded-full uppercase tracking-wider">
                      Premium
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 max-w-2xl mb-8 leading-relaxed whitespace-pre-wrap">
                {profile.bio || "No bio provided."}
              </p>
              
              <div className="flex justify-center md:justify-start gap-12">
                <div>
                  <div className="text-2xl font-extrabold text-neutral">{listings.length}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Packs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-xl font-bold text-neutral mb-8 uppercase tracking-widest">Available Packs</h2>
        
        {listings.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-secondary/10">
            <p className="text-gray-500">This creator hasn't published any packs yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;
