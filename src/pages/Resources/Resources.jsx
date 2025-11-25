import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Image, Calendar, User, ArrowLeft, Loader2, ExternalLink, Download, Search, Filter, BookOpen, File } from 'lucide-react';
import { getResources } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import TopBar from '../../components/Layout/TopBar';

const Resources = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getResources(accessToken);
        setResources(data);
      } catch (err) {
        console.error('Failed to fetch resources', err);
        setError(err.message || 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [accessToken]);

  const getFileType = (fileUrl) => {
    if (!fileUrl) return 'file';
    
    const url = fileUrl.toLowerCase();
    if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      return 'image';
    } else if (url.match(/\.(pdf)$/)) {
      return 'pdf';
    }
    return 'file';
  };

  const getFileIcon = (fileUrl, size = 'w-12 h-12') => {
    const type = getFileType(fileUrl);
    const iconClass = `${size} ${type === 'pdf' ? 'text-red-500' : type === 'image' ? 'text-blue-500' : 'text-gray-500'}`;
    
    if (type === 'pdf') {
      return <FileText className={iconClass} />;
    } else if (type === 'image') {
      return <Image className={iconClass} />;
    }
    return <File className={iconClass} />;
  };

  const getFileTypeColor = (fileUrl) => {
    const type = getFileType(fileUrl);
    if (type === 'pdf') {
      return 'bg-red-100 text-red-700 border-red-200';
    } else if (type === 'image') {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const handleOpenResource = (resource) => {
    if (resource.file_URL) {
      window.open(resource.file_URL, '_blank', 'noopener,noreferrer');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesSearch = searchTerm === '' || 
      (resource.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || getFileType(resource.file_URL) === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <TopBar brandVariant="dashboard" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-green-100 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Resources Library</h1>
              <p className="text-green-50 text-lg">Access documents, guides, and helpful materials</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-green-100">
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>{resources.length} {resources.length === 1 ? 'Resource' : 'Resources'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        {resources.length > 0 && (
          <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
              
              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF Documents</option>
                  <option value="image">Images</option>
                  <option value="file">Other Files</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
            <p className="text-gray-600 font-medium">Loading resources...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Error Loading Resources</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        {!loading && !error && (
          <>
            {filteredResources.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  {searchTerm || filterType !== 'all' ? (
                    <Search className="w-12 h-12 text-gray-400" />
                  ) : (
                    <BookOpen className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {searchTerm || filterType !== 'all' ? 'No resources found' : 'No resources available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Check back later for new resources'}
                </p>
                {(searchTerm || filterType !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => {
                  const fileType = getFileType(resource.file_URL);
                  return (
                    <div
                      key={resource.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col"
                    >
                      {/* Header with Icon */}
                      <div className={`relative h-32 ${
                        fileType === 'pdf' 
                          ? 'bg-gradient-to-br from-red-500 to-red-600' 
                          : fileType === 'image'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-gradient-to-br from-gray-500 to-gray-600'
                      } flex items-center justify-center`}>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>
                        <div className="relative text-white">
                          {getFileIcon(resource.file_URL, 'w-16 h-16')}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            fileType === 'pdf'
                              ? 'bg-red-700 text-white'
                              : fileType === 'image'
                              ? 'bg-blue-700 text-white'
                              : 'bg-gray-700 text-white'
                          }`}>
                            {fileType.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col h-full min-h-[280px]">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">
                          {resource.title || 'Untitled Resource'}
                        </h3>

                        {resource.description && resource.description !== 'NULL' && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 overflow-hidden">
                            {resource.description}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(resource.uploaded_date)}</span>
                          </div>
                          {resource.access_level && (
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <User className="w-4 h-4" />
                              <span className="capitalize">{resource.access_level} Access</span>
                            </div>
                          )}
                        </div>

                        {/* Action Button - Pushed to bottom */}
                        <button
                          onClick={() => handleOpenResource(resource)}
                          className="mt-auto w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition transform hover:scale-105 flex items-center justify-center space-x-2 group/btn"
                        >
                          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          <span>View Resource</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Resources;
