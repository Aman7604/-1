import React, { useState } from 'react';
import { Upload, X, Plus, Camera, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UploadPage({ onPageChange }) {
  const { user, updateUserPoints } = useAuth();
  const { addItem } = useData();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: 'good',
    pointsValue: 30,
  });
  const [images, setImages] = useState([]);

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const conditions = [
    { value: 'excellent', label: 'Excellent', points: 50, description: 'Like new, no visible wear' },
    { value: 'good', label: 'Good', points: 30, description: 'Minor signs of wear, great condition' },
    { value: 'fair', label: 'Fair', points: 15, description: 'Noticeable wear but still functional' },
  ];

  // Mock images for demonstration
  const mockImages = [
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    'https://images.pexels.com/photos/1619651/pexels-photo-1619651.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
    'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
  ];

  if (!user) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-center glass-dark p-12 rounded-3xl hover-lift">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-gray-300 mb-8">You need to be signed in to upload items.</p>
          <button
            onClick={() => onPageChange('login')}
            className="btn-primary text-white px-8 py-3 rounded-xl hover-lift relative overflow-hidden"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Auto-update points based on condition
    if (name === 'condition') {
      const conditionData = conditions.find(c => c.value === value);
      if (conditionData) {
        setFormData(prev => ({
          ...prev,
          pointsValue: conditionData.points,
        }));
      }
    }
  };

  const handleAddMockImage = () => {
    if (images.length < 4) {
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      setImages(prev => [...prev, randomImage]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      const event = new CustomEvent('showNotification', {
        detail: { 
          type: 'error', 
          message: 'Please add at least one image before uploading!' 
        }
      });
      window.dispatchEvent(event);
      return;
    }

    setLoading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      addItem({
        ...formData,
        images,
        ownerId: user.id,
        ownerName: user.name,
        status: 'available',
      });

      // Award points to user for uploading
      const bonusPoints = 10; // Bonus for uploading
      updateUserPoints(user.points + bonusPoints);

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        size: '',
        condition: 'good',
        pointsValue: 30,
      });
      setImages([]);

      // Show success notification with bonus points info
      const event = new CustomEvent('showNotification', {
        detail: { 
          type: 'success', 
          message: `Item uploaded successfully! You earned ${bonusPoints} bonus points.` 
        }
      });
      window.dispatchEvent(event);
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        onPageChange('dashboard');
      }, 1500);
    } catch (error) {
      const event = new CustomEvent('showNotification', {
        detail: { 
          type: 'error', 
          message: 'Error uploading item. Please try again.' 
        }
      });
      window.dispatchEvent(event);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-dark rounded-3xl shadow-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 pulse-glow">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Upload an Item</h1>
              <p className="text-gray-300 text-lg">Share your unused clothing and earn points</p>
              <div className="mt-6 inline-flex items-center glass px-6 py-3 rounded-2xl border border-emerald-500/30">
                <Sparkles className="w-5 h-5 mr-3 text-emerald-400" />
                <span className="font-medium text-white">You'll earn </span>
                <span className="font-bold gradient-text-accent text-lg mx-1">10 bonus points</span>
                <span className="font-medium text-white"> for uploading + item value when redeemed</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Images */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">
                  Images * <span className="text-gray-400 text-sm">(Demo: Click "Add Image" to add mock images)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddMockImage}
                      className="w-full h-32 glass rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 border-2 border-dashed border-gray-600 hover:border-purple-500"
                    >
                      <Camera className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Add Image</span>
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-3">Add up to 4 images. At least 1 image is required.</p>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-lg font-medium text-white mb-3">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input-modern w-full px-4 py-3 rounded-xl"
                  placeholder="e.g., Vintage Denim Jacket"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-lg font-medium text-white mb-3">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-modern w-full px-4 py-3 rounded-xl resize-none"
                  placeholder="Describe your item in detail..."
                />
                <p className="text-sm text-gray-400 mt-2">Include details about fit, material, brand, and any special features.</p>
              </div>

              {/* Category and Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-lg font-medium text-white mb-3">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input-modern w-full px-4 py-3 rounded-xl"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="size" className="block text-lg font-medium text-white mb-3">
                    Size *
                  </label>
                  <select
                    id="size"
                    name="size"
                    required
                    value={formData.size}
                    onChange={handleInputChange}
                    className="input-modern w-full px-4 py-3 rounded-xl"
                  >
                    <option value="">Select a size</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">
                  Condition *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {conditions.map((condition) => (
                    <label
                      key={condition.value}
                      className={`relative glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover-lift ${
                        formData.condition === condition.value
                          ? 'border-2 border-purple-500 bg-purple-500/10'
                          : 'border border-white/20 hover:border-purple-500/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="condition"
                        value={condition.value}
                        checked={formData.condition === condition.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-xl font-bold text-white mb-2">{condition.label}</div>
                        <div className="text-2xl font-bold gradient-text mb-2">{condition.points} points</div>
                        <div className="text-sm text-gray-400">{condition.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-3">Higher condition items earn more points when redeemed by others.</p>
              </div>

              {/* Points Preview */}
              <div className="glass rounded-2xl p-6 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-semibold text-lg">Estimated Points Value:</span>
                  <span className="text-4xl font-bold gradient-text">{formData.pointsValue}</span>
                </div>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                    You'll earn these points when someone redeems your item
                  </p>
                  <p className="flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    Plus 10 bonus points immediately for uploading!
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-white py-4 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="text-white" />
                    <span className="ml-3">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-3" />
                    Upload Item
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}