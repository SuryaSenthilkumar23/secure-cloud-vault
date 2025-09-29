import React, { useState, useEffect } from 'react';
import { Upload, Download, Trash2, FileText, Image, Film, Music, Archive, File, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { fileService } from '../api/fileService.js';

// Utility function to get file icon
const getFileIcon = (type, size = 20) => {
  const iconProps = { size, className: "text-blue-600" };
  
  switch (type) {
    case 'pdf':
    case 'document':
      return <FileText {...iconProps} />;
    case 'image':
      return <Image {...iconProps} />;
    case 'video':
      return <Film {...iconProps} />;
    case 'audio':
      return <Music {...iconProps} />;
    case 'archive':
      return <Archive {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
};

const DashboardPage = ({ onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currentUser, logout } = useAuth();

  // Load files when component mounts
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      setError('');
      const fileList = await fileService.getFiles();
      setFiles(fileList);
    } catch (err) {
      setError('Failed to load files: ' + err.message);
      console.error('Load files error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');
      
      await fileService.uploadFile(selectedFile);
      
      setSuccess('File uploaded successfully!');
      setSelectedFile(null);
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Refresh file list
      await loadFiles();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError('Upload failed: ' + err.message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logout successful');
      onNavigate('login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="text-blue-600 mr-3" size={32} />
              <h1 className="text-2xl font-bold text-gray-900">Secure Cloud-Vault</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {currentUser?.email || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} className="mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Files</h2>
          
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {success}
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <input
              type="file"
              onChange={handleFileSelect}
              disabled={uploading}
              className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={18} />
                  Upload File
                </>
              )}
            </button>
          </div>

          {selectedFile && !uploading && (
            <div className="mt-3 text-sm text-gray-600">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </div>

        {/* Files List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Files</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No files uploaded yet</p>
              <p className="text-gray-400 text-sm">Upload your first file to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <div key={file.id || index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="mr-4">
                      {getFileIcon(file.type || 'unknown', 24)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{file.name}</h3>
                      <p className="text-sm text-gray-500">
                        {file.size} • {file.uploadDate || file.upload_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => console.log('Download:', file.name)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => console.log('Delete:', file.name)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;