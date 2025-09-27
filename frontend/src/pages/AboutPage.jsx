import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Globe, 
  Users, 
  Shield,
  Rocket,
  Heart,
  Star,
  CheckCircle
} from 'lucide-react';

const AboutPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Analysis',
      description: 'Powered by Claude 3 for intelligent scientific reasoning and scenario generation'
    },
    {
      icon: Sparkles,
      title: 'Visual Content Creation',
      description: 'Automatically generates high-quality concept art using Stable Diffusion'
    },
    {
      icon: Zap,
      title: 'Video Production',
      description: 'Creates engaging MP4 slideshows from generated images'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Available in English and Vietnamese with auto-detection'
    },
    {
      icon: Users,
      title: 'Social Sharing',
      description: 'Easy sharing across social platforms with optimized previews'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with AWS infrastructure'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Scenarios Created' },
    { number: '50K+', label: 'Images Generated' },
    { number: '99.9%', label: 'Uptime' },
    { number: '150+', label: 'Countries' }
  ];

  const team = [
    {
      name: 'AI Research Team',
      role: 'Scientific Analysis & Model Optimization',
      description: 'Experts in machine learning and scientific reasoning'
    },
    {
      name: 'Creative Team',
      role: 'Visual Design & User Experience',
      description: 'Artists and designers crafting beautiful experiences'
    },
    {
      name: 'Engineering Team',
      role: 'Platform Development & Security',
      description: 'Building scalable, secure infrastructure'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>About What If Studio - AI-Powered Creative Scenarios</title>
        <meta name="description" content="Learn about What If Studio's mission to transform hypotheses into scientifically-grounded scenarios using advanced AI technology." />
      </Helmet>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="gradient-bg p-4 rounded-2xl">
                <Rocket className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                What If Studio
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're revolutionizing creative thinking by combining advanced AI with scientific rigor. 
              Transform your "what if" questions into detailed, scientifically-grounded scenarios 
              complete with stunning visuals and engaging narratives.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Scientifically Accurate</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700">User-Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
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

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              At What If Studio, we believe that imagination should be boundless but grounded in reality. 
              Our platform bridges the gap between creative hypotheses and scientific analysis, 
              making complex scenarios accessible to everyone through the power of AI.
            </p>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <blockquote className="text-xl md:text-2xl font-medium italic">
                "Every great discovery began with someone asking 'What if?' 
                We're here to help you explore those possibilities."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technology meets intuitive design to bring your ideas to life
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="gradient-bg p-3 rounded-lg mr-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built on AWS Infrastructure
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform leverages enterprise-grade AWS services to deliver reliable, 
                scalable, and secure experiences. From AI model hosting to global content 
                delivery, every component is optimized for performance.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">AWS Bedrock for AI model access</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Serverless architecture for scalability</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Global CDN for fast content delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Enterprise-grade security and compliance</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 mb-1">Claude 3</div>
                    <div className="text-sm text-gray-600">AI Analysis</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-purple-600 mb-1">SDXL</div>
                    <div className="text-sm text-gray-600">Image Gen</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-green-600 mb-1">S3</div>
                    <div className="text-sm text-gray-600">Storage</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                    <div className="text-2xl font-bold text-orange-600 mb-1">Lambda</div>
                    <div className="text-sm text-gray-600">Compute</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate experts working together to push the boundaries of AI-powered creativity
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="gradient-bg w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Explore Your Ideas?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators, researchers, and curious minds using What If Studio 
            to bring their hypotheses to life.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Start Creating Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;