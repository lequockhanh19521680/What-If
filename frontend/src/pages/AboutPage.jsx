import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Brain, 
  Sparkles, 
  Users, 
  Target, 
  Lightbulb, 
  Globe, 
  ChevronDown,
  Star,
  Zap,
  Heart,
  ArrowRight
} from 'lucide-react';

const AboutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionsRef = useRef([]);

  useEffect(() => {
    const observers = [];
    
    sectionsRef.current.forEach((section, index) => {
      if (section) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisibleSections(prev => new Set([...prev, index]));
            }
          },
          { threshold: 0.1, rootMargin: '50px' }
        );
        observer.observe(section);
        observers.push(observer);
      }
    });

    return () => observers.forEach(observer => observer.disconnect());
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const features = [
    {
      icon: Brain,
      title: t('about.features.ai.title'),
      description: t('about.features.ai.description'),
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Sparkles,
      title: t('about.features.multimedia.title'),
      description: t('about.features.multimedia.description'),
      color: 'from-pink-500 to-purple-500'
    },
    {
      icon: Globe,
      title: t('about.features.sharing.title'),
      description: t('about.features.sharing.description'),
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const stats = [
    { number: '10,000+', label: t('about.stats.scenarios') },
    { number: '50+', label: t('about.stats.countries') },
    { number: '98%', label: t('about.stats.satisfaction') },
    { number: '24/7', label: t('about.stats.availability') }
  ];

  const team = [
    {
      name: 'AI Research Team',
      role: t('about.team.ai.role'),
      description: t('about.team.ai.description')
    },
    {
      name: 'Creative Team',
      role: t('about.team.creative.role'),
      description: t('about.team.creative.description')
    },
    {
      name: 'Engineering Team',
      role: t('about.team.engineering.role'),
      description: t('about.team.engineering.description')
    }
  ];

  return (
    <>
      <Helmet>
        <title>{t('about.meta.title')} - What If Studio</title>
        <meta name="description" content={t('about.meta.description')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse animation-delay-200"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center justify-center p-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full">
                <Lightbulb className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('about.hero.title')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                {t('about.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => navigate('/')}
                  className="btn-primary group"
                >
                  {t('about.hero.cta')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center text-gray-600">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span>{t('about.hero.rating')}</span>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section 
          ref={addToRefs}
          className={`py-20 transition-all duration-1000 transform ${
            visibleSections.has(0) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('about.mission.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`card p-8 text-center hover:scale-105 transition-all duration-300 transform ${
                    visibleSections.has(0) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section 
          ref={addToRefs}
          className={`py-20 bg-white/50 backdrop-blur-sm transition-all duration-1000 transform ${
            visibleSections.has(1) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('about.stats.title')}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center transform transition-all duration-1000 ${
                    visibleSections.has(1) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section 
          ref={addToRefs}
          className={`py-20 transition-all duration-1000 transform ${
            visibleSections.has(2) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {t('about.vision.title')}
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t('about.vision.description')}
                </p>
                <div className="space-y-4">
                  {[
                    t('about.vision.point1'),
                    t('about.vision.point2'),
                    t('about.vision.point3')
                  ].map((point, index) => (
                    <div key={index} className="flex items-start">
                      <Zap className="w-6 h-6 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                      <p className="text-gray-600">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white rounded-2xl p-4 shadow-lg animate-float">
                      <Brain className="w-8 h-8 text-blue-500 mb-2" />
                      <div className="h-2 bg-blue-100 rounded mb-1"></div>
                      <div className="h-2 bg-blue-100 rounded w-2/3"></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg animate-float animation-delay-200">
                      <Sparkles className="w-8 h-8 text-purple-500 mb-2" />
                      <div className="h-2 bg-purple-100 rounded mb-1"></div>
                      <div className="h-2 bg-purple-100 rounded w-3/4"></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg animate-float animation-delay-400">
                      <Users className="w-8 h-8 text-pink-500 mb-2" />
                      <div className="h-2 bg-pink-100 rounded mb-1"></div>
                      <div className="h-2 bg-pink-100 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg animate-float animation-delay-200">
                      <Target className="w-8 h-8 text-green-500 mb-2" />
                      <div className="h-2 bg-green-100 rounded mb-1"></div>
                      <div className="h-2 bg-green-100 rounded w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section 
          ref={addToRefs}
          className={`py-20 bg-white/50 backdrop-blur-sm transition-all duration-1000 transform ${
            visibleSections.has(3) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('about.team.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('about.team.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className={`card p-8 text-center hover:scale-105 transition-all duration-300 transform ${
                    visibleSections.has(3) 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          ref={addToRefs}
          className={`py-20 transition-all duration-1000 transform ${
            visibleSections.has(4) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-4xl font-bold mb-6">
                {t('about.cta.title')}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {t('about.cta.description')}
              </p>
              <button 
                onClick={() => navigate('/')}
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              >
                {t('about.cta.button')}
              </button>
            </div>
          </div>
        </section>
      </div>

    </>
  );
};

export default AboutPage;