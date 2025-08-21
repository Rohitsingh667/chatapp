export const API_BASE_URL = 'http://localhost:3000';
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile'
  },
  CONVERSATIONS: {
    START: '/conversations/start',
    MESSAGES: (id) => `/conversations/${id}/messages`
  }
};
