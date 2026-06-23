import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Icon from '../common/Icon';

const CreateListingModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_cents: '',
  });
  const [files, setFiles] = useState({
    preview_image: null,
    full_resolution_archive: null
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price_cents', formData.price_cents);
    data.append('preview_image', files.preview_image);
    data.append('full_resolution_archive', files.full_resolution_archive);

    try {
      const response = await api.post('/admin/listings', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-neutral/60 backdrop-blur-sm"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-secondary/20">
          <div className="bg-white px-8 pt-8 pb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-neutral tracking-tight">Create New Pack</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-neutral transition">
                <Icon name="x" className="w-6 h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Summer Beach Collection"
                  className="w-full px-4 py-3 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background font-bold text-neutral"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Description (Optional)</label>
                <textarea
                  name="description"
                  rows="3"
                  className="w-full px-4 py-3 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-neutral"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Price (USD Cents)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price_cents"
                    required
                    placeholder="e.g. 2500 for $25.00"
                    className="w-full px-4 py-3 border border-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background font-bold text-neutral"
                    value={formData.price_cents}
                    onChange={handleInputChange}
                  />
                  <div className="absolute right-4 top-3 text-gray-400 text-sm font-bold">¢</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Preview Image (Publicly Visible)</label>
                  <input
                    type="file"
                    name="preview_image"
                    required
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-neutral file:cursor-pointer hover:file:bg-opacity-90"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Pack (ZIP/Archive - Secured)</label>
                  <input
                    type="file"
                    name="full_resolution_archive"
                    required
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-secondary file:text-neutral file:cursor-pointer hover:file:bg-opacity-90"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl font-extrabold text-neutral transition shadow-lg ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary hover:shadow-primary/20 hover:scale-[1.02]'}`}
                >
                  {loading ? 'Uploading Content...' : 'Publish Content Pack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingModal;
