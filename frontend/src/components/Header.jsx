import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, User, LogOut } from 'lucide-react';
import AuthModal from './AuthModal';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  const handleProjectsClick = () => {
    navigate('/projects');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="gradient-bg text-white rounded-lg p-2 mr-3">
              <span className="font-bold text-lg">WI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {t('app.title')}
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleHomeClick}
              className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('navigation.home')}
            </button>
            {user && (
              <button 
                onClick={handleProjectsClick}
                className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('navigation.projects')}
              </button>
            )}
            <button 
              onClick={handleAboutClick}
              className="text-gray-700 hover:text-primary-600 transition-colors">
              {t('navigation.about')}
            </button>
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
              title="Change language"
            >
              <Globe size={20} />
              <span className="text-sm font-medium">
                {i18n.language.toUpperCase()}
              </span>
            </button>

            {/* User menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="text-sm font-medium">
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  title={t('navigation.signOut')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleSignInClick}
                className="btn-secondary text-sm">
                {t('navigation.signIn')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  );
};

export default Header;