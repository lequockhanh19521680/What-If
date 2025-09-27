import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  Check, 
  ArrowLeft, 
  KeyRound,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { signIn, signUp, resetPassword, confirmResetPassword } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    verificationCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      verificationCode: ''
    });
    setError('');
    setSuccess('');
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const validateForm = () => {
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
      if (!formData.name.trim()) {
        setError('Name is required');
        return false;
      }
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      switch (mode) {
        case 'signin':
          await signIn(formData.email, formData.password);
          setSuccess('Successfully signed in!');
          setTimeout(() => onClose(), 1500);
          break;
          
        case 'signup':
          await signUp(formData.email, formData.password, formData.name);
          setSuccess('Account created! Please check your email for verification.');
          setTimeout(() => handleModeChange('signin'), 2000);
          break;
          
        case 'forgot':
          await resetPassword(formData.email);
          setSuccess('Password reset code sent to your email!');
          setMode('reset');
          break;
          
        case 'reset':
          await confirmResetPassword(formData.email, formData.verificationCode, formData.password);
          setSuccess('Password reset successful! You can now sign in.');
          setTimeout(() => handleModeChange('signin'), 2000);
          break;
          
        default:
          throw new Error('Invalid mode');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
      case 'reset': return 'Enter New Password';
      default: return 'Sign In';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signin': return 'Sign in to your account to continue';
      case 'signup': return 'Create a new account to get started';
      case 'forgot': return 'Enter your email to receive a reset code';
      case 'reset': return 'Enter the code from your email and new password';
      default: return '';
    }
  };

  const benefits = [
    { icon: Check, text: 'Unlimited content generation' },
    { icon: Check, text: 'Project history & management' },
    { icon: Check, text: 'Priority processing' },
    { icon: Check, text: 'Advanced features & settings' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full p-0 relative animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
          
          {mode !== 'signin' && (
            <button
              onClick={() => handleModeChange('signin')}
              className="absolute top-4 left-4 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <div className="text-center">
            <div className="mb-4">
              {mode === 'forgot' || mode === 'reset' ? (
                <KeyRound size={32} className="mx-auto" />
              ) : mode === 'signup' ? (
                <User size={32} className="mx-auto" />
              ) : (
                <Shield size={32} className="mx-auto" />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">{getTitle()}</h2>
            <p className="text-blue-100 text-sm">{getDescription()}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Benefits - only show for signin/signup */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2 text-blue-700">
                    <benefit.icon size={16} />
                    <span className="text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg mb-6">
              <Check size={20} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field - signup only */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email field - all modes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Verification Code - reset mode only */}
            {mode === 'reset' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Enter 6-digit code"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password field - signin, signup, reset */}
            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder={mode === 'reset' ? 'Enter new password' : 'Enter your password'}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* Confirm Password - signup and reset only */}
            {(mode === 'signup' || mode === 'reset') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <span>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Code'}
                  {mode === 'reset' && 'Reset Password'}
                </span>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 space-y-3">
            {mode === 'signin' && (
              <>
                <div className="text-center">
                  <button
                    onClick={() => handleModeChange('forgot')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 text-sm">Don't have an account? </span>
                  <button
                    onClick={() => handleModeChange('signup')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div className="text-center">
                <span className="text-gray-600 text-sm">Already have an account? </span>
                <button
                  onClick={() => handleModeChange('signin')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="text-center">
                <span className="text-gray-600 text-sm">Remember your password? </span>
                <button
                  onClick={() => handleModeChange('signin')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Back to sign in
                </button>
              </div>
            )}

            {mode === 'reset' && (
              <div className="text-center">
                <button
                  onClick={() => handleModeChange('forgot')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Didn't receive code? Resend
                </button>
              </div>
            )}
          </div>

          {/* Social auth - only for signin/signup */}
          {(mode === 'signin' || mode === 'signup') && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-gray-500 text-sm mb-4">
                Or continue with
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  className="btn-secondary text-sm py-3 flex items-center justify-center space-x-2 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google</span>
                </button>
                <button 
                  type="button"
                  className="btn-secondary text-sm py-3 flex items-center justify-center space-x-2 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          )}

          {/* Security note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <Shield size={12} className="inline mr-1" />
              Your data is protected with enterprise-grade security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;