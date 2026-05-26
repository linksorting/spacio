import { appParams } from '@/lib/app-params';

const ACCESS_TOKEN_STORAGE_KEY = 'designer_pro_access_token';

const normalizeBaseUrl = (url) => {
  if (!url) {
    return '';
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL || appParams.appBaseUrl || '');

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage;
};

const getStoredToken = () => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }
  return storage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

const setStoredToken = (token) => {
  const storage = getStorage();
  if (!storage || !token) {
    return;
  }
  storage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
};

const clearStoredToken = () => {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  storage.removeItem('token');
};

const parseResponseData = async (response) => {
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }
  return response.json();
};

const request = async (path, options = {}) => {
  const {
    method = 'GET',
    headers = {},
    body,
    auth = true,
    token
  } = options;

  const resolvedToken = token ?? getStoredToken();
  const finalHeaders = {
    ...headers
  };

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
  }

  if (auth && resolvedToken) {
    finalHeaders.Authorization = `Bearer ${resolvedToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const data = await parseResponseData(response);
  if (!response.ok) {
    const error = new Error(data?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const apiClient = {
  tokenKey: ACCESS_TOKEN_STORAGE_KEY,
  getToken() {
    return getStoredToken();
  },
  setToken(token) {
    setStoredToken(token);
  },
  clearToken() {
    clearStoredToken();
  },
  auth: {
    async login({ email, password }) {
      const response = await request('/api/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password }
      });

      if (response?.access_token) {
        setStoredToken(response.access_token);
      }

      return response;
    },
    async me() {
      return request('/api/auth/me');
    },
    logout(redirectTo = null) {
      clearStoredToken();

      if (typeof window !== 'undefined' && redirectTo) {
        const fromUrl = encodeURIComponent(redirectTo);
        window.location.assign(`/login?from_url=${fromUrl}`);
      }
    },
    redirectToLogin(fromUrl) {
      if (typeof window === 'undefined') {
        return;
      }
      const redirectSource = fromUrl || window.location.href;
      window.location.assign(`/login?from_url=${encodeURIComponent(redirectSource)}`);
    }
  },
  apps: {
    async getPublicSettings(appId) {
      return request(`/api/apps/public/prod/public-settings/by-id/${encodeURIComponent(appId)}`, {
        headers: {
          'X-App-Id': appId
        }
      });
    }
  }
};
