import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adaptcx_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect if we are on login/signup or public routes
      const path = window.location.pathname;
      if (!path.startsWith('/login') && !path.startsWith('/signup') && !path.startsWith('/site/')) {
        localStorage.removeItem('adaptcx_auth_token');
        localStorage.removeItem('adaptcx_business');
        // Optional redirect
      }
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const useCasesApi = {
  getAll: () => api.get('/use-cases'),
  create: (data) => api.post('/use-cases', data),
  update: (id, data) => api.put(`/use-cases/${id}`, data),
  delete: (id) => api.delete(`/use-cases/${id}`)
};

export const contentBlocksApi = {
  getAll: () => api.get('/content-blocks'),
  updateBlock: (key, defaultValue) => api.put(`/content-blocks/${key}`, { default_value: defaultValue }),
  batchUpdate: (blocks) => api.put('/content-blocks/batch', { blocks })
};

export const contentVariantsApi = {
  getAll: () => api.get('/content-variants'),
  generate: () => api.post('/content-variants/generate'),
  update: (id, data) => api.put(`/content-variants/${id}`, data)
};

export const quizConfigApi = {
  get: () => api.get('/quiz-config'),
  update: (questionText) => api.put('/quiz-config', { question_text: questionText })
};

export const insightsApi = {
  getDashboard: () => api.get('/insights/dashboard')
};

export const publicApi = {
  getSiteData: (businessId) => api.get(`/public/${businessId}/site`),
  selectUseCase: (businessId, data) => api.post(`/public/${businessId}/select-use-case`, data),
  logEvent: (businessId, data) => api.post(`/public/${businessId}/event`, data)
};

export default api;
