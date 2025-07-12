import React, { useState } from 'react';
import { Star, Package, History, Settings, Edit3, Plus, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ItemCard from '../components/ItemCard';

export default function Dashboard({ onPageChange }) {
  const { user, refreshUser } = useAuth();
  const { getUserItems, getUserRedemptions, swapRequests, items } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  // Refresh user data when component mounts
  React.useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  if (!user) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-center glass-dark p-12 rounded-3xl hover-lift">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Please Sign In</h2>
          <p className="text-gray-300 mb-8">You need to be signed in to view your dashboard.</p>
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

  const userItems = getUserItems(user.id);
  const userSwapRequests = swapRequests.filter(req => req.fromUserId === user.id || req.toUserId === user.id);
  const userRedemptions = getUserRedemptions(user.id);

  const stats = [
    {
      title: 'Total Points',
      value: user.points,
      icon: Star,
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Items Listed',
      value: userItems.length,
      icon: Package,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Items Redeemed',
      value: userRedemptions.length,
      icon: History,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Swap Requests',
      value: userSwapRequests.length,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'items', label: 'My Items' },
    { id: 'swaps', label: 'Swap Requests' },
    { id: 'history', label: 'Redemption History' },
  ];

  const handleItemSelect = (item) => {
    console.log('Selected item:', item);
  };

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="glass-dark rounded-3xl shadow-2xl p-8 mb-8 hover-lift">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold pulse-glow">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                <p className="text-gray-300 text-lg">{user.email}</p>
                <p className="text-sm gradient-text-accent font-semibold">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="btn-secondary text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover-lift">
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => onPageChange('upload')}
                className="btn-primary text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover-lift relative overflow-hidden"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card-modern rounded-2xl p-6 hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-2">{stat.title}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center pulse-glow`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="glass-dark rounded-3xl shadow-2xl">
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-8 pt-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass rounded-2xl p-6 border border-emerald-500/30">
                    <h4 className="font-semibold text-emerald-400 mb-2">Total Earnings</h4>
                    <p className="text-3xl font-bold gradient-text">{user.points} points</p>
                    <p className="text-sm text-gray-400 mt-1">From uploaded items</p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-blue-500/30">
                    <h4 className="font-semibold text-blue-400 mb-2">Items Active</h4>
                    <p className="text-3xl font-bold gradient-text">{userItems.filter(item => item.status === 'available').length}</p>
                    <p className="text-sm text-gray-400 mt-1">Currently listed</p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-purple-500/30">
                    <h4 className="font-semibold text-purple-400 mb-2">Items Redeemed</h4>
                    <p className="text-3xl font-bold gradient-text">{userRedemptions.length}</p>
                    <p className="text-sm text-gray-400 mt-1">Successfully obtained</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-6">Recently Uploaded Items</h3>
                  <div className="space-y-4">
                    {userItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="glass rounded-2xl p-6 hover-lift">
                        <div className="flex items-center space-x-4">
                          <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                          <div className="flex-1">
                            <h4 className="font-medium text-white text-lg">{item.title}</h4>
                            <p className="text-sm text-gray-400">Listed on {new Date(item.dateUploaded).toLocaleDateString()}</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                              item.status === 'available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              item.status === 'redeemed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold gradient-text">{item.pointsValue}</span>
                            <p className="text-sm text-gray-400">points</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {userItems.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Package className="w-10 h-10 text-white" />
                        </div>
                        <h4 className="text-xl font-medium text-white mb-2">No items uploaded yet</h4>
                        <p className="text-gray-400 mb-6">Start by uploading your first item to earn points!</p>
                        <button
                          onClick={() => onPageChange('upload')}
                          className="btn-primary text-white px-6 py-3 rounded-xl hover-lift relative overflow-hidden"
                        >
                          Upload Your First Item
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {userRedemptions.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-6">Recent Redemptions</h3>
                    <div className="space-y-4">
                      {userRedemptions.slice(0, 3).map((redemption) => {
                        const item = items.find(i => i.id === redemption.itemId);
                        return (
                          <div key={redemption.id} className="glass rounded-2xl p-6 border border-blue-500/30 hover-lift">
                            <div className="flex items-center space-x-4">
                              {item && (
                                <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                              )}
                              <div className="flex-1">
                                <h4 className="font-medium text-white text-lg">{item?.title || 'Item not found'}</h4>
                                <p className="text-sm text-gray-400">Redeemed on {new Date(redemption.dateRedeemed).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl font-bold text-blue-400">-{redemption.pointsSpent}</span>
                                <p className="text-sm text-gray-400">points spent</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'items' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-semibold text-white">My Listed Items</h3>
                  <button
                    onClick={() => onPageChange('upload')}
                    className="btn-primary text-white px-6 py-3 rounded-xl hover-lift relative overflow-hidden"
                  >
                    Add New Item
                  </button>
                </div>
                {userItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userItems.map((item) => (
                      <ItemCard key={item.id} item={item} showOwner={false} onSelect={handleItemSelect} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Package className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-2xl font-medium text-white mb-4">No items listed yet</h4>
                    <p className="text-gray-400 mb-8 text-lg">Start by uploading your first item to earn points!</p>
                    <button
                      onClick={() => onPageChange('upload')}
                      className="btn-primary text-white px-8 py-4 rounded-xl hover-lift relative overflow-hidden"
                    >
                      Upload Your First Item
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'swaps' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-8">Swap Requests</h3>
                {userSwapRequests.length > 0 ? (
                  <div className="space-y-4">
                    {userSwapRequests.map((request) => (
                      <div key={request.id} className="glass rounded-2xl p-6 hover-lift">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-white text-lg">
                            {request.fromUserId === user.id ? 'Outgoing Request' : 'Incoming Request'}
                          </h4>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            request.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-gray-300">Request ID: {request.id}</p>
                        <p className="text-sm text-gray-400">Created: {new Date(request.dateCreated).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <TrendingUp className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-2xl font-medium text-white mb-4">No swap requests yet</h4>
                    <p className="text-gray-400 text-lg">Browse items and send swap requests to get started!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-2xl font-semibold text-white mb-8">Redemption History</h3>
                {userRedemptions.length > 0 ? (
                  <div className="space-y-4">
                    {userRedemptions.map((redemption) => {
                      const item = items.find(i => i.id === redemption.itemId);
                      return (
                        <div key={redemption.id} className="glass rounded-2xl p-6 hover-lift">
                          <div className="flex items-center space-x-4">
                            {item && (
                              <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-white text-lg">{item?.title || 'Item not found'}</h4>
                              <p className="text-gray-300">Redeemed for {redemption.pointsSpent} points</p>
                              <p className="text-sm text-gray-400">Date: {new Date(redemption.dateRedeemed).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-bold text-blue-400">-{redemption.pointsSpent}</span>
                              <p className="text-sm text-gray-400">points spent</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <History className="w-12 h-12 text-white" />
                    </div>
                    <h4 className="text-2xl font-medium text-white mb-4">No redemptions yet</h4>
                    <p className="text-gray-400 mb-8 text-lg">Browse items and use your points to redeem something amazing!</p>
                    <button
                      onClick={() => onPageChange('browse')}
                      className="btn-primary text-white px-8 py-4 rounded-xl hover-lift relative overflow-hidden"
                    >
                      Browse Items
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}