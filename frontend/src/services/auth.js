import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AuthService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for token management
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearStoredToken();
          // Optionally redirect to login or emit an event
        }
        return Promise.reject(error);
      }
    );
  }

  getStoredToken() {
    return localStorage.getItem('whatif_auth_token');
  }

  setStoredToken(token) {
    localStorage.setItem('whatif_auth_token', token);
  }

  clearStoredToken() {
    localStorage.removeItem('whatif_auth_token');
    localStorage.removeItem('whatif_user');
  }

  getStoredUser() {
    const userJson = localStorage.getItem('whatif_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  setStoredUser(user) {
    localStorage.setItem('whatif_user', JSON.stringify(user));
  }

  async getCurrentUser() {
    try {
      // First check local storage
      const storedUser = this.getStoredUser();
      const token = this.getStoredToken();
      
      if (!token) {
        return null;
      }

      // Verify token with backend
      const response = await this.client.get('/auth/me');
      
      if (response.data.success) {
        const user = response.data.user;
        this.setStoredUser(user);
        return user;
      }
      
      return null;
    } catch (error) {
      this.clearStoredToken();
      return null;
    }
  }

  async signIn(email, password) {
    try {
      const response = await this.client.post('/auth/signin', {
        email,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data;
        this.setStoredToken(token);
        this.setStoredUser(user);
        return user;
      } else {
        throw new Error(response.data.error || 'Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Sign in failed');
    }
  }

  async signUp(email, password, name) {
    try {
      const response = await this.client.post('/auth/signup', {
        email,
        password,
        name
      });

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Sign up failed');
    }
  }

  async signOut() {
    try {
      const token = this.getStoredToken();
      if (token) {
        await this.client.post('/auth/signout');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      this.clearStoredToken();
    }
  }

  async resetPassword(email) {
    try {
      const response = await this.client.post('/auth/reset-password', {
        email
      });

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Password reset failed');
    }
  }

  async confirmResetPassword(email, verificationCode, newPassword) {
    try {
      const response = await this.client.post('/auth/confirm-reset', {
        email,
        resetToken: verificationCode,
        newPassword
      });

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Password reset confirmation failed');
      }
    } catch (error) {
      console.error('Confirm reset password error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Password reset confirmation failed');
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await this.client.put('/auth/profile', profileData);

      if (response.data.success) {
        // Refresh user data
        const updatedUser = await this.getCurrentUser();
        return updatedUser;
      } else {
        throw new Error(response.data.error || 'Profile update failed');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Profile update failed');
    }
  }

  async getAccessToken() {
    return this.getStoredToken();
  }

  async getUserId() {
    try {
      const user = await this.getCurrentUser();
      return user?.userId;
    } catch (error) {
      return null;
    }
  }

  // Legacy methods for backward compatibility with Amplify
  isAuthenticated() {
    return !!this.getStoredToken();
  }
}

export default new AuthService();