import { useState, useEffect, useContext, createContext } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await authService.signIn(email, password);
      await checkUser();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const result = await authService.signUp(email, password, name);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const result = await authService.resetPassword(email);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const confirmResetPassword = async (email, verificationCode, newPassword) => {
    try {
      const result = await authService.confirmResetPassword(email, verificationCode, newPassword);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    confirmResetPassword,
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};