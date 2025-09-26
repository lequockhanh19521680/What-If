import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import Generator from '../components/Generator';
import ProjectDisplay from '../components/ProjectDisplay';
import AuthModal from '../components/AuthModal';

const HomePage = () => {
  const { t } = useTranslation();
  const [currentProject, setCurrentProject] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleGetStarted = () => {
    setShowGenerator(true);
    // Smooth scroll to generator
    setTimeout(() => {
      document.getElementById('generator')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleProjectGenerated = (project) => {
    setCurrentProject(project);
    setShowGenerator(false);
    // Scroll to project display
    setTimeout(() => {
      document.getElementById('project')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }, 100);
  };

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div id="home">
        <Hero onGetStarted={handleGetStarted} />
      </div>

      {/* Generator Section */}
      {showGenerator && (
        <div id="generator" className="bg-white">
          <Generator 
            onProjectGenerated={handleProjectGenerated}
            onAuthRequired={handleAuthRequired}
          />
        </div>
      )}

      {/* Project Display */}
      {currentProject && (
        <div id="project" className="bg-gray-50">
          <ProjectDisplay project={currentProject} />
        </div>
      )}

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            About What If Studio
          </h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              What If Studio uses advanced AI to transform your creative hypotheses 
              into detailed, scientifically-grounded scenarios. Our platform combines 
              the power of large language models with image generation to create 
              immersive multimedia experiences.
            </p>
            <p>
              Whether you're exploring scientific possibilities, creating educational 
              content, or just satisfying your curiosity, What If Studio provides 
              the tools to bring your imagination to life.
            </p>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default HomePage;