import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const { id, title, price_cents, preview_url, seller_handle } = listing;
  const price = (price_cents / 100).toFixed(2);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-secondary/10 overflow-hidden hover:shadow-md transition group">
      <Link to={`/listings/${id}`} className="block relative">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img 
            src={preview_url || 'https://via.placeholder.com/400?text=SoleStream'} 
            alt={title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-neutral/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white text-neutral px-4 py-2 rounded-lg font-bold text-sm">
              View Pack
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/listings/${id}`} className="hover:text-primary transition">
            <h3 className="font-bold text-neutral truncate pr-2">{title}</h3>
          </Link>
          <span className="text-primary font-bold">${price}</span>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Link 
            to={`/seller/${seller_handle}`} 
            className="text-sm text-gray-500 hover:text-neutral flex items-center"
          >
            <div className="w-5 h-5 bg-secondary/30 rounded-full mr-2"></div>
            @{seller_handle}
          </Link>
          <Link 
            to={`/listings/${id}`}
            className="text-xs font-bold uppercase tracking-wider text-secondary hover:text-neutral"
          >
            Unlock →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
