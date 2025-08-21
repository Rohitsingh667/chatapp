import { API_BASE_URL, API_ENDPOINTS } from '../config';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

const getAuthHeaders = (token) => ({
  'Authorization': `Bearer ${token}`
});

export const authAPI = {
  login: async (email, password) => {
    return apiRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (username, email, password) => {
    return apiRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  }
};

export const userAPI = {
  getUsers: async (token) => {
    return apiRequest(API_ENDPOINTS.USERS.LIST, {
      headers: getAuthHeaders(token)
    });
  }
};

export const conversationAPI = {
  startConversation: async (token, participantId) => {
    return apiRequest(API_ENDPOINTS.CONVERSATIONS.START, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ participantId })
    });
  },

  getMessages: async (token, conversationId) => {
    return apiRequest(API_ENDPOINTS.CONVERSATIONS.MESSAGES(conversationId), {
      headers: getAuthHeaders(token)
    });
  }
};
