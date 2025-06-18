import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../utils/api.jsx';

// Create context
const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
  USER_LOADED: 'USER_LOADED',
  AUTH_ERROR: 'AUTH_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_PROFILE: 'UPDATE_PROFILE'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.USER_LOADED:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_FAIL:
    case AUTH_ACTIONS.AUTH_ERROR:
    case AUTH_ACTIONS.LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload
      };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('AuthContext: Loading user, token exists:', !!token);
      
      if (token) {
        const response = await authAPI.getMe();
        console.log('AuthContext: User data received', response.data);
        dispatch({
          type: AUTH_ACTIONS.USER_LOADED,
          payload: response.data
        });
        console.log('AuthContext: USER_LOADED dispatched');
      } else {
        console.log('AuthContext: No token found, dispatching AUTH_ERROR');
        dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
      }
    } catch (error) {
      console.error('AuthContext: Load user error:', error);
      // Clear invalid token
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      console.log('AuthContext: Starting registration process');
      const response = await authAPI.register(formData);
      
      console.log('AuthContext: Registration API response received', response.data);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data
      });
      
      console.log('AuthContext: Dispatching LOGIN_SUCCESS for registration');
      
      await loadUser();
      
      console.log('AuthContext: User loaded successfully after registration');
      // Remove toast from here - let the component handle it
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Registration error', error);
      const message = error.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: message
      });
      // Remove toast from here - let the component handle it
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      console.log('AuthContext: Starting login process');
      const response = await authAPI.login(formData);
      
      console.log('AuthContext: Login API response received', response.data);
      
      // Store token in localStorage first
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('AuthContext: Token stored in localStorage');
      }
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: response.data
      });
      
      console.log('AuthContext: Dispatching LOGIN_SUCCESS');
      
      // Load user data
      await loadUser();
      
      console.log('AuthContext: User loaded successfully');
      // Remove toast from here - let the component handle it
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login error', error);
      const message = error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAIL,
        payload: message
      });
      // Remove toast from here - let the component handle it
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.info('Logged out successfully');
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const response = await authAPI.updateProfile(formData);
      
      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: response.data
      });
      
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (formData) => {
    try {
      await authAPI.changePassword(formData);
      toast.success('Password changed successfully!');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Password change failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 