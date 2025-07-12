import React, { createContext, useContext, useState, useEffect } from 'react';
import dataService from '../services/dataService';
import authService from '../services/authService';
import { useAuth } from './AuthContext';

const DataContext = createContext(undefined);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load initial data and set up real-time listeners
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load all items
        const allItems = await dataService.getItems();
        setItems(allItems);

        // Set up real-time listener for items
        const unsubscribeItems = dataService.subscribeToItems((updatedItems) => {
          setItems(updatedItems);
        });

        setLoading(false);

        // Cleanup function
        return () => {
          unsubscribeItems();
        };
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();

    // Cleanup on unmount
    return () => {
      dataService.unsubscribeAll();
    };
  }, []);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      const loadUserData = async () => {
        try {
          // Load user items
          const userItemsData = await dataService.getUserItems(user.uid);
          setUserItems(userItemsData);

          // Load user redemptions
          const userRedemptions = await dataService.getUserRedemptions(user.uid);
          setRedemptions(userRedemptions);

          // Load user swap requests
          const userSwaps = await dataService.getUserSwapRequests(user.uid);
          setSwapRequests(userSwaps);

          // Set up real-time listener for user items
          const unsubscribeUserItems = dataService.subscribeToUserItems(user.uid, (updatedUserItems) => {
            setUserItems(updatedUserItems);
          });

          return () => {
            unsubscribeUserItems();
          };
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      };

      loadUserData();
    } else {
      // Clear user data when logged out
      setUserItems([]);
      setRedemptions([]);
      setSwapRequests([]);
    }
  }, [user]);

  const addItem = async (itemData) => {
    try {
      const result = await dataService.addItem(itemData);
      if (result.success) {
        // Show success notification
        const event = new CustomEvent('showNotification', {
          detail: { 
            type: 'success', 
            message: result.message || 'Item added successfully!'
          }
        });
        window.dispatchEvent(event);
        
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // Show error notification
      const event = new CustomEvent('showNotification', {
        detail: { 
          type: 'error', 
          message: error.message || 'Failed to add item'
        }
      });
      window.dispatchEvent(event);
      
      return { success: false, error: error.message };
    }
  };

  const updateItem = async (id, updates) => {
    try {
      return await dataService.updateItem(id, updates);
    } catch (error) {
      console.error('Error updating item:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteItem = async (id) => {
    try {
      return await dataService.deleteItem(id);
    } catch (error) {
      console.error('Error deleting item:', error);
      return { success: false, error: error.message };
    }
  };

  const redeemItem = async (userId, itemId, pointsSpent) => {
    try {
      const redemptionData = {
        userId,
        itemId,
        pointsSpent
      };
      
      const result = await dataService.addRedemption(redemptionData);
      if (result.success) {
        // Update user points
        if (user) {
          await authService.updateUserPoints(user.uid, user.points - pointsSpent);
        }
        
        // Show success notification
        const item = items.find(i => i.id === itemId);
        const event = new CustomEvent('showNotification', {
          detail: { 
            type: 'success', 
            message: `Successfully redeemed "${item?.title}" for ${pointsSpent} points!`
          }
        });
        window.dispatchEvent(event);
        
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // Show error notification
      const event = new CustomEvent('showNotification', {
        detail: { 
          type: 'error', 
          message: error.message || 'Failed to redeem item'
        }
      });
      window.dispatchEvent(event);
      
      return { success: false, error: error.message };
    }
  };

  const createSwapRequest = async (swapData) => {
    try {
      return await dataService.createSwapRequest(swapData);
    } catch (error) {
      console.error('Error creating swap request:', error);
      return { success: false, error: error.message };
    }
  };

  const updateSwapRequest = async (id, status) => {
    try {
      return await dataService.updateSwapRequest(id, status);
    } catch (error) {
      console.error('Error updating swap request:', error);
      return { success: false, error: error.message };
    }
  };

  // Helper functions
  const getUserItems = (userId) => {
    return userItems.filter(item => item.ownerId === userId);
  };

  const getUserRedemptions = (userId) => {
    return redemptions.filter(redemption => redemption.userId === userId);
  };

  const getAvailableItems = () => {
    return items.filter(item => item.status === 'available');
  };

  const value = {
    items,
    userItems,
    swapRequests,
    redemptions,
    loading,
    addItem,
    updateItem,
    deleteItem,
    createSwapRequest,
    updateSwapRequest,
    redeemItem,
    getUserItems,
    getUserRedemptions,
    getAvailableItems,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}