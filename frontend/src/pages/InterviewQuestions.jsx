import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { aiToolsAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';

const InterviewQuestions = () => {
  const [formData, setFormData] = useState({
    resumeText: '',
    jobTitle: 'Software Engineer'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'pdf'

  const jobTitles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Product Manager',
    'UI/UX Designer',
    'QA Engineer',
    'System Administrator'
  ];

  const sampleResumeText = `John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

SUMMARY
Experienced software engineer with 3+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable applications and solving complex technical challenges.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2022 - Present
• Developed and maintained React-based web applications serving 100K+ users
• Implemented RESTful APIs using Node.js and Express.js
• Collaborated with cross-functional teams using Agile methodologies
• Optimized database queries reducing response time by 40%

Software Engineer | StartupXYZ | 2021 - 2022
• Built responsive web applications using React and TypeScript
• Integrated third-party APIs and payment systems
• Participated in code reviews and mentored junior developers
• Deployed applications using Docker and AWS

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java
Frontend: React, Redux, HTML5, CSS3, Bootstrap
Backend: Node.js, Express.js, Python Flask
Databases: MongoDB, PostgreSQL, Redis
Tools: Git, Docker, AWS, Jenkins, Jira

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2017 - 2021`;

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

  const validateTextForm = () => {
    const newErrors = {};

    if (!formData.resumeText.trim()) {
      newErrors.resumeText = 'Resume text is required';
    } else if (formData.resumeText.trim().length < 50) {
      newErrors.resumeText = 'Resume text must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePDFForm = () => {
    const newErrors = {};

    if (!selectedFile) {
      newErrors.pdfFile = 'Please select a PDF file';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateTextForm()) {
      return;
    }

    setIsLoading(true);
    setQuestions(null);

    try {
      console.log('Submitting form data:', formData);
      const response = await aiToolsAPI.generateQuestions(formData);
      console.log('Interview questions response:', response);
      
      // Transform the response to match frontend expectations
      const transformedQuestions = transformQuestionsResponse(response.data);
      setQuestions(transformedQuestions);
      toast.success('Interview questions generated successfully!');
    } catch (error) {
      console.error('Question generation error:', error);
      const message = error.message || 'Failed to generate interview questions';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePDFSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePDFForm()) {
      return;
    }

    setIsLoading(true);
    setQuestions(null);

    try {
      console.log('Submitting PDF with job title:', formData.jobTitle);
      const response = await aiToolsAPI.generateQuestionsPDF(selectedFile, formData.jobTitle);
      console.log('PDF interview questions response:', response);
      
      // Transform the response to match frontend expectations
      const transformedQuestions = transformQuestionsResponse(response.data);
      setQuestions(transformedQuestions);
      toast.success('Interview questions generated successfully from PDF!');
    } catch (error) {
      console.error('PDF question generation error:', error);
      const message = error.message || 'Failed to generate interview questions from PDF';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform backend response to frontend format
  const transformQuestionsResponse = (data) => {
    console.log('Transforming questions response:', data);
    
    const transformed = {
      extractedText: data.extractedText || null
    };

    // Handle all question types with new advanced format
    const questionTypes = ['technical', 'behavioral', 'projectBased', 'systemDesign', 'coding', 'tips', 'redFlags', 'preparation'];
    
    questionTypes.forEach(type => {
      if (data[type] && Array.isArray(data[type])) {
        transformed[type] = data[type];
      }
    });

    // Fallback for old format
    if (!transformed.technical && data.technicalQuestions) {
      transformed.technical = data.technicalQuestions.map(q => 
        typeof q === 'string' ? q : q.question || JSON.stringify(q)
      );
    }
    if (!transformed.behavioral && data.behavioralQuestions) {
      transformed.behavioral = data.behavioralQuestions.map(q => 
        typeof q === 'string' ? q : q.question || JSON.stringify(q)
      );
    }
    if (!transformed.projectBased && data.projectQuestions) {
      transformed.projectBased = data.projectQuestions.map(q => 
        typeof q === 'string' ? q : q.question || JSON.stringify(q)
      );
    }

    console.log('Transformed questions:', transformed);
    return transformed;
  };

  // Helper function to render question cards
  const renderQuestionCard = (question, index, type) => {
    if (typeof question === 'string') {
      return (
        <div key={index} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-gray-800 font-medium">
            {index + 1}. {question}
          </p>
        </div>
      );
    }

    // Handle advanced format
    const getTypeColor = (type) => {
      const colors = {
        technical: 'blue',
        behavioral: 'green',
        projectBased: 'purple',
        systemDesign: 'orange',
        coding: 'indigo',
        tips: 'yellow',
        redFlags: 'red',
        preparation: 'teal'
      };
      return colors[type] || 'gray';
    };

    const color = getTypeColor(type);
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-400 text-blue-800',
      green: 'bg-green-50 border-green-400 text-green-800',
      purple: 'bg-purple-50 border-purple-400 text-purple-800',
      orange: 'bg-orange-50 border-orange-400 text-orange-800',
      indigo: 'bg-indigo-50 border-indigo-400 text-indigo-800',
      yellow: 'bg-yellow-50 border-yellow-400 text-yellow-800',
      red: 'bg-red-50 border-red-400 text-red-800',
      teal: 'bg-teal-50 border-teal-400 text-teal-800'
    };

    return (
      <div key={index} className={`${colorClasses[color]} p-4 rounded-lg border-l-4 mb-4`}>
        <div className="space-y-3">
          {/* Main Question */}
          <div>
            <h4 className="font-semibold text-lg mb-2 break-words">
              {index + 1}. {question.question}
            </h4>
          </div>

          {/* Difficulty Badge */}
          {question.difficulty && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-600">Difficulty:</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty.toUpperCase()}
              </span>
            </div>
          )}

          {/* Category */}
          {question.category && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-600">Category:</span>
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                {question.category}
              </span>
            </div>
          )}

          {/* Expected Answer */}
          {question.expectedAnswer && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Expected Answer:</h5>
              <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                <p className="whitespace-pre-wrap">{question.expectedAnswer}</p>
              </div>
            </div>
          )}

          {/* STAR Method */}
          {question.starMethod && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">STAR Method:</h5>
              <div className="text-sm text-gray-600 bg-white p-3 rounded border">
                <p className="whitespace-pre-wrap">{question.starMethod}</p>
              </div>
            </div>
          )}

          {/* Focus */}
          {question.focus && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Focus:</h5>
              <p className="text-sm text-gray-600 break-words">{question.focus}</p>
            </div>
          )}

          {/* Technical Depth */}
          {question.technicalDepth && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Technical Depth:</h5>
              <p className="text-sm text-gray-600 break-words">{question.technicalDepth}</p>
            </div>
          )}

          {/* Business Impact */}
          {question.businessImpact && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Business Impact:</h5>
              <p className="text-sm text-gray-600 break-words">{question.businessImpact}</p>
            </div>
          )}

          {/* Scale */}
          {question.scale && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Scale:</h5>
              <p className="text-sm text-gray-600 break-words">{question.scale}</p>
            </div>
          )}

          {/* Language */}
          {question.language && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Language:</h5>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {question.language}
              </span>
            </div>
          )}

          {/* Approach */}
          {question.approach && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Approach:</h5>
              <p className="text-sm text-gray-600 break-words">{question.approach}</p>
            </div>
          )}

          {/* Lists */}
          {question.followUpQuestions && question.followUpQuestions.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Follow-up Questions:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {question.followUpQuestions.map((q, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                    <span className="break-words">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.redFlags && question.redFlags.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-red-700 mb-1">Red Flags:</h5>
              <ul className="text-sm text-red-600 space-y-1">
                {question.redFlags.map((flag, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-400 mr-2 flex-shrink-0">⚠️</span>
                    <span className="break-words">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.greenFlags && question.greenFlags.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-green-700 mb-1">Green Flags:</h5>
              <ul className="text-sm text-green-600 space-y-1">
                {question.greenFlags.map((flag, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-400 mr-2 flex-shrink-0">✅</span>
                    <span className="break-words">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.constraints && question.constraints.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Constraints:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {question.constraints.map((constraint, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                    <span className="break-words">{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.components && question.components.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Components:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {question.components.map((component, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                    <span className="break-words">{component}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.tradeoffs && question.tradeoffs.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Trade-offs:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {question.tradeoffs.map((tradeoff, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                    <span className="break-words">{tradeoff}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.challenges && question.challenges.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Challenges:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {question.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                    <span className="break-words">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.edgeCases && question.edgeCases.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Edge Cases:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {question.edgeCases.map((edgeCase, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                    <span className="break-words">{edgeCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {question.optimization && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Optimization:</h5>
              <p className="text-sm text-gray-600 break-words">{question.optimization}</p>
            </div>
          )}

          {/* For tips, redFlags, and preparation */}
          {question.tip && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Tip:</h5>
              <p className="text-sm text-gray-600 break-words">{question.tip}</p>
            </div>
          )}

          {question.reasoning && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Why Important:</h5>
              <p className="text-sm text-gray-600 break-words">{question.reasoning}</p>
            </div>
          )}

          {question.warning && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Warning:</h5>
              <p className="text-sm text-gray-600 break-words">{question.warning}</p>
            </div>
          )}

          {question.why && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Why Concerning:</h5>
              <p className="text-sm text-gray-600 break-words">{question.why}</p>
            </div>
          )}

          {question.suggestion && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Suggestion:</h5>
              <p className="text-sm text-gray-600 break-words">{question.suggestion}</p>
            </div>
          )}

          {question.resources && question.resources.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Resources:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {question.resources.map((resource, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gray-400 mr-2 flex-shrink-0">📚</span>
                    <span className="break-words">{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors({ pdfFile: 'Please select a PDF file' });
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors({ pdfFile: 'File size must be less than 10MB' });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrors({});
    }
  };

  const clearForm = () => {
    setFormData({
      resumeText: '',
      jobTitle: 'Software Engineer'
    });
    setSelectedFile(null);
    setQuestions(null);
    setErrors({});
  };

  const loadSampleResume = () => {
    setFormData({
      ...formData,
      resumeText: sampleResumeText
    });
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
            <div className="text-3xl">❓</div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Questions Generator</h1>
          </div>
          <p className="text-gray-600">
            Generate personalized interview questions based on your resume and target job position. Upload a PDF or paste your resume text.
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
                <h2 className="text-xl font-semibold text-gray-900">Generate Questions</h2>
              </div>
              <div className="card-body">
                {/* Input Mode Toggle */}
                <div className="mb-6">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setInputMode('text')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        inputMode === 'text'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📝 Text Input
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('pdf')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        inputMode === 'pdf'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📄 PDF Upload
                    </button>
                  </div>
                </div>

                {inputMode === 'text' ? (
                  <form onSubmit={handleTextSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Target Job Title
                      </label>
                      <select
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className="input"
                      >
                        {jobTitles.map((title) => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-2">
                        Resume Content
                      </label>
                      <div className="mb-2">
                        <button
                          type="button"
                          onClick={loadSampleResume}
                          className="text-sm text-primary-600 hover:text-primary-500 underline"
                        >
                          Load Sample Resume for Testing
                        </button>
                      </div>
                      <textarea
                        id="resumeText"
                        name="resumeText"
                        rows="12"
                        value={formData.resumeText}
                        onChange={handleChange}
                        className={`textarea ${errors.resumeText ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                        placeholder="Paste your resume content here to generate relevant interview questions..."
                      />
                      {errors.resumeText && (
                        <p className="mt-1 text-sm text-error-600">
                          {errors.resumeText}
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
                            Generating Questions...
                          </div>
                        ) : (
                          'Generate Questions'
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
                ) : (
                  <form onSubmit={handlePDFSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Target Job Title
                      </label>
                      <select
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className="input"
                      >
                        {jobTitles.map((title) => (
                          <option key={title} value={title}>
                            {title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-2">
                        Upload PDF Resume
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <div className="text-4xl mb-4">📄</div>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="pdfFile"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                            >
                              <span>Upload a PDF file</span>
                              <input
                                id="pdfFile"
                                name="pdfFile"
                                type="file"
                                accept=".pdf"
                                className="sr-only"
                                onChange={handleFileChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PDF up to 10MB</p>
                          {selectedFile && (
                            <p className="text-sm text-success-600 font-medium">
                              Selected: {selectedFile.name}
                            </p>
                          )}
                        </div>
                      </div>
                      {errors.pdfFile && (
                        <p className="mt-1 text-sm text-error-600">
                          {errors.pdfFile}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading || !selectedFile}
                        className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="spinner mr-2"></div>
                            Generating Questions...
                          </div>
                        ) : (
                          'Generate Questions from PDF'
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
                )}
              </div>
            </div>
          </motion.div>

          {/* Questions Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900">Generated Questions</h2>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="spinner mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        {inputMode === 'pdf' ? 'Generating questions from PDF...' : 'Generating interview questions...'}
                      </p>
                    </div>
                  </div>
                ) : questions ? (
                  <div className="space-y-6">
                    {/* Extracted Text Preview (for PDF) */}
                    {questions.extractedText && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">📄 Extracted Text Preview</h3>
                        <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 max-h-48 overflow-y-auto border">
                          <pre className="whitespace-pre-wrap font-sans">{questions.extractedText}</pre>
                        </div>
                      </div>
                    )}

                    {/* Technical Questions */}
                    {questions.technical && questions.technical.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-blue-500 mr-2">💻</span>
                          Technical Questions
                        </h3>
                        <div className="space-y-3">
                          {questions.technical.map((question, index) => 
                            renderQuestionCard(question, index, 'technical'))}
                        </div>
                      </div>
                    )}

                    {/* Behavioral Questions */}
                    {questions.behavioral && questions.behavioral.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-green-500 mr-2">🤝</span>
                          Behavioral Questions
                        </h3>
                        <div className="space-y-3">
                          {questions.behavioral.map((question, index) => 
                            renderQuestionCard(question, index, 'behavioral'))}
                        </div>
                      </div>
                    )}

                    {/* Project-Based Questions */}
                    {questions.projectBased && questions.projectBased.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-purple-500 mr-2">📁</span>
                          Project-Based Questions
                        </h3>
                        <div className="space-y-3">
                          {questions.projectBased.map((question, index) => 
                            renderQuestionCard(question, index, 'projectBased'))}
                        </div>
                      </div>
                    )}

                    {/* System Design Questions */}
                    {questions.systemDesign && questions.systemDesign.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-orange-500 mr-2">🏗️</span>
                          System Design Questions
                        </h3>
                        <div className="space-y-3">
                          {questions.systemDesign.map((question, index) => 
                            renderQuestionCard(question, index, 'systemDesign'))}
                        </div>
                      </div>
                    )}

                    {/* Coding Questions */}
                    {questions.coding && questions.coding.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-indigo-500 mr-2">💻</span>
                          Coding Problems
                        </h3>
                        <div className="space-y-3">
                          {questions.coding.map((question, index) => 
                            renderQuestionCard(question, index, 'coding'))}
                        </div>
                      </div>
                    )}

                    {/* Interview Tips */}
                    {questions.tips && questions.tips.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-yellow-500 mr-2">💡</span>
                          Interview Tips
                        </h3>
                        <div className="space-y-3">
                          {questions.tips.map((tip, index) => 
                            renderQuestionCard(tip, index, 'tips'))}
                        </div>
                      </div>
                    )}

                    {/* Red Flags */}
                    {questions.redFlags && questions.redFlags.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-red-500 mr-2">⚠️</span>
                          Red Flags to Watch For
                        </h3>
                        <div className="space-y-3">
                          {questions.redFlags.map((flag, index) => 
                            renderQuestionCard(flag, index, 'redFlags'))}
                        </div>
                      </div>
                    )}

                    {/* Preparation Guide */}
                    {questions.preparation && questions.preparation.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-teal-500 mr-2">📚</span>
                          Preparation Guide
                        </h3>
                        <div className="space-y-3">
                          {questions.preparation.map((prep, index) => 
                            renderQuestionCard(prep, index, 'preparation'))}
                        </div>
                      </div>
                    )}

                    {/* Fallback: If no structured questions found, show raw response */}
                    {!questions.technical && !questions.behavioral && !questions.projectBased && !questions.systemDesign && !questions.coding && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <span className="text-gray-500 mr-2">📄</span>
                          Generated Questions
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-3">
                            Questions generated successfully! Here's the response:
                          </p>
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded border">
                            {JSON.stringify(questions, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">❓</div>
                    <p className="text-gray-500">
                      Enter your resume content or upload a PDF and select a job title to generate personalized interview questions.
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

export default InterviewQuestions; 