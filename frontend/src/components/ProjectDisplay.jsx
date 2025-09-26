import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Share2, Download, Eye, Copy, Check } from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, RedditShareButton } from 'react-share';
import apiService from '../services/api';

const ProjectDisplay = ({ project }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('scenario');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showSharing, setShowSharing] = useState(false);

  const shareUrl = `${window.location.origin}/project/${project.projectId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async (platform) => {
    try {
      await apiService.createShareLink(project.projectId, platform);
    } catch (err) {
      console.error('Failed to track share:', err);
    }
  };

  const tabs = [
    { id: 'scenario', label: t('project.scenario') },
    { id: 'analysis', label: t('project.analysis') },
    { id: 'images', label: t('project.images') },
    { id: 'video', label: t('project.video') }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Project header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {project.title}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {project.shortDescription}
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowSharing(!showSharing)}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Share2 size={20} />
            <span>{t('project.share')}</span>
          </button>
          
          <button className="btn-secondary inline-flex items-center space-x-2">
            <Download size={20} />
            <span>Download</span>
          </button>
        </div>

        {/* Sharing panel */}
        {showSharing && (
          <div className="card p-6 mt-6 inline-block">
            <h3 className="text-lg font-semibold mb-4">{t('sharing.title')}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <FacebookShareButton
                url={shareUrl}
                quote={project.title}
                onClick={() => handleShare('facebook')}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>{t('sharing.facebook')}</span>
              </FacebookShareButton>

              <TwitterShareButton
                url={shareUrl}
                title={project.title}
                onClick={() => handleShare('twitter')}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>{t('sharing.twitter')}</span>
              </TwitterShareButton>

              <RedditShareButton
                url={shareUrl}
                title={project.title}
                onClick={() => handleShare('reddit')}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>{t('sharing.reddit')}</span>
              </RedditShareButton>

              <button
                onClick={handleCopyLink}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                <span>
                  {linkCopied ? t('sharing.linkCopied') : t('sharing.copyLink')}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex justify-center space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === 'scenario' && (
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-6">{t('project.scenario')}</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {project.scenario}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-6">{t('project.analysis')}</h2>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {project.scientificAnalysis}
            </div>
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center">{t('project.images')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {project.images.map((image, index) => (
                <div key={index} className="card overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.description}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-700">{image.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">{t('project.video')}</h2>
            <div className="card p-8 max-w-4xl mx-auto">
              <video
                controls
                className="w-full rounded-lg shadow-lg"
                poster={project.images[0]?.url}
              >
                <source src={project.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>

      {/* Project stats */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <div className="flex justify-center items-center space-x-6">
          <div className="flex items-center space-x-1">
            <Eye size={16} />
            <span>{project.viewCount || 0} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <Share2 size={16} />
            <span>{project.shareCount || 0} shares</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectDisplay;