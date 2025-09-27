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


      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default HomePage;