import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { aiToolsAPI, userAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [highlight, setHighlight] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    {
      name: 'Code Generator',
      icon: '💻',
      path: '/tools/code-generator',
      description: 'Generate code from problem statements'
    },
    {
      name: 'Resume Analyzer',
      icon: '📄',
      path: '/tools/resume-analyzer',
      description: 'Analyze resumes for ATS optimization'
    },
    {
      name: 'Interview Questions',
      icon: '❓',
      path: '/tools/interview-questions',
      description: 'Generate personalized interview questions'
    },
    {
      name: 'Code Reviewer',
      icon: '🔍',
      path: '/tools/code-reviewer',
      description: 'Get expert code feedback'
    },
    {
      name: 'Time Complexity Analyzer',
      icon: '⏱️',
      path: '/tools/complexity-analyzer',
      description: 'Analyze code time and space complexity'
    },
    {
      name: 'Algorithm Explainer',
      icon: '🧮',
      path: '/tools/algorithm-explainer',
      description: 'Learn algorithms step by step'
    },
    {
      name: 'Roadmap Generator',
      icon: '🗺️',
      path: '/tools/roadmap-generator',
      description: 'Generate learning roadmaps'
    }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [highlightRes, statsRes] = await Promise.all([
          aiToolsAPI.getRandomHighlight(),
          userAPI.getStats()
        ]);

        setHighlight(highlightRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        
        // Set fallback data
        setHighlight({
          tool: 'code-generator',
          title: 'Generate Code Instantly',
          description: 'Describe your problem and get production-ready code in multiple languages',
          icon: '💻',
          color: 'blue'
        });
        setStats({
          totalLogins: user?.loginCount || 1,
          lastLogin: user?.lastLogin || new Date(),
          memberSince: user?.createdAt || new Date(),
          toolsUsed: 0,
          profileCompletion: 50
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      purple: 'from-purple-500 to-pink-500',
      orange: 'from-orange-500 to-red-500',
      red: 'from-red-500 to-pink-500'
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-soft min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">CS Portal</span>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="sidebar-item group"
                  >
                    <span className="text-xl mr-3">{item.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-primary-600">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600">
                Ready to accelerate your CS career with AI-powered tools?
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="card"
              >
                <div className="card-body text-center">
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {stats?.totalLogins || 1}
                  </div>
                  <div className="text-sm text-gray-600">Total Logins</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="card"
              >
                <div className="card-body text-center">
                  <div className="text-2xl font-bold text-success-600 mb-1">
                    {stats?.toolsUsed || 0}
                  </div>
                  <div className="text-sm text-gray-600">Tools Used</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="card"
              >
                <div className="card-body text-center">
                  <div className="text-2xl font-bold text-warning-600 mb-1">
                    {stats?.profileCompletion || 50}%
                  </div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="card"
              >
                <div className="card-body text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {new Date(stats?.memberSince || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">Member Since</div>
                </div>
              </motion.div>
            </div>

            {/* AI Tool Highlight */}
            {highlight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Featured Tool
                </h2>
                <Link to={`/tools/${highlight.tool}`}>
                  <div className={`card bg-gradient-to-r ${getColorClasses(highlight.color)} text-white hover:shadow-medium transition-all duration-300 cursor-pointer`}>
                    <div className="card-body">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{highlight.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
                          <p className="text-white text-opacity-90">{highlight.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link
                  to="/profile"
                  className="card hover:shadow-medium transition-all duration-300 cursor-pointer"
                >
                  <div className="card-body text-center">
                    <div className="text-3xl mb-2">👤</div>
                    <h3 className="font-semibold text-gray-900">Update Profile</h3>
                    <p className="text-sm text-gray-600">Complete your profile</p>
                  </div>
                </Link>

                <Link
                  to="/tools/code-generator"
                  className="card hover:shadow-medium transition-all duration-300 cursor-pointer"
                >
                  <div className="card-body text-center">
                    <div className="text-3xl mb-2">💻</div>
                    <h3 className="font-semibold text-gray-900">Generate Code</h3>
                    <p className="text-sm text-gray-600">Start coding with AI</p>
                  </div>
                </Link>

                <Link
                  to="/tools/resume-analyzer"
                  className="card hover:shadow-medium transition-all duration-300 cursor-pointer"
                >
                  <div className="card-body text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <h3 className="font-semibold text-gray-900">Analyze Resume</h3>
                    <p className="text-sm text-gray-600">Optimize your resume</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 