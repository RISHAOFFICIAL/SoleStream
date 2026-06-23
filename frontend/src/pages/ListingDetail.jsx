import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ListingDetail = () => {
  const { id } = useParams();
  const [email, setEmail] = useState('');

  // Mock data for the view
  const listing = {
    id: id || '1',
    title: 'Soft Sand Stroll',
    price: '25.00',
    sellerHandle: 'oceanvibes',
    description: 'A high-quality pack featuring 15 unique poses on a pristine white sand beach. Perfect for wellness and lifestyle marketing. Shot with professional gear in soft morning light.',
    assets: [
      { id: 'p1', type: 'preview', url: '' },
      { id: 'p2', type: 'preview', url: '' },
      { id: 'p3', type: 'preview', url: '' },
    ],
    details: [
      { label: 'Photos', value: '15 items' },
      { label: 'Resolution', value: '4K (3840x2160)' },
      { label: 'Format', value: 'JPG (Compressed ZIP)' },
      { label: 'License', value: 'Personal Use' },
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-secondary/10 shadow-sm relative group">
            <img 
              src="https://via.placeholder.com/800?text=SoleStream+Main+Preview" 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-neutral/80 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              WATERMARKED PREVIEW
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {listing.assets.map((asset, i) => (
              <div key={asset.id} className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-secondary/10 cursor-pointer hover:border-primary transition">
                <img 
                  src={`https://via.placeholder.com/300?text=Preview+${i+1}`} 
                  alt={`Preview ${i+1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-12 lg:mt-0">
          <div className="flex items-center space-x-2 mb-4">
            <Link to="/browse" className="text-sm text-gray-500 hover:text-primary transition">Marketplace</Link>
            <span className="text-gray-300 text-xs">/</span>
            <span className="text-sm text-neutral font-medium">{listing.title}</span>
          </div>

          <h1 className="text-4xl font-extrabold text-neutral mb-2">{listing.title}</h1>
          
          <div className="flex items-center space-x-4 mb-8">
            <Link to={`/seller/${listing.sellerHandle}`} className="flex items-center group">
              <div className="w-8 h-8 bg-secondary/30 rounded-full mr-2 group-hover:ring-2 group-hover:ring-primary transition"></div>
              <span className="text-neutral font-bold group-hover:text-primary transition">@{listing.sellerHandle}</span>
            </Link>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-neutral">
              Verified Creator
            </span>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {listing.description}
          </p>

          <div className="bg-white rounded-3xl p-8 border border-secondary/20 shadow-sm mb-12">
            <div className="flex justify-between items-center mb-8">
              <span className="text-gray-500 font-medium">Pack Price</span>
              <span className="text-3xl font-extrabold text-neutral">${listing.price}</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral mb-2 uppercase tracking-wide">
                  Delivery Email
                </label>
                <input 
                  type="email" 
                  placeholder="Enter your email for delivery"
                  className="w-full bg-background border border-secondary/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-[10px] text-gray-400 mt-2">
                  Content will be delivered instantly to this address after secure checkout.
                </p>
              </div>
              
              <button className="w-full bg-primary text-neutral py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition shadow-lg shadow-primary/20">
                Purchase Pack
              </button>
              
              <div className="flex justify-center items-center space-x-4 pt-2">
                <div className="text-[10px] text-gray-400 flex items-center">
                  <span className="mr-1">🔒</span> Encrypted
                </div>
                <div className="text-[10px] text-gray-400 flex items-center">
                  <span className="mr-1">💳</span> Stripe Secure
                </div>
                <div className="text-[10px] text-gray-400 flex items-center">
                  <span className="mr-1">📧</span> Instant Link
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-secondary/10 pt-8">
            {listing.details.map(detail => (
              <div key={detail.label}>
                <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{detail.label}</dt>
                <dd className="text-neutral font-medium">{detail.value}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
