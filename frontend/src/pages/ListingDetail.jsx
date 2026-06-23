import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listingsAPI, checkoutAPI } from '../services/api';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await listingsAPI.getListing(id);
        if (data.success) {
          setListing(data.listing);
          setMainImage(data.listing.preview_urls?.[0] || '');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handlePurchase = async () => {
    if (!email) {
      alert('Please enter your email for delivery');
      return;
    }

    try {
      setCheckoutLoading(true);
      const data = await checkoutAPI.createSession({
        listing_id: id,
        buyer_email: email
      });

      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
          <div className="aspect-square bg-gray-100 rounded-3xl"></div>
          <div className="space-y-4 mt-8 lg:mt-0">
            <div className="h-10 bg-gray-100 rounded w-3/4"></div>
            <div className="h-6 bg-gray-100 rounded w-1/4"></div>
            <div className="h-32 bg-gray-100 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-neutral mb-4">Listing not found</h2>
        <p className="text-gray-500 mb-8">{error || "The pack you're looking for doesn't exist."}</p>
        <Link to="/browse" className="bg-primary text-neutral px-8 py-3 rounded-xl font-bold">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const price = (listing.price_cents / 100).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-start">
        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-secondary/10 shadow-sm relative group">
            <img 
              src={mainImage || 'https://via.placeholder.com/800?text=SoleStream+Preview'} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-neutral/80 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
              WATERMARKED PREVIEW
            </div>
          </div>
          
          {listing.preview_urls && listing.preview_urls.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {listing.preview_urls.map((url, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition ${mainImage === url ? 'border-primary' : 'border-transparent hover:border-secondary/30'}`}
                  onClick={() => setMainImage(url)}
                >
                  <img 
                    src={url} 
                    alt={`Preview ${i+1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
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
            <Link to={`/seller/${listing.seller_handle}`} className="flex items-center group">
              <div className="w-8 h-8 bg-secondary/30 rounded-full mr-2 group-hover:ring-2 group-hover:ring-primary transition"></div>
              <span className="text-neutral font-bold group-hover:text-primary transition">@{listing.seller_handle}</span>
            </Link>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-neutral">
              Verified Creator
            </span>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
            {listing.description}
          </p>

          <div className="bg-white rounded-3xl p-8 border border-secondary/20 shadow-sm mb-12">
            <div className="flex justify-between items-center mb-8">
              <span className="text-gray-500 font-medium">Pack Price</span>
              <span className="text-3xl font-extrabold text-neutral">${price}</span>
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
                  disabled={checkoutLoading}
                />
                <p className="text-[10px] text-gray-400 mt-2">
                  Content will be delivered instantly to this address after secure checkout.
                </p>
              </div>
              
              <button 
                onClick={handlePurchase}
                disabled={checkoutLoading}
                className="w-full bg-primary text-neutral py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'Preparing Checkout...' : 'Purchase Pack'}
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
            <div>
              <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Format</dt>
              <dd className="text-neutral font-medium">Digital Download (ZIP)</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">License</dt>
              <dd className="text-neutral font-medium">Personal Use</dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
