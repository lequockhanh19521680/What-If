import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 300000, // 5 minutes for AI processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please try again.');
        }
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (error.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        throw error;
      }
    );
  }

  async generateContent(prompt, language = 'en', userId = null) {
    try {
      const response = await this.client.post('/generate', {
        prompt,
        language,
        userId
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.requiresAuth) {
        throw new Error('AUTH_REQUIRED');
      }
      throw error;
    }
  }

  async getProject(projectId) {
    try {
      const response = await this.client.get(`/project/${projectId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Project not found');
      }
      throw error;
    }
  }

  async getUserProjects(userId) {
    try {
      const response = await this.client.get(`/user/${userId}/projects`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createShareLink(projectId, platform) {
    try {
      const response = await this.client.post('/share', {
        projectId,
        platform
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService();