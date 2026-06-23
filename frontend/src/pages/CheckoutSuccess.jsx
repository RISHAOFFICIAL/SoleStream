import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/common/Icon';

const CheckoutSuccess = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="mb-10 flex justify-center">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-bounce">
          <Icon size={60} />
        </div>
      </div>
      
      <h1 className="text-4xl font-extrabold text-neutral mb-4">Payment Successful!</h1>
      <p className="text-xl text-gray-600 mb-12">
        Thank you for your purchase. Your content is ready for immediate download.
      </p>

      <div className="bg-white rounded-3xl p-10 border border-secondary/20 shadow-sm mb-12 text-left">
        <h2 className="text-xl font-bold text-neutral mb-6">Your Order</h2>
        
        <div className="flex items-center justify-between py-4 border-b border-secondary/10">
          <div>
            <div className="font-bold text-neutral text-lg">Soft Sand Stroll</div>
            <div className="text-sm text-gray-500">Full Pack (15 Items)</div>
          </div>
          <button className="bg-primary text-neutral px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition shadow-md shadow-primary/10">
            Download ZIP
          </button>
        </div>

        <div className="mt-10 p-6 bg-background rounded-2xl border border-secondary/10">
          <div className="flex items-start">
            <span className="text-2xl mr-4">📧</span>
            <div>
              <div className="font-bold text-neutral mb-1">Check your email</div>
              <p className="text-sm text-gray-500 leading-relaxed">
                We've sent a permanent download link and your receipt to your email address. 
                The link will remain active for 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          to="/browse" 
          className="bg-neutral text-white px-8 py-4 rounded-xl font-bold transition hover:bg-black"
        >
          Continue Shopping
        </Link>
        <Link 
          to="/" 
          className="text-neutral font-bold px-8 py-4 hover:text-primary transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
