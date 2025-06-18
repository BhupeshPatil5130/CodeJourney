import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from submitting and causing page reload
    e.stopPropagation(); // Stop event bubbling
    
    console.log('🔍 Login form submitted, preventing default behavior');
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setIsLoading(true);
    console.log('🔄 Starting login process...');
    
    try {
      console.log('📤 Attempting login with data:', {
        email: formData.email,
        password: formData.password
      });

      const result = await login(formData);
      
      console.log('📥 Login result received:', result);

      if (result.success) {
        console.log('✅ Login successful, showing success toast');
        toast.success('Login successful! Welcome back!');
        console.log('🧭 Navigating to dashboard...');
        
        // Use setTimeout to ensure state updates are processed before navigation
        setTimeout(() => {
          console.log('🚀 Executing navigation to dashboard');
          navigate('/dashboard', { replace: true });
        }, 100);
      } else {
        console.error('❌ Login failed:', result.error);
        toast.error(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('💥 Login error caught:', error);
      
      // Handle different types of errors
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        const serverError = error.response.data;
        errorMessage = serverError.message || serverError.error || errorMessage;
        console.error('🌐 Server error details:', serverError);
      } else if (error.request) {
        // Network error - server not reachable
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
        console.error('🌐 Network error:', error.request);
      } else {
        // Other error
        errorMessage = error.message || errorMessage;
      }
      
      console.log('💬 Showing error toast:', errorMessage);
      toast.error(errorMessage);
    } finally {
      console.log('🏁 Login process finished, setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-bg py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center mb-6"
          >
            <span className="text-white text-2xl font-bold">AI</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Welcome Back
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-600"
          >
            Sign in to access your AI-powered CS tools
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
          onSubmit={handleSubmit}
        >
          <div className="card-body space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`input ${errors.email ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-error-600"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`input ${errors.password ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-error-600"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login; 