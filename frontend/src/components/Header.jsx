import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Globe, User, LogOut } from 'lucide-react';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="gradient-bg text-white rounded-lg p-2 mr-3">
              <span className="font-bold text-lg">WI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              {t('app.title')}
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors ${
                location.pathname === '/' 
                  ? 'text-primary-600 font-medium' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {t('navigation.home')}
            </Link>
            {user && (
              <a href="#projects" className="text-gray-700 hover:text-primary-600 transition-colors">
                {t('navigation.projects')}
              </a>
            )}
            <Link 
              to="/about" 
              className={`transition-colors ${
                location.pathname === '/about' 
                  ? 'text-primary-600 font-medium' 
                  : 'text-gray-700 hover:text-primary-600'
              }`}
            >
              {t('navigation.about')}
            </Link>
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
              <button className="btn-secondary text-sm">
                {t('navigation.signIn')}
              </button>
            )}
          </div>

          {/* Mobile menu button - placeholder for future mobile nav */}
          <div className="md:hidden">
            {/* This can be expanded later for mobile navigation */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;