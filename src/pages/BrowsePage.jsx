import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X, Star, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

export default function BrowsePage({ onPageChange }) {
  const { getAvailableItems, redeemItem } = useData();
  const { user, updateUserPoints } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const availableItems = getAvailableItems();

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const conditions = ['excellent', 'good', 'fair'];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = availableItems.filter(item => {
      // Don't show user's own items
      if (user && item.ownerId === user.id) return false;

      // Search filter
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !item.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory && item.category !== selectedCategory) return false;
      
      // Size filter
      if (selectedSize && item.size !== selectedSize) return false;
      
      // Condition filter
      if (selectedCondition && item.condition !== selectedCondition) return false;
      
      return true;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime();
        case 'oldest':
          return new Date(a.dateUploaded).getTime() - new Date(b.dateUploaded).getTime();
        case 'points-low':
          return a.pointsValue - b.pointsValue;
        case 'points-high':
          return b.pointsValue - a.pointsValue;
        default:
          return 0;
      }
    });

    return filtered;
  }, [availableItems, searchTerm, selectedCategory, selectedSize, selectedCondition, sortBy, user]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedCondition('');
    setSortBy('newest');
  };

  const handleRedeemItem = (item) => {
    if (!user) {
      onPageChange('login');
      return;
    }

    if (user.points >= item.pointsValue) {
      redeemItem(user.id, item.id, item.pointsValue);
      updateUserPoints(user.points - item.pointsValue);
      setSelectedItem(null);
    } else {
      // Show error notification
      const event = new CustomEvent('showNotification', {
        detail: { 
          type: 'error', 
          message: `You need ${item.pointsValue - user.points} more points to redeem this item!` 
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Browse Items</h1>
          <p className="text-gray-300 text-lg">Discover amazing clothing items from our community</p>
          {user && (
            <div className="mt-6 inline-flex items-center glass px-6 py-3 rounded-2xl border border-emerald-500/30">
              <Sparkles className="w-5 h-5 mr-3 text-emerald-400" />
              <span className="font-medium text-white">You have </span>
              <span className="font-bold gradient-text-accent text-lg ml-1">{user.points} points</span>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="glass-dark rounded-2xl shadow-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern w-full pl-12 pr-4 py-3 rounded-xl"
              />
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-modern w-full px-4 py-3 rounded-xl"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="points-low">Points: Low to High</option>
                <option value="points-high">Points: High to Low</option>
              </select>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary text-white px-6 py-3 rounded-xl flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-modern w-full px-3 py-2 rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="input-modern w-full px-3 py-2 rounded-lg"
                  >
                    <option value="">All Sizes</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="input-modern w-full px-3 py-2 rounded-lg"
                  >
                    <option value="">All Conditions</option>
                    {conditions.map(condition => (
                      <option key={condition} value={condition}>
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-300 border border-white/20 rounded-lg hover:bg-white/10 transition-colors duration-300"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-300 text-lg">
            Showing <span className="font-semibold gradient-text-accent">{filteredAndSortedItems.length}</span> of <span className="font-semibold">{availableItems.length}</span> items
          </p>
        </div>

        {/* Items Grid */}
        {filteredAndSortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onSelect={setSelectedItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-medium text-white mb-4">No items found</h3>
            <p className="text-gray-400 mb-8 text-lg">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="btn-primary text-white px-8 py-4 rounded-xl hover-lift relative overflow-hidden"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-dark rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <h2 className="text-3xl font-bold text-white">{selectedItem.title}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={selectedItem.images[0]}
                    alt={selectedItem.title}
                    className="w-full h-80 object-cover rounded-2xl"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-300 mb-3 text-lg">Description</h3>
                    <p className="text-gray-200 leading-relaxed">{selectedItem.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-4 rounded-xl">
                      <span className="text-sm font-medium text-gray-400">Category</span>
                      <p className="text-white font-semibold">{selectedItem.category}</p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <span className="text-sm font-medium text-gray-400">Size</span>
                      <p className="text-white font-semibold">{selectedItem.size}</p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <span className="text-sm font-medium text-gray-400">Condition</span>
                      <p className="text-white font-semibold capitalize">{selectedItem.condition}</p>
                    </div>
                    <div className="glass p-4 rounded-xl">
                      <span className="text-sm font-medium text-gray-400">Owner</span>
                      <p className="text-white font-semibold">{selectedItem.ownerName}</p>
                    </div>
                  </div>

                  <div className="glass p-6 rounded-xl border border-purple-500/30">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      <span className="text-2xl font-bold gradient-text">{selectedItem.pointsValue} points</span>
                    </div>
                  </div>

                  {user && (
                    <div className="space-y-4">
                      <div className="glass p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Your current points:</span>
                          <span className="font-bold gradient-text-accent">{user.points}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Item cost:</span>
                          <span className="font-bold text-white">{selectedItem.pointsValue}</span>
                        </div>
                        <hr className="my-3 border-white/10" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-300">After redemption:</span>
                          <span className={`font-bold text-lg ${user.points >= selectedItem.pointsValue ? 'gradient-text-accent' : 'text-red-400'}`}>
                            {user.points - selectedItem.pointsValue}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRedeemItem(selectedItem)}
                        disabled={user.points < selectedItem.pointsValue}
                        className="w-full btn-primary text-white py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      >
                        {user.points < selectedItem.pointsValue 
                          ? `Need ${selectedItem.pointsValue - user.points} more points`
                          : `Redeem for ${selectedItem.pointsValue} points`
                        }
                      </button>
                      <button className="w-full btn-secondary text-white py-4 rounded-xl font-semibold">
                        Send Swap Request
                      </button>
                    </div>
                  )}

                  {!user && (
                    <button
                      onClick={() => {
                        setSelectedItem(null);
                        onPageChange('login');
                      }}
                      className="w-full btn-primary text-white py-4 rounded-xl font-semibold hover-lift relative overflow-hidden"
                    >
                      Sign In to Redeem
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}