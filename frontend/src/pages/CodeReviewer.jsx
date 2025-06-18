import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { aiToolsAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';

const CodeReviewer = () => {
  const [formData, setFormData] = useState({
    code: '',
    language: 'javascript'
  });
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟡' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '🔵' },
    { value: 'csharp', label: 'C#', icon: '🟣' },
    { value: 'php', label: 'PHP', icon: '🟣' },
    { value: 'ruby', label: 'Ruby', icon: '🔴' },
    { value: 'go', label: 'Go', icon: '🔵' },
    { value: 'rust', label: 'Rust', icon: '🟠' },
    { value: 'swift', label: 'Swift', icon: '🟠' }
  ];

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

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (formData.code.trim().length < 10) {
      newErrors.code = 'Code must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setReview(null);

    try {
      const response = await aiToolsAPI.reviewCode(formData);
      setReview(response.data);
      toast.success('Code review completed successfully!');
    } catch (error) {
      console.error('Code review error:', error);
      const message = error.message || 'Failed to review code';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      code: '',
      language: 'javascript'
    });
    setReview(null);
    setErrors({});
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900">Code Reviewer</h1>
          </div>
          <p className="text-gray-600">
            Get expert feedback on your code with detailed analysis and improvement suggestions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Review Code</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                      Programming Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="input"
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.icon} {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                      Code to Review
                    </label>
                    <textarea
                      id="code"
                      name="code"
                      rows="15"
                      value={formData.code}
                      onChange={handleChange}
                      className={`textarea font-mono text-sm ${errors.code ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Paste your code here for review..."
                    />
                    {errors.code && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.code}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="spinner mr-2"></div>
                          Reviewing Code...
                        </div>
                      ) : (
                        'Review Code'
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={clearForm}
                      className="btn-secondary py-3"
                    >
                      Clear
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Review Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Review Results</h2>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="spinner mx-auto mb-4"></div>
                      <p className="text-gray-600">Analyzing your code...</p>
                    </div>
                  </div>
                ) : review ? (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        Code Quality Score: {review.score}/10
                      </div>
                      <p className="text-sm text-gray-600">Overall code quality assessment</p>
                    </div>

                    {/* Issues */}
                    {review.issues && review.issues.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-red-500 mr-2">⚠️</span>
                          Issues Found
                        </h3>
                        <div className="space-y-3">
                          {review.issues.map((issue, index) => (
                            <div key={index} className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-red-800 mb-1">
                                    {issue.type}: {issue.message}
                                  </p>
                                  {issue.line && (
                                    <p className="text-xs text-red-600">Line {issue.line}</p>
                                  )}
                                  {issue.suggestion && (
                                    <p className="text-xs text-red-700 mt-1">
                                      Suggestion: {issue.suggestion}
                                    </p>
                                  )}
                                </div>
                                {issue.severity && (
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    issue.severity === 'high' ? 'bg-red-200 text-red-800' :
                                    issue.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                    'bg-blue-200 text-blue-800'
                                  }`}>
                                    {issue.severity}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths */}
                    {review.strengths && review.strengths.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-green-500 mr-2">✅</span>
                          Strengths
                        </h3>
                        <ul className="space-y-2">
                          {review.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {review.suggestions && review.suggestions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-blue-500 mr-2">💡</span>
                          Improvement Suggestions
                        </h3>
                        <ul className="space-y-2">
                          {review.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Security Analysis */}
                    {review.security && review.security.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-orange-500 mr-2">🔒</span>
                          Security Analysis
                        </h3>
                        <ul className="space-y-2">
                          {review.security.map((item, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-orange-50 p-2 rounded">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Performance Tips */}
                    {review.performance && review.performance.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-purple-500 mr-2">⚡</span>
                          Performance Tips
                        </h3>
                        <ul className="space-y-2">
                          {review.performance.map((tip, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-purple-50 p-2 rounded">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improved Code */}
                    {review.improvedCode && (
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-gray-900 flex items-center">
                            <span className="text-green-500 mr-2">✨</span>
                            Improved Code
                          </h3>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyToClipboard(review.improvedCode)}
                            className="btn-secondary text-sm py-1 px-3"
                          >
                            Copy Code
                          </motion.button>
                        </div>
                        <div className="relative">
                          <SyntaxHighlighter
                            language={formData.language}
                            style={tomorrow}
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem'
                            }}
                          >
                            {review.improvedCode}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )}

                    {/* Best Practices */}
                    {review.bestPractices && review.bestPractices.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-indigo-500 mr-2">📚</span>
                          Best Practices
                        </h3>
                        <ul className="space-y-2">
                          {review.bestPractices.map((practice, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-indigo-50 p-2 rounded">
                              {practice}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-gray-500">
                      Paste your code and select the programming language to get a detailed review.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewer; 