import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class DataService {
  constructor() {
    this.listeners = new Map();
  }

  // Items Collection Methods
  async addItem(itemData) {
    try {
      const docRef = await addDoc(collection(db, 'items'), {
        ...itemData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'available'
      });
      
      return {
        success: true,
        id: docRef.id,
        message: 'Item added successfully!'
      };
    } catch (error) {
      console.error('Add item error:', error);
      return {
        success: false,
        error: 'Failed to add item'
      };
    }
  }

  async updateItem(itemId, updates) {
    try {
      await updateDoc(doc(db, 'items', itemId), {
        ...updates,
        updatedAt: new Date()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Update item error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteItem(itemId) {
    try {
      await deleteDoc(doc(db, 'items', itemId));
      return { success: true };
    } catch (error) {
      console.error('Delete item error:', error);
      return { success: false, error: error.message };
    }
  }

  async getItems() {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return items;
    } catch (error) {
      console.error('Get items error:', error);
      return [];
    }
  }

  async getUserItems(userId) {
    try {
      const q = query(
        collection(db, 'items'), 
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return items;
    } catch (error) {
      console.error('Get user items error:', error);
      return [];
    }
  }

  async getAvailableItems() {
    try {
      const q = query(
        collection(db, 'items'), 
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return items;
    } catch (error) {
      console.error('Get available items error:', error);
      return [];
    }
  }

  // Redemptions Collection Methods
  async addRedemption(redemptionData) {
    try {
      const docRef = await addDoc(collection(db, 'redemptions'), {
        ...redemptionData,
        createdAt: new Date(),
        dateRedeemed: new Date().toISOString().split('T')[0]
      });
      
      // Update item status to redeemed
      await this.updateItem(redemptionData.itemId, { status: 'redeemed' });
      
      return {
        success: true,
        id: docRef.id
      };
    } catch (error) {
      console.error('Add redemption error:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserRedemptions(userId) {
    try {
      const q = query(
        collection(db, 'redemptions'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const redemptions = [];
      querySnapshot.forEach((doc) => {
        redemptions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return redemptions;
    } catch (error) {
      console.error('Get user redemptions error:', error);
      return [];
    }
  }

  // Swap Requests Collection Methods
  async createSwapRequest(swapData) {
    try {
      const docRef = await addDoc(collection(db, 'swapRequests'), {
        ...swapData,
        status: 'pending',
        createdAt: new Date(),
        dateCreated: new Date().toISOString().split('T')[0]
      });
      
      return {
        success: true,
        id: docRef.id
      };
    } catch (error) {
      console.error('Create swap request error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateSwapRequest(requestId, status) {
    try {
      await updateDoc(doc(db, 'swapRequests', requestId), {
        status,
        updatedAt: new Date()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Update swap request error:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserSwapRequests(userId) {
    try {
      const q = query(
        collection(db, 'swapRequests'), 
        where('fromUserId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const requests = [];
      querySnapshot.forEach((doc) => {
        requests.push({
          id: doc.id,
          ...doc.data()
        });
      });
      return requests;
    } catch (error) {
      console.error('Get user swap requests error:', error);
      return [];
    }
  }

  // Real-time listeners
  subscribeToItems(callback) {
    const unsubscribe = onSnapshot(
      query(collection(db, 'items'), orderBy('createdAt', 'desc')),
      (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          });
        });
        callback(items);
      },
      (error) => {
        console.error('Items subscription error:', error);
        callback([]);
      }
    );
    
    this.listeners.set('items', unsubscribe);
    return unsubscribe;
  }

  subscribeToUserItems(userId, callback) {
    const q = query(
      collection(db, 'items'), 
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data()
          });
        });
        callback(items);
      },
      (error) => {
        console.error('User items subscription error:', error);
        callback([]);
      }
    );
    
    this.listeners.set(`userItems_${userId}`, unsubscribe);
    return unsubscribe;
  }

  // Cleanup listeners
  unsubscribeAll() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
  }

  unsubscribe(key) {
    const unsubscribe = this.listeners.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(key);
    }
  }
}

export default new DataService();</parameter>