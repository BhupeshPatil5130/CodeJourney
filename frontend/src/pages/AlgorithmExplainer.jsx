import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { aiToolsAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';

const AlgorithmExplainer = () => {
  const [formData, setFormData] = useState({
    algorithmName: '',
    complexity: 'detailed'
  });
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const complexityLevels = [
    { value: 'simple', label: 'Simple', description: 'Basic overview and concept' },
    { value: 'detailed', label: 'Detailed', description: 'Step-by-step explanation with examples' },
    { value: 'advanced', label: 'Advanced', description: 'Deep dive with optimization techniques' }
  ];

  const popularAlgorithms = [
    'Binary Search',
    'Bubble Sort',
    'Quick Sort',
    'Merge Sort',
    'Heap Sort',
    'Insertion Sort',
    'Selection Sort',
    'Linear Search',
    'Depth First Search (DFS)',
    'Breadth First Search (BFS)',
    'Dijkstra\'s Algorithm',
    'Bellman-Ford Algorithm',
    'Floyd-Warshall Algorithm',
    'Kruskal\'s Algorithm',
    'Prim\'s Algorithm',
    'Dynamic Programming',
    'Greedy Algorithm',
    'Backtracking',
    'Divide and Conquer',
    'Two Pointers',
    'Sliding Window',
    'Binary Tree Traversal',
    'Graph Traversal',
    'String Matching',
    'Hashing'
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

    if (!formData.algorithmName.trim()) {
      newErrors.algorithmName = 'Algorithm name is required';
    } else if (formData.algorithmName.trim().length < 2) {
      newErrors.algorithmName = 'Algorithm name must be at least 2 characters';
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
    setExplanation(null);

    try {
      const response = await aiToolsAPI.explainAlgorithm(formData);
      console.log('Algorithm explanation response:', response.data);
      setExplanation(response.data);
      toast.success('Algorithm explanation generated successfully!');
    } catch (error) {
      console.error('Algorithm explanation error:', error);
      const message = error.message || 'Failed to explain algorithm';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      algorithmName: '',
      complexity: 'detailed'
    });
    setExplanation(null);
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

  // Safe rendering function to handle any data type
  const renderSafeContent = (content, isCode = false) => {
    if (!content) return null;
    
    if (typeof content === 'string') {
      return isCode ? content : <p className="text-sm text-gray-700">{content}</p>;
    } else if (Array.isArray(content)) {
      return (
        <ul className="space-y-2">
          {content.map((item, index) => (
            <li key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
              {typeof item === 'string' ? item : JSON.stringify(item, null, 2)}
            </li>
          ))}
        </ul>
      );
    } else if (typeof content === 'object') {
      return (
        <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }
    
    return <p className="text-sm text-gray-700">{String(content)}</p>;
  };

  // Safe rendering for code content
  const renderSafeCode = (content, language = 'javascript') => {
    if (!content) return null;
    
    const codeString = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    
    return (
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        }}
      >
        {codeString}
      </SyntaxHighlighter>
    );
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
            <div className="text-3xl">🧮</div>
            <h1 className="text-3xl font-bold text-gray-900">Algorithm Explainer</h1>
          </div>
          <p className="text-gray-600">
            Learn algorithms step by step with detailed explanations, code examples, and complexity analysis.
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
                <h2 className="text-xl font-semibold text-gray-900">Explain Algorithm</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="algorithmName" className="block text-sm font-medium text-gray-700 mb-2">
                      Algorithm Name
                    </label>
                    <input
                      id="algorithmName"
                      name="algorithmName"
                      type="text"
                      value={formData.algorithmName}
                      onChange={handleChange}
                      className={`input ${errors.algorithmName ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Enter algorithm name (e.g., Binary Search, Quick Sort)"
                      list="algorithms"
                    />
                    <datalist id="algorithms">
                      {popularAlgorithms.map((algo) => (
                        <option key={algo} value={algo} />
                      ))}
                    </datalist>
                    {errors.algorithmName && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.algorithmName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="complexity" className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation Complexity
                    </label>
                    <select
                      id="complexity"
                      name="complexity"
                      value={formData.complexity}
                      onChange={handleChange}
                      className="input"
                    >
                      {complexityLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
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
                          Explaining Algorithm...
                        </div>
                      ) : (
                        'Explain Algorithm'
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

                {/* Popular Algorithms */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Algorithms</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularAlgorithms.slice(0, 12).map((algo) => (
                      <motion.button
                        key={algo}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, algorithmName: algo })}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      >
                        {algo}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Explanation Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Algorithm Explanation</h2>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="spinner mx-auto mb-4"></div>
                      <p className="text-gray-600">Generating algorithm explanation...</p>
                    </div>
                  </div>
                ) : explanation ? (
                  <div className="space-y-6">
                    {(() => {
                      try {
                        return (
                          <>
                            {/* Overview */}
                            {explanation.overview && (
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <span className="text-blue-500 mr-2">📖</span>
                                  Overview
                                </h3>
                                <div className="bg-blue-50 p-3 rounded">
                                  {renderSafeContent(explanation.overview)}
                                </div>
                              </div>
                            )}

                            {/* How it Works */}
                            {explanation.howItWorks && (
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <span className="text-green-500 mr-2">⚙️</span>
                                  How It Works
                                </h3>
                                <div className="bg-green-50 p-3 rounded-lg">
                                  {renderSafeContent(explanation.howItWorks)}
                                </div>
                              </div>
                            )}

                            {/* Pseudocode */}
                            {explanation.pseudocode && (
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-semibold text-gray-900 flex items-center">
                                    <span className="text-purple-500 mr-2">📝</span>
                                    Pseudocode
                                  </h3>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => copyToClipboard(typeof explanation.pseudocode === 'string' ? explanation.pseudocode : JSON.stringify(explanation.pseudocode, null, 2))}
                                    className="btn-secondary text-sm py-1 px-3"
                                  >
                                    Copy
                                  </motion.button>
                                </div>
                                <div className="relative">
                                  {renderSafeCode(explanation.pseudocode, 'pseudocode')}
                                </div>
                              </div>
                            )}

                            {/* Implementation */}
                            {explanation.implementation && (
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <h3 className="font-semibold text-gray-900 flex items-center">
                                    <span className="text-orange-500 mr-2">💻</span>
                                    Implementation
                                  </h3>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => copyToClipboard(typeof explanation.implementation === 'string' ? explanation.implementation : JSON.stringify(explanation.implementation, null, 2))}
                                    className="btn-secondary text-sm py-1 px-3"
                                  >
                                    Copy Code
                                  </motion.button>
                                </div>
                                <div className="relative">
                                  {renderSafeCode(explanation.implementation, 'javascript')}
                                </div>
                              </div>
                            )}

                            {/* Time & Space Complexity */}
                            {(explanation.timeComplexity || explanation.spaceComplexity) && (
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <span className="text-red-500 mr-2">⏱️</span>
                                  Time & Space Complexity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {explanation.timeComplexity && (
                                    <div className="bg-red-50 p-3 rounded-lg">
                                      <h4 className="font-medium text-red-800 mb-2">Time Complexity</h4>
                                      {renderSafeContent(explanation.timeComplexity)}
                                    </div>
                                  )}
                                  {explanation.spaceComplexity && (
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                      <h4 className="font-medium text-blue-800 mb-2">Space Complexity</h4>
                                      {renderSafeContent(explanation.spaceComplexity)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Advantages & Disadvantages */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {explanation.advantages && (
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="text-green-500 mr-2">✅</span>
                                    Advantages
                                  </h3>
                                  {renderSafeContent(explanation.advantages)}
                                </div>
                              )}

                              {explanation.disadvantages && (
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="text-red-500 mr-2">❌</span>
                                    Disadvantages
                                  </h3>
                                  {renderSafeContent(explanation.disadvantages)}
                                </div>
                              )}
                            </div>

                            {/* Use Cases */}
                            {explanation.useCases && (
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <span className="text-indigo-500 mr-2">🎯</span>
                                  Use Cases
                                </h3>
                                {renderSafeContent(explanation.useCases)}
                              </div>
                            )}

                            {/* Example */}
                            {explanation.example && (
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                  <span className="text-yellow-500 mr-2">🔍</span>
                                  Example
                                </h3>
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                  {renderSafeContent(explanation.example)}
                                </div>
                              </div>
                            )}

                            {/* Additional fields that might be returned */}
                            {Object.keys(explanation).map(key => {
                              // Skip fields we've already handled
                              const handledFields = ['overview', 'howItWorks', 'pseudocode', 'implementation', 'timeComplexity', 'spaceComplexity', 'advantages', 'disadvantages', 'useCases', 'example'];
                              if (handledFields.includes(key)) return null;
                              
                              const value = explanation[key];
                              if (!value) return null;
                              
                              return (
                                <div key={key}>
                                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <span className="text-gray-500 mr-2">📄</span>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </h3>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    {renderSafeContent(value)}
                                  </div>
                                </div>
                              );
                            })}
                          </>
                        );
                      } catch (error) {
                        console.error('Error rendering explanation:', error);
                        return (
                          <div className="text-center py-8">
                            <p className="text-red-600 mb-4">Error rendering algorithm explanation</p>
                            <pre className="text-sm text-gray-600 bg-gray-100 p-4 rounded overflow-auto">
                              {JSON.stringify(explanation, null, 2)}
                            </pre>
                          </div>
                        );
                      }
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🧮</div>
                    <p className="text-gray-500">
                      Enter an algorithm name and select complexity level to get a detailed explanation.
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

export default AlgorithmExplainer; 