import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { aiToolsAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';

const TimeComplexityAnalyzer = () => {
  const [formData, setFormData] = useState({
    code: '',
    language: 'javascript'
  });
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFallback, setIsFallback] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'csharp', label: 'C#', icon: '🔷' },
    { value: 'php', label: 'PHP', icon: '🐘' },
    { value: 'ruby', label: 'Ruby', icon: '💎' },
    { value: 'go', label: 'Go', icon: '🐹' },
    { value: 'rust', label: 'Rust', icon: '🦀' },
    { value: 'swift', label: 'Swift', icon: '🍎' }
  ];

  const sampleCode = {
    javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`
  };

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

  const loadSampleCode = () => {
    const sample = sampleCode[formData.language] || sampleCode.javascript;
    setFormData({
      ...formData,
      code: sample
    });
    toast.info('Sample code loaded!');
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
    setAnalysis(null);
    setIsFallback(false);

    try {
      const response = await aiToolsAPI.analyzeComplexity(formData);
      setAnalysis(response.data);
      
      // Show appropriate message based on whether it's a fallback analysis
      if (response.isFallback) {
        toast.warning('AI service temporarily unavailable. Showing basic analysis based on code patterns.');
        setIsFallback(true);
      } else {
        toast.success('Time complexity analysis completed successfully!');
        setIsFallback(false);
      }
    } catch (error) {
      console.error('Complexity analysis error:', error);
      const message = error.message || 'Failed to analyze time complexity';
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
    setAnalysis(null);
    setErrors({});
    setIsFallback(false);
  };

  const getEfficiencyColor = (efficiency) => {
    switch (efficiency?.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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
            <div className="text-3xl">⏱️</div>
            <h1 className="text-3xl font-bold text-gray-900">Time Complexity Analyzer</h1>
          </div>
          <p className="text-gray-600">
            Analyze and understand the time and space complexity of your code with detailed explanations and optimization suggestions.
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
                <h2 className="text-xl font-semibold text-gray-900">Analyze Code Complexity</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Language Selection */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                      Programming Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="select"
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.icon} {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Code Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Code to Analyze
                      </label>
                      <button
                        type="button"
                        onClick={loadSampleCode}
                        className="text-sm text-primary-600 hover:text-primary-500 underline"
                      >
                        Load Sample Code
                      </button>
                    </div>
                    <textarea
                      id="code"
                      name="code"
                      rows="15"
                      value={formData.code}
                      onChange={handleChange}
                      className={`textarea ${errors.code ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Paste your code here to analyze its time and space complexity..."
                    />
                    {errors.code && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.code}
                      </p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner mr-2"></div>
                        Analyzing Complexity...
                      </div>
                    ) : (
                      '⏱️ Analyze Time Complexity'
                    )}
                  </motion.button>
                </form>

                {/* Clear Button */}
                {(formData.code || analysis) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={clearForm}
                    className="w-full btn-secondary py-2 mt-4"
                  >
                    Clear All
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Complexity Analysis Results</h2>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="spinner mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        Analyzing your code's complexity...
                      </p>
                    </div>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    {/* Fallback Warning Banner */}
                    {isFallback && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                          <div className="text-yellow-600 mr-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-yellow-800">
                              Basic Analysis Mode
                            </h3>
                            <p className="text-sm text-yellow-700 mt-1">
                              AI service is temporarily unavailable. This analysis is based on code patterns and may not be as detailed as AI-powered analysis.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Overview */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">📋 Code Overview</h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {analysis.overview}
                      </p>
                    </div>

                    {/* Algorithm Analysis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600 mb-2">
                          {analysis.algorithmAnalysis.algorithmType}
                        </div>
                        <p className="text-sm text-gray-600">Algorithm Type</p>
                      </div>
                      <div className="text-center p-4 rounded-lg">
                        <div className={`text-lg font-bold mb-2 px-3 py-1 rounded ${getEfficiencyColor(analysis.algorithmAnalysis.efficiency)}`}>
                          {analysis.algorithmAnalysis.efficiency}
                        </div>
                        <p className="text-sm text-gray-600">Efficiency Rating</p>
                      </div>
                    </div>

                    {/* Time Complexity */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">⏱️ Time Complexity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-sm font-bold text-green-600 mb-1">Best Case</div>
                          <div className="text-xs text-gray-700">{analysis.timeComplexity.bestCase}</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-sm font-bold text-blue-600 mb-1">Average Case</div>
                          <div className="text-xs text-gray-700">{analysis.timeComplexity.averageCase}</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded">
                          <div className="text-sm font-bold text-red-600 mb-1">Worst Case</div>
                          <div className="text-xs text-gray-700">{analysis.timeComplexity.worstCase}</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-gray-900 mb-2">Detailed Analysis</h4>
                        <p className="text-sm text-gray-700">{analysis.timeComplexity.detailedAnalysis}</p>
                      </div>
                    </div>

                    {/* Space Complexity */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">💾 Space Complexity</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-sm font-bold text-purple-600 mb-1">Auxiliary Space</div>
                          <div className="text-xs text-gray-700">{analysis.spaceComplexity.auxiliary}</div>
                        </div>
                        <div className="text-center p-3 bg-indigo-50 rounded">
                          <div className="text-sm font-bold text-indigo-600 mb-1">Total Space</div>
                          <div className="text-xs text-gray-700">{analysis.spaceComplexity.total}</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="font-medium text-gray-900 mb-2">Detailed Analysis</h4>
                        <p className="text-sm text-gray-700">{analysis.spaceComplexity.detailedAnalysis}</p>
                      </div>
                    </div>

                    {/* Code Breakdown */}
                    {analysis.codeBreakdown && analysis.codeBreakdown.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">🔍 Code Breakdown</h3>
                        <div className="space-y-2">
                          {analysis.codeBreakdown.map((breakdown, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900">{breakdown.operation}</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {breakdown.complexity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">{breakdown.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Optimization Suggestions */}
                    {analysis.optimizationSuggestions && analysis.optimizationSuggestions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">💡 Optimization Suggestions</h3>
                        <div className="space-y-3">
                          {analysis.optimizationSuggestions.map((suggestion, index) => (
                            <div key={index} className="bg-green-50 border border-green-200 p-4 rounded">
                              <h4 className="font-medium text-green-900 mb-2">{suggestion.suggestion}</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Impact:</span>
                                  <p className="text-gray-600">{suggestion.impact}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Trade-off:</span>
                                  <p className="text-gray-600">{suggestion.tradeoff}</p>
                                </div>
                              </div>
                              <div className="mt-2">
                                <span className="font-medium text-gray-700">Implementation:</span>
                                <p className="text-gray-600 text-sm">{suggestion.implementation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Real World Implications */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">🌍 Real World Implications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Scalability</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {analysis.realWorldImplications.scalability}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {analysis.realWorldImplications.performance}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Use Cases</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {analysis.realWorldImplications.useCases?.map((useCase, index) => (
                              <li key={index} className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                {useCase}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Limitations</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {analysis.realWorldImplications.limitations?.map((limitation, index) => (
                              <li key={index} className="flex items-center">
                                <span className="text-red-500 mr-2">⚠</span>
                                {limitation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Visualization */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">📊 Complexity Visualization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <h4 className="font-medium text-gray-900 mb-2">Complexity Growth</h4>
                          <p className="text-sm text-gray-700">{analysis.visualization.complexityGraph}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <h4 className="font-medium text-gray-900 mb-2">Comparison Chart</h4>
                          <p className="text-sm text-gray-700">{analysis.visualization.comparisonChart}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">⏱️</div>
                    <p className="text-gray-500">
                      Your complexity analysis will appear here
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

export default TimeComplexityAnalyzer; 