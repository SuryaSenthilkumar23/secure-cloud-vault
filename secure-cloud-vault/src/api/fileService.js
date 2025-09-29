import axios from 'axios';
import { auth } from '../firebase/config.js';

const API_BASE_URL = 'http://10.188.123.226:5000/api';

// Mock data fallback
const mockFiles = [
  {
    id: '1',
    name: 'sample-document.pdf',
    size: '2.1 MB',
    type: 'pdf',
    upload_date: '2024-09-28'
  },
  {
    id: '2',
    name: 'example-image.jpg',
    size: '1.5 MB',
    type: 'image',
    upload_date: '2024-09-28'
  }
];

// Get fresh Firebase token
const getAuthToken = async () => {
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken(true);
  }
  throw new Error('No authenticated user');
};

export const fileService = {
  async getFiles() {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/files`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching files, using mock data:', error);
      // Return mock data when backend is unreachable
      return mockFiles;
    }
  },

  async uploadFile(file) {
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};