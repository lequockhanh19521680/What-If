import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus,
  Search,
  Filter,
  Calendar,
  Eye,
  Share2,
  Trash2,
  Edit3,
  Download,
  Loader2,
  Grid,
  List,
  Star,
  Clock,
  Image,
  Video
} from 'lucide-react';
import apiService from '../services/api';

const ProjectsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'recent', 'starred'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedProjects, setSelectedProjects] = useState(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadProjects();
  }, [user, navigate]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const userProjects = await apiService.getUserProjects(user.userId);
      setProjects(userProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filterBy) {
      case 'recent':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && new Date(project.createdAt) > weekAgo;
      case 'starred':
        return matchesSearch && project.isStarred;
      default:
        return matchesSearch;
    }
  });

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // await apiService.deleteProject(projectId);
        setProjects(projects.filter(p => p.projectId !== projectId));
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProjects.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProjects.size} project(s)?`)) {
      try {
        // Implement bulk delete
        setProjects(projects.filter(p => !selectedProjects.has(p.projectId)));
        setSelectedProjects(new Set());
      } catch (error) {
        console.error('Failed to delete projects:', error);
      }
    }
  };

  const toggleProjectSelection = (projectId) => {
    const newSelection = new Set(selectedProjects);
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId);
    } else {
      newSelection.add(projectId);
    }
    setSelectedProjects(newSelection);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Helmet>
        <title>My Projects - What If Studio</title>
        <meta name="description" content="Manage your creative scenarios and AI-generated content projects." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage and explore your creative scenarios
              </p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create New Project</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <div className="gradient-bg p-3 rounded-lg">
                <Grid className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return new Date(p.createdAt) > monthAgo;
                  }).length}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((sum, p) => sum + (p.viewCount || 0), 0)}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Shares</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.reduce((sum, p) => sum + (p.shareCount || 0), 0)}
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Share2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="all">All Projects</option>
                  <option value="recent">Recent (7 days)</option>
                  <option value="starred">Starred</option>
                </select>
              </div>
              
              {/* View Mode */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProjects.size > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedProjects.size} project(s) selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBulkDelete}
                    className="btn-secondary text-sm px-3 py-1 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedProjects(new Set())}
                    className="btn-secondary text-sm px-3 py-1"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Projects Display */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading your projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters' 
                : 'Start creating amazing content with AI'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Create Your First Project</span>
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.projectId}
                project={project}
                viewMode={viewMode}
                isSelected={selectedProjects.has(project.projectId)}
                onSelect={() => toggleProjectSelection(project.projectId)}
                onView={() => handleProjectClick(project.projectId)}
                onDelete={() => handleDeleteProject(project.projectId)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectCard = ({ 
  project, 
  viewMode, 
  isSelected, 
  onSelect, 
  onView, 
  onDelete, 
  formatDate 
}) => {
  if (viewMode === 'list') {
    return (
      <div className={`card p-4 transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded"
          />
          
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {project.images?.[0]?.url && (
              <img 
                src={project.images[0].url} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {project.title}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {project.shortDescription}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center">
                <Calendar size={12} className="mr-1" />
                {formatDate(project.createdAt)}
              </span>
              <span className="flex items-center">
                <Eye size={12} className="mr-1" />
                {project.viewCount || 0}
              </span>
              <span className="flex items-center">
                <Share2 size={12} className="mr-1" />
                {project.shareCount || 0}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onView}
              className="btn-secondary p-2"
              title="View Project"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={onDelete}
              className="btn-secondary p-2 text-red-600 hover:bg-red-50"
              title="Delete Project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card overflow-hidden transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded"
        />
      </div>
      
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-200 overflow-hidden relative">
        {project.images?.[0]?.url ? (
          <img 
            src={project.images[0].url} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Media indicators */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
            <Image size={12} className="mr-1" />
            {project.images?.length || 0}
          </div>
          {project.video && (
            <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
              <Video size={12} className="mr-1" />
              1
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {project.shortDescription}
        </p>
        
        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center">
            <Clock size={12} className="mr-1" />
            {formatDate(project.createdAt)}
          </span>
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <Eye size={12} className="mr-1" />
              {project.viewCount || 0}
            </span>
            <span className="flex items-center">
              <Share2 size={12} className="mr-1" />
              {project.shareCount || 0}
            </span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={onView}
            className="btn-primary text-sm px-4 py-2 flex items-center space-x-1"
          >
            <Eye size={14} />
            <span>View</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              className="btn-secondary p-2"
              title="Star Project"
            >
              <Star size={14} />
            </button>
            <button
              className="btn-secondary p-2"
              title="Download"
            >
              <Download size={14} />
            </button>
            <button
              onClick={onDelete}
              className="btn-secondary p-2 text-red-600 hover:bg-red-50"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;