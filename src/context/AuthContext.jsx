import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser && firebaseUser.emailVerified) {
        // User is signed in and email is verified
        const userData = await authService.getCurrentUserData();
        setUser(userData);
      } else {
        // User is signed out or email not verified
        setUser(null);
      }
      
      setLoading(false);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const result = await authService.register(email, password, name);
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        setUser(result.user);
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const resendVerificationEmail = async () => {
    try {
      return await authService.resendVerificationEmail();
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserPoints = async (newPoints) => {
    if (user) {
      try {
        const result = await authService.updateUserPoints(user.uid, newPoints);
        if (result.success) {
          setUser(prev => ({ ...prev, points: newPoints }));
        }
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'No user logged in' };
  };

  const refreshUser = async () => {
    if (user) {
      const userData = await authService.getCurrentUserData();
      if (userData) {
        setUser(userData);
      }
    }
  };

  const value = {
    user,
    loading,
    initializing,
    register,
    login,
    logout,
    resendVerificationEmail,
    updateUserPoints,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}</parameter>