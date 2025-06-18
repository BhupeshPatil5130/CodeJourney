import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { aiToolsAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';

const RoadmapGenerator = () => {
  const [formData, setFormData] = useState({
    domain: '',
    experienceLevel: 'beginner',
    focusAreas: []
  });
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const popularDomains = [
    'Web Development',
    'Data Structures and Algorithms',
    'DevOps',
    'Machine Learning',
    'Mobile Development',
    'Cybersecurity',
    'Cloud Computing',
    'Database Management',
    'UI/UX Design',
    'Blockchain Development',
    'Game Development',
    'Data Science',
    'Artificial Intelligence',
    'System Design',
    'Software Testing'
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'No prior experience' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience in the field' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced, looking to specialize' }
  ];

  const commonFocusAreas = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Apps',
    'Web Applications',
    'Data Analysis',
    'Machine Learning Models',
    'System Architecture',
    'Security',
    'Performance Optimization',
    'Cloud Infrastructure',
    'Database Design',
    'API Development',
    'Testing and QA',
    'DevOps Practices'
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

  const handleFocusAreaChange = (focusArea) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(focusArea)
        ? prev.focusAreas.filter(area => area !== focusArea)
        : [...prev.focusAreas, focusArea]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required';
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
    setRoadmap(null);

    try {
      const response = await aiToolsAPI.generateRoadmap(formData);
      setRoadmap(response.data);
      toast.success('Learning roadmap generated successfully!');
    } catch (error) {
      console.error('Roadmap generation error:', error);
      const message = error.message || 'Failed to generate roadmap';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      domain: '',
      experienceLevel: 'beginner',
      focusAreas: []
    });
    setRoadmap(null);
    setErrors({});
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
            <div className="text-3xl">🗺️</div>
            <h1 className="text-3xl font-bold text-gray-900">Learning Roadmap Generator</h1>
          </div>
          <p className="text-gray-600">
            Generate personalized learning roadmaps for any tech domain with structured phases, projects, and career guidance.
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
                <h2 className="text-xl font-semibold text-gray-900">Generate Roadmap</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                      Tech Domain
                    </label>
                    <input
                      type="text"
                      id="domain"
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      className={`input ${errors.domain ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="e.g., Web Development, Machine Learning, DevOps..."
                    />
                    {errors.domain && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.domain}
                      </p>
                    )}
                    
                    {/* Popular Domains */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Popular domains:</p>
                      <div className="flex flex-wrap gap-2">
                        {popularDomains.slice(0, 8).map((domain) => (
                          <button
                            key={domain}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, domain }))}
                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                          >
                            {domain}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="input"
                    >
                      {experienceLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Focus Areas (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {commonFocusAreas.map((focusArea) => (
                        <label key={focusArea} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.focusAreas.includes(focusArea)}
                            onChange={() => handleFocusAreaChange(focusArea)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700">{focusArea}</span>
                        </label>
                      ))}
                    </div>
                    {formData.focusAreas.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {formData.focusAreas.join(', ')}
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
                          Generating Roadmap...
                        </div>
                      ) : (
                        'Generate Roadmap'
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

          {/* Roadmap Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Learning Roadmap</h2>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="spinner mx-auto mb-4"></div>
                      <p className="text-gray-600">Generating your personalized learning roadmap...</p>
                    </div>
                  </div>
                ) : roadmap ? (
                  <div className="space-y-6">
                    {/* Header Info */}
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <h3 className="text-xl font-bold text-primary-600 mb-2">
                        {roadmap.domain} Roadmap
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Level: {roadmap.experienceLevel} | Duration: {roadmap.estimatedDuration}
                      </p>
                      <p className="text-sm text-gray-700">{roadmap.overview}</p>
                    </div>

                    {/* Prerequisites */}
                    {roadmap.prerequisites && roadmap.prerequisites.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">📋 Prerequisites</h3>
                        <ul className="space-y-2">
                          {roadmap.prerequisites.map((prereq, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Learning Phases */}
                    {roadmap.phases && roadmap.phases.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">📚 Learning Phases</h3>
                        <div className="space-y-4">
                          {roadmap.phases.map((phase, phaseIndex) => (
                            <div key={phaseIndex} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900">{phase.phase}</h4>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {phase.duration}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                              
                              {phase.topics && phase.topics.length > 0 && (
                                <div className="space-y-3">
                                  {phase.topics.map((topic, topicIndex) => (
                                    <div key={topicIndex} className="bg-gray-50 p-3 rounded">
                                      <h5 className="font-medium text-gray-800 mb-2">{topic.topic}</h5>
                                      <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
                                      
                                      {topic.resources && topic.resources.length > 0 && (
                                        <div className="mb-2">
                                          <span className="text-xs font-medium text-gray-700">Resources:</span>
                                          <ul className="text-xs text-gray-600 mt-1">
                                            {topic.resources.map((resource, resIndex) => (
                                              <li key={resIndex}>• {resource}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {topic.projects && topic.projects.length > 0 && (
                                        <div className="mb-2">
                                          <span className="text-xs font-medium text-gray-700">Projects:</span>
                                          <ul className="text-xs text-gray-600 mt-1">
                                            {topic.projects.map((project, projIndex) => (
                                              <li key={projIndex}>• {project}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {topic.milestone && (
                                        <div className="mt-2 p-2 bg-success-50 rounded">
                                          <span className="text-xs font-medium text-success-700">Milestone:</span>
                                          <p className="text-xs text-success-600 mt-1">{topic.milestone}</p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Advanced Topics */}
                    {roadmap.advancedTopics && roadmap.advancedTopics.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">🚀 Advanced Topics</h3>
                        <div className="flex flex-wrap gap-2">
                          {roadmap.advancedTopics.map((topic, index) => (
                            <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Career Paths */}
                    {roadmap.careerPaths && roadmap.careerPaths.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">💼 Career Paths</h3>
                        <ul className="space-y-2">
                          {roadmap.careerPaths.map((path, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                              {path}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tools */}
                    {roadmap.tools && roadmap.tools.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">🛠️ Essential Tools</h3>
                        <div className="flex flex-wrap gap-2">
                          {roadmap.tools.map((tool, index) => (
                            <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning Tips */}
                    {roadmap.tips && roadmap.tips.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">💡 Learning Tips</h3>
                        <ul className="space-y-2">
                          {roadmap.tips.map((tip, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Communities */}
                    {roadmap.communities && roadmap.communities.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">👥 Communities</h3>
                        <ul className="space-y-2">
                          {roadmap.communities.map((community, index) => (
                            <li key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                              {community}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🗺️</div>
                    <p className="text-gray-500">
                      Enter a tech domain and experience level to generate a personalized learning roadmap.
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

export default RoadmapGenerator; 