const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data;
};

export const api = {
  // Auth
  signup: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  logout: async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    localStorage.removeItem('token');
  },

  // Managers
  searchManagers: async (query, company) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (company) params.append('company', company);
    const response = await fetch(`${API_BASE}/managers/search?${params}`);
    return handleResponse(response);
  },

  getTrendingManagers: async (limit = 5) => {
    const response = await fetch(`${API_BASE}/managers/trending?limit=${limit}`);
    return handleResponse(response);
  },

  getManager: async (id) => {
    const response = await fetch(`${API_BASE}/managers/${id}`);
    return handleResponse(response);
  },

  createManager: async (data) => {
    const response = await fetch(`${API_BASE}/managers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getCompanies: async () => {
    const response = await fetch(`${API_BASE}/managers/companies`);
    return handleResponse(response);
  },

  // Reviews
  getReviews: async (managerId, limit = 20, offset = 0) => {
    const response = await fetch(
      `${API_BASE}/reviews/manager/${managerId}?limit=${limit}&offset=${offset}`
    );
    return handleResponse(response);
  },

  createReview: async (data) => {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Verification
  requestVerification: async (managerId, workEmail, employmentStart, employmentEnd) => {
    const response = await fetch(`${API_BASE}/verification/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        manager_id: managerId,
        work_email: workEmail,
        employment_start: employmentStart,
        employment_end: employmentEnd,
      }),
    });
    return handleResponse(response);
  },

  confirmVerification: async (managerId, code) => {
    const response = await fetch(`${API_BASE}/verification/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        manager_id: managerId,
        code,
      }),
    });
    return handleResponse(response);
  },

  // User
  getDashboard: async () => {
    const response = await fetch(`${API_BASE}/user/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE}/user/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
