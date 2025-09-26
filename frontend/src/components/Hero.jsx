import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Image, Share2, Sparkles } from 'lucide-react';

const Hero = ({ onGetStarted }) => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: t('hero.features.ai'),
      description: 'Advanced AI analysis with scientific reasoning'
    },
    {
      icon: Image,
      title: t('hero.features.multimedia'),
      description: 'Auto-generated images and videos'
    },
    {
      icon: Share2,
      title: t('hero.features.sharing'),
      description: 'Share across social platforms'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-200"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-400"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Hero badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            {t('app.description')}
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-slide-up">
            <span className="block">{t('hero.title')}</span>
            <span className="block gradient-bg bg-clip-text text-transparent">
              {t('hero.subtitle')}
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            {t('hero.description')}
          </p>

          {/* CTA Button */}
          <div className="mb-16 animate-slide-up animation-delay-400">
            <button
              onClick={onGetStarted}
              className="btn-primary text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {t('hero.cta')}
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 text-center hover:scale-105 transition-transform duration-300 animate-slide-up"
                style={{ animationDelay: `${600 + index * 200}ms` }}
              >
                <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;