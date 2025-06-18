import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    try {
      console.log('Making registration request with data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error);
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'Network error: Unable to connect to server' };
      } else {
        throw { message: error.message || 'Registration failed' };
      }
    }
  },

  login: async (credentials) => {
    try {
      console.log('Making login request with data:', { email: credentials.email });
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login API error:', error);
      if (error.response?.data) {
        throw error.response.data;
      } else if (error.request) {
        throw { message: 'Network error: Unable to connect to server' };
      } else {
        throw { message: error.message || 'Login failed' };
      }
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('GetMe API error:', error);
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw { message: 'Failed to get user data' };
      }
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('UpdateProfile API error:', error);
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw { message: 'Profile update failed' };
      }
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('ChangePassword API error:', error);
      if (error.response?.data) {
        throw error.response.data;
      } else {
        throw { message: 'Password change failed' };
      }
    }
  },
};

// User API
export const userAPI = {
  uploadImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await api.post('/user/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Image upload failed' };
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/user/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get user stats' };
    }
  },
};

// AI Tools API
export const aiToolsAPI = {
  getAvailableTools: async () => {
    try {
      const response = await api.get('/ai-tools');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get available tools' };
    }
  },

  getRandomHighlight: async () => {
    try {
      const response = await api.get('/ai-tools/highlight');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get highlight' };
    }
  },

  generateCode: async (data) => {
    try {
      const response = await api.post('/ai-tools/generate-code', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Code generation failed' };
    }
  },

  analyzeResume: async (data) => {
    try {
      const response = await api.post('/ai-tools/analyze-resume', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Resume analysis failed' };
    }
  },

  analyzeResumePDF: async (pdfFile) => {
    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      
      const response = await api.post('/ai-tools/analyze-resume-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'PDF resume analysis failed' };
    }
  },

  generateQuestions: async (data) => {
    try {
      const response = await api.post('/ai-tools/generate-questions', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Question generation failed' };
    }
  },

  generateQuestionsPDF: async (pdfFile, jobTitle = 'Software Engineer') => {
    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('jobTitle', jobTitle);
      
      const response = await api.post('/ai-tools/generate-questions-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'PDF question generation failed' };
    }
  },

  generateATSResume: async (data) => {
    try {
      const response = await api.post('/ai-tools/generate-ats-resume', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'ATS resume generation failed' };
    }
  },

  generateATSResumePDF: async (pdfFile, targetJobTitle = 'Software Engineer') => {
    try {
      const formData = new FormData();
      formData.append('pdfFile', pdfFile);
      formData.append('targetJobTitle', targetJobTitle);
      
      const response = await api.post('/ai-tools/generate-ats-resume-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'PDF ATS resume generation failed' };
    }
  },

  analyzeComplexity: async (data) => {
    try {
      const response = await api.post('/ai-tools/analyze-complexity', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Time complexity analysis failed' };
    }
  },

  reviewCode: async (data) => {
    try {
      const response = await api.post('/ai-tools/review-code', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Code review failed' };
    }
  },

  explainAlgorithm: async (data) => {
    try {
      const response = await api.post('/ai-tools/explain-algorithm', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Algorithm explanation failed' };
    }
  },

  generateRoadmap: async (data) => {
    try {
      const response = await api.post('/ai-tools/generate-roadmap', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Roadmap generation failed' };
    }
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Health check failed' };
    }
  },
};

export default api; 