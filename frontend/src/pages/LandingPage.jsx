import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const features = [
    {
      icon: '💻',
      title: 'Code Generator',
      description: 'Generate clean, efficient code in multiple programming languages with AI assistance.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📄',
      title: 'Resume Analyzer',
      description: 'Get ATS-friendly resume analysis with actionable improvement suggestions.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '❓',
      title: 'Interview Questions',
      description: 'Generate personalized interview questions based on your experience and skills.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🔍',
      title: 'Code Reviewer',
      description: 'Get expert feedback on your code with security and performance analysis.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🧮',
      title: 'Algorithm Explainer',
      description: 'Understand complex algorithms with step-by-step explanations and examples.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: '🚀',
      title: 'Career Growth',
      description: 'Accelerate your career with AI-powered tools designed for CS students.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg"
            >
              AI-Powered Tools for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                CS Students
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto"
            >
              Generate code, analyze resumes, prepare for interviews, and master algorithms with advanced AI assistance.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="btn glass-effect text-white hover:bg-white hover:bg-opacity-20 px-8 py-3 text-lg font-semibold"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 text-4xl opacity-20"
        >
          💻
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 text-3xl opacity-20"
        >
          🚀
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 text-2xl opacity-20"
        >
          🧮
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Tools for Every CS Student
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From code generation to career preparation, our AI-powered tools help you excel in your computer science journey.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card hover:shadow-medium transition-all duration-300"
              >
                <div className="card-body text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Accelerate Your CS Career?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of computer science students who are already using AI to enhance their skills and career prospects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary px-8 py-3 text-lg font-semibold"
              >
                Start Your Free Journey
              </Link>
              <Link
                to="/login"
                className="btn-secondary px-8 py-3 text-lg font-semibold"
              >
                Sign In to Continue
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold">CS Portal</span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering computer science students with AI-powered tools for success.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 