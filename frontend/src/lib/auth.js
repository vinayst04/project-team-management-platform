export const setToken = (token) => {
  if (typeof window !== 'undefined') localStorage.setItem('token', token);
};

export const getToken = () => {
  if (typeof window !== 'undefined') return localStorage.getItem('token');
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    if (user && typeof user === 'object') {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    try {
      const user = localStorage.getItem('user');
      if (!user || user === 'undefined' || user === 'null') {
        localStorage.removeItem('user');
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => !!getToken();

export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
