const API_BASE = '/api/v1';

export const getAuthToken = () => {
  return localStorage.getItem('foodapp_admin_token') || '';
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('foodapp_admin_token', token);
  } else {
    localStorage.removeItem('foodapp_admin_token');
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMessage);
    error.statusCode = response.status;
    error.code = data.code;
    error.errors = data.errors;
    throw error;
  }

  return data;
};

// API Services
export const api = {
  // Auth
  login: (email, password) =>
    apiRequest('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    apiRequest('/admin/auth/logout', {
      method: 'POST',
    }),
  getMe: () => apiRequest('/admin/auth/me'),

  // Statistics
  getStatistics: () => apiRequest('/admin/dashboard/statistics'),

  // Categories
  getCategories: () => apiRequest('/admin/categories'),
  createCategory: (data) =>
    apiRequest('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id, data) =>
    apiRequest(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id) =>
    apiRequest(`/admin/categories/${id}`, {
      method: 'DELETE',
    }),

  // Foods
  getFoods: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/foods${query ? `?${query}` : ''}`);
  },
  createFood: (data) =>
    apiRequest('/admin/foods', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFood: (id, data) =>
    apiRequest(`/admin/foods/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteFood: (id) =>
    apiRequest(`/admin/foods/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/orders${query ? `?${query}` : ''}`);
  },
  getOrderById: (id) => apiRequest(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) =>
    apiRequest(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
