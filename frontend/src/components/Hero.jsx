import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Brain, 
  Image, 
  Share2, 
  Sparkles, 
  ArrowRight,
  Zap,
  Globe,
  Users,
  TrendingUp
} from 'lucide-react';

const Hero = ({ onGetStarted }) => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced scientific reasoning with Claude 3',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Image,
      title: 'Visual Content',
      description: 'Stunning concept art with Stable Diffusion',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Share2,
      title: 'Social Sharing',
      description: 'Share across all major platforms',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const stats = [
    { icon: Users, number: '10K+', label: 'Active Users' },
    { icon: Sparkles, number: '50K+', label: 'Scenarios Created' },
    { icon: Globe, number: '150+', label: 'Countries' },
    { icon: TrendingUp, number: '99.9%', label: 'Uptime' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-200"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-400"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Hero badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg text-gray-700 text-sm font-medium mb-8 animate-slide-down hover-lift">
            <Zap className="w-4 h-4 mr-2 text-yellow-500" />
            <span>Powered by Advanced AI • </span>
            <span className="text-blue-600 font-semibold ml-1">Free to Try</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 animate-slide-up leading-tight">
            <span className="block mb-2">Transform Your</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              "What If" Ideas
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4 text-gray-700">
              Into Reality
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
            {t('hero.description')} Create stunning visuals and engaging scenarios 
            with our AI-powered platform that combines scientific analysis with artistic creativity.
          </p>

          {/* CTA Section */}
          <div className="mb-16 animate-slide-up animation-delay-400">
            <button
              onClick={onGetStarted}
              className="btn-primary text-xl px-10 py-5 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 transition-all duration-300 group"
            >
              <span className="flex items-center">
                Start Creating Now
                <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              No signup required • 5 free generations • No credit card needed
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 animate-slide-up animation-delay-600">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-md mb-3 group-hover:shadow-lg transition-shadow">
                  <stat.icon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden"
              >
                <div className="card p-8 text-center hover-lift hover-glow animate-slide-up"
                     style={{ animationDelay: `${800 + index * 200}ms` }}>
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover effect background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-bounce-gentle animation-delay-200">
        <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-32 right-20 animate-bounce-gentle animation-delay-400">
        <div className="w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute bottom-32 left-20 animate-bounce-gentle animation-delay-600">
        <div className="w-4 h-4 bg-pink-400 rounded-full opacity-60"></div>
      </div>
    </section>
  );
};

export default Hero;