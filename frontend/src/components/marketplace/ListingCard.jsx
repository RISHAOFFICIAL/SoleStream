import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const { id, title, price_cents, preview_url } = listing;
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
          <div className="absolute inset-0 bg-neutral/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-white text-neutral px-4 py-2 rounded-xl font-bold text-sm shadow-xl">
              View Details
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <Link to={`/listings/${id}`} className="hover:text-primary transition min-w-0">
            <h3 className="font-extrabold text-neutral truncate text-lg tracking-tight">{title}</h3>
          </Link>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-primary font-extrabold text-xl tracking-tighter">${price}</span>
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            SoleStream Original
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
