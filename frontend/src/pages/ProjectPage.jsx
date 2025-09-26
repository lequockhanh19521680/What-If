import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import ProjectDisplay from '../components/ProjectDisplay';
import { Loader2, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

const ProjectPage = () => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const result = await apiService.getProject(projectId);
      if (result.success) {
        setProject(result.project);
      } else {
        setError(result.message || t('errors.notFound'));
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError(err.message || t('errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('errors.notFound')}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{project.title} - What If Studio</title>
        <meta name="description" content={project.shortDescription} />
        
        {/* Open Graph */}
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.shortDescription} />
        <meta property="og:image" content={project.images[0]?.url} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={project.title} />
        <meta name="twitter:description" content={project.shortDescription} />
        <meta name="twitter:image" content={project.images[0]?.url} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <ProjectDisplay project={project} />
      </div>
    </>
  );
};

export default ProjectPage;