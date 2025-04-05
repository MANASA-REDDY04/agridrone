import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const initAuth = () => {
      const storedUser = authService.getCurrentUser();
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
      
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // Login function
  const login = (userData, accessToken) => {
    // Save user and token to state
    setUser(userData);
    setToken(accessToken);
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
