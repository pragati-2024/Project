import API from './api';

export const signUp = async (userData) => {
  try {
    // Validate input to match middleware expectations
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error('All fields are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Please enter a valid email address');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const response = await API.post('/signup', {
      UserName: userData.name,
      Email: userData.email,
      Password: userData.password
    });

    if (!response.data?.token) {
      throw new Error('Authentication token missing in response');
    }

    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle server response errors
      const message = error.response.data?.message || 
                     (error.response.status === 409 ? 'Email already registered' : 'Signup failed');
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Signup failed');
    }
  }
};

export const signIn = async (credentials) => {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    const response = await API.post('/signin', {
      Email: credentials.email,
      Password: credentials.password
    });

    if (!response.data?.token) {
      throw new Error('Authentication token missing in response');
    }

    // Store token and user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.message || 
                     (error.response.status === 401 ? 'Invalid email or password' : 'Login failed');
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Login failed');
    }
  }
};

export const checkAuth = () => {
  try {
    const token = localStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const logout = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const refreshToken = async () => {
  try {
    const response = await API.post('/refresh-token', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout(); // Force logout if refresh fails
    return false;
  }
};

export const signInWithGoogle = async (idToken) => {
  try {
    if (!idToken) throw new Error('Google token missing');

    const response = await API.post('/google', {
      idToken,
    });

    if (!response.data?.token) {
      throw new Error('Authentication token missing in response');
    }

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.message || 'Google login failed';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Google login failed');
    }
  }
};