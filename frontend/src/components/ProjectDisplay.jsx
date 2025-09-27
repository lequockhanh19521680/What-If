import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Share2, 
  Download, 
  Eye, 
  Copy, 
  Check, 
  Heart,
  Bookmark,
  Play,
  Pause,
  Volume2,
  Maximize,
  ExternalLink,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { FacebookShareButton, TwitterShareButton, RedditShareButton } from 'react-share';
import apiService from '../services/api';

const ProjectDisplay = ({ project }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('scenario');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showSharing, setShowSharing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
    { id: 'scenario', label: 'Scenario', icon: MessageSquare },
    { id: 'analysis', label: 'Analysis', icon: Eye },
    { id: 'images', label: 'Gallery', icon: () => <span className="text-sm font-medium">{project.images?.length || 0}</span> },
    { id: 'video', label: 'Video', icon: Play }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Project metadata */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>By {project.author || 'Anonymous'}</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <Eye size={14} />
              <span>{project.viewCount || 0} views</span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {project.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {project.shortDescription}
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setShowSharing(!showSharing)}
              className="btn-primary inline-flex items-center space-x-2 px-6 py-3"
            >
              <Share2 size={20} />
              <span>Share</span>
            </button>
            
            <button className="btn-secondary inline-flex items-center space-x-2 px-6 py-3">
              <Download size={20} />
              <span>Download</span>
            </button>

            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`btn-secondary inline-flex items-center space-x-2 px-6 py-3 ${
                isLiked ? 'text-red-600 bg-red-50 border-red-200' : ''
              }`}
            >
              <Heart size={20} className={isLiked ? 'fill-current' : ''} />
              <span>Like</span>
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`btn-secondary inline-flex items-center space-x-2 px-6 py-3 ${
                isBookmarked ? 'text-blue-600 bg-blue-50 border-blue-200' : ''
              }`}
            >
              <Bookmark size={20} className={isBookmarked ? 'fill-current' : ''} />
              <span>Save</span>
            </button>
          </div>

          {/* Enhanced sharing panel */}
          {showSharing && (
            <div className="card-elevated p-8 mt-8 inline-block animate-slide-up">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Share this amazing scenario</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <FacebookShareButton
                  url={shareUrl}
                  quote={project.title}
                  onClick={() => handleShare('facebook')}
                  className="w-full"
                >
                  <div className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl w-full text-center transition-colors">
                    <div className="font-medium">Facebook</div>
                  </div>
                </FacebookShareButton>

                <TwitterShareButton
                  url={shareUrl}
                  title={project.title}
                  onClick={() => handleShare('twitter')}
                  className="w-full"
                >
                  <div className="bg-sky-500 hover:bg-sky-600 text-white p-4 rounded-xl w-full text-center transition-colors">
                    <div className="font-medium">Twitter</div>
                  </div>
                </TwitterShareButton>

                <RedditShareButton
                  url={shareUrl}
                  title={project.title}
                  onClick={() => handleShare('reddit')}
                  className="w-full"
                >
                  <div className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-xl w-full text-center transition-colors">
                    <div className="font-medium">Reddit</div>
                  </div>
                </RedditShareButton>

                <button
                  onClick={handleCopyLink}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-xl w-full text-center transition-colors"
                >
                  {linkCopied ? (
                    <div className="flex items-center justify-center space-x-1">
                      <Check size={16} />
                      <span className="font-medium">Copied!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-1">
                      <Copy size={16} />
                      <span className="font-medium">Copy Link</span>
                    </div>
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Share this creative scenario with the world!
              </div>
            </div>
          )}
        </div>

        {/* Enhanced tab navigation */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 inline-flex mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced tab content */}
        <div className="animate-fade-in">
          {activeTab === 'scenario' && (
            <div className="card-elevated p-8 lg:p-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
                  The Scenario
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Hypothesis:</h3>
                    <p className="text-gray-700 italic">"{project.prompt}"</p>
                  </div>
                  
                  <div className="space-y-4 text-lg">
                    {project.scenario.split('\n').map((paragraph, index) => (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="card-elevated p-8 lg:p-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
                  Scientific Analysis
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      🧬 Research-Backed Insights
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Our AI analyzes your hypothesis using scientific principles and existing research.
                    </p>
                  </div>
                  
                  <div className="space-y-4 text-lg">
                    {project.scientificAnalysis.split('\n').map((paragraph, index) => (
                      <p key={index} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-gray-900">
                Visual Journey
              </h2>
              
              {/* Image gallery */}
              <div className="grid md:grid-cols-2 gap-8">
                {project.images.map((image, index) => (
                  <div 
                    key={index} 
                    className="card-elevated overflow-hidden hover-lift cursor-pointer group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.description}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          Scene {index + 1}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ExternalLink size={16} />
                        </button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {image.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Image modal */}
              {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                  <div className="max-w-4xl w-full">
                    <div className="relative">
                      <img
                        src={selectedImage.url}
                        alt={selectedImage.description}
                        className="w-full h-auto rounded-2xl shadow-2xl"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-4 text-center text-white">
                      <p className="text-lg">{selectedImage.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-center text-gray-900">
                Cinematic Experience
              </h2>
              
              <div className="card-elevated p-8 max-w-5xl mx-auto">
                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <video
                    controls
                    className="w-full h-full"
                    poster={project.images?.[0]?.url}
                    preload="metadata"
                  >
                    <source src={project.video?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-600 mb-4">
                    Watch the complete visual narrative of your scenario
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <button className="btn-secondary inline-flex items-center space-x-2">
                      <Download size={16} />
                      <span>Download Video</span>
                    </button>
                    <button className="btn-secondary inline-flex items-center space-x-2">
                      <Share2 size={16} />
                      <span>Share Video</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced project stats */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">{project.viewCount || 0}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center">
                <Eye size={14} className="mr-1" />
                Views
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">{project.shareCount || 0}</div>
              <div className="text-sm text-gray-600 flex items-center justify-center">
                <Share2 size={14} className="mr-1" />
                Shares
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">{project.images?.length || 0}</div>
              <div className="text-sm text-gray-600">
                Images
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {project.language === 'vi' ? 'VI' : 'EN'}
              </div>
              <div className="text-sm text-gray-600">
                Language
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="card-elevated p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Create Your Own Scenario
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Ready to explore your own "what if" questions? Start creating amazing content with AI.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Start Creating Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDisplay;