import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { aiToolsAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';
import { downloadResumePDF, generatePDFFromElement, downloadEnhancedResumePDF } from '../utils/pdfGenerator';

const ResumeAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [optimizedResume, setOptimizedResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [errors, setErrors] = useState({});
  const [inputMode, setInputMode] = useState('text'); // 'text' or 'pdf'
  const [targetJobTitle, setTargetJobTitle] = useState('Software Engineer');
  const [viewMode, setViewMode] = useState('improved'); // 'improved', 'comparison', 'changes'

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
    'System Administrator',
    'Machine Learning Engineer',
    'Cloud Engineer',
    'Mobile Developer',
    'Cybersecurity Analyst',
    'Database Administrator'
  ];

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeText.trim()) {
      setErrors({ resumeText: 'Resume text is required' });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await aiToolsAPI.analyzeResume({
        resumeText: resumeText.trim()
      });
      setAnalysis(response.data);
      toast.success('Resume analyzed successfully!');
    } catch (error) {
      console.error('Resume analysis error:', error);
      const message = error.message || 'Failed to analyze resume';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePDFSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setErrors({ pdfFile: 'Please select a PDF file' });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await aiToolsAPI.analyzeResumePDF(selectedFile);
      setAnalysis(response.data);
      toast.success('PDF resume analyzed successfully!');
    } catch (error) {
      console.error('PDF resume analysis error:', error);
      const message = error.message || 'Failed to analyze PDF resume';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
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

  const handleGenerateATSResume = async () => {
    if (!analysis) {
      toast.error('Please analyze your resume first');
      return;
    }

    setIsGeneratingResume(true);
    setOptimizedResume(null);

    try {
      const response = await aiToolsAPI.generateATSResume({
        originalResume: resumeText || (selectedFile ? 'PDF Resume' : ''),
        analysis: analysis,
        targetJobTitle: targetJobTitle
      });
      setOptimizedResume(response.data);
      toast.success('ATS-optimized resume generated successfully!');
    } catch (error) {
      console.error('ATS resume generation error:', error);
      const message = error.message || 'Failed to generate ATS resume';
      toast.error(message);
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const handleGenerateATSResumePDF = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file first');
      return;
    }

    setIsGeneratingResume(true);
    setOptimizedResume(null);

    try {
      const response = await aiToolsAPI.generateATSResumePDF(selectedFile, targetJobTitle);
      setOptimizedResume(response.data);
      toast.success('ATS-optimized resume generated successfully from PDF!');
    } catch (error) {
      console.error('PDF ATS resume generation error:', error);
      const message = error.message || 'Failed to generate ATS resume from PDF';
      toast.error(message);
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const downloadResume = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const downloadResumeAsPDF = async (content, filename) => {
    setIsGeneratingPDF(true);
    try {
      await downloadEnhancedResumePDF(content, filename);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF download error:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const downloadResumeAsPDFFromElement = async (elementId, filename) => {
    setIsGeneratingPDF(true);
    try {
      await generatePDFFromElement(elementId, filename);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF download error:', error);
      toast.error('Failed to download PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const clearForm = () => {
    setResumeText('');
    setSelectedFile(null);
    setAnalysis(null);
    setOptimizedResume(null);
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
            <div className="text-3xl">📄</div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Analyzer & Optimizer</h1>
          </div>
          <p className="text-gray-600">
            Get ATS-friendly resume analysis and improve your existing resume while keeping your original format and template. Upload a PDF or paste your resume text.
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
                <h2 className="text-xl font-semibold text-gray-900">Analyze & Optimize Resume</h2>
              </div>
              <div className="card-body">
                {/* Job Title Selection */}
                <div className="mb-6">
                  <label htmlFor="targetJobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Job Title
                  </label>
                  <select
                    id="targetJobTitle"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    className="select"
                  >
                    {jobTitles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>

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
                      <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 mb-2">
                        Resume Content
                      </label>
                      <textarea
                        id="resumeText"
                        rows="12"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        className={`textarea ${errors.resumeText ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                        placeholder="Paste your resume content here..."
                      />
                      {errors.resumeText && (
                        <p className="mt-1 text-sm text-error-600">
                          {errors.resumeText}
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
                          Analyzing Resume...
                        </div>
                      ) : (
                        'Analyze Resume'
                      )}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handlePDFSubmit} className="space-y-6">
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

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || !selectedFile}
                      className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="spinner mr-2"></div>
                          Analyzing PDF...
                        </div>
                      ) : (
                        'Analyze PDF Resume'
                      )}
                    </motion.button>
                  </form>
                )}

                {/* Generate ATS Resume Button */}
                {analysis && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={inputMode === 'text' ? handleGenerateATSResume : handleGenerateATSResumePDF}
                    disabled={isGeneratingResume}
                    className="w-full btn-secondary py-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingResume ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner mr-2"></div>
                        Improving Resume...
                      </div>
                    ) : (
                      '🚀 Improve Resume (Keep Format)'
                    )}
                  </motion.button>
                )}

                {/* Clear Button */}
                {(resumeText || selectedFile || analysis || optimizedResume) && (
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
                <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="spinner mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        {inputMode === 'pdf' ? 'Analyzing your PDF resume...' : 'Analyzing your resume...'}
                      </p>
                    </div>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    {/* ATS Score */}
                    <div className="text-center p-4 bg-primary-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        ATS Score: {analysis.atsScore}
                      </div>
                      <p className="text-sm text-gray-600">Overall compatibility with ATS systems</p>
                    </div>

                    {/* Extracted Text Preview (for PDF) */}
                    {analysis.extractedText && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">📄 Extracted Text Preview</h3>
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 max-h-32 overflow-y-auto">
                          {analysis.extractedText}
                        </div>
                      </div>
                    )}

                    {/* Strengths */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">✅ Strengths</h3>
                      <ul className="space-y-2">
                        {analysis.strengths?.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-700 bg-success-50 p-2 rounded">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Weaknesses */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">⚠️ Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {analysis.weaknesses?.map((weakness, index) => (
                          <li key={index} className="text-sm text-gray-700 bg-warning-50 p-2 rounded">
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">💡 Suggestions</h3>
                      <ul className="space-y-2">
                        {analysis.suggestions?.map((suggestion, index) => (
                          <li key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Keywords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">🔍 Keywords Found</h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.keywords?.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-success-100 text-success-800 text-xs rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">❌ Missing Keywords</h3>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingKeywords?.map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-error-100 text-error-800 text-xs rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Overall Assessment */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">📋 Overall Assessment</h3>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {analysis.overallAssessment}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📄</div>
                    <p className="text-gray-500">
                      Your resume analysis will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Optimized Resume Section */}
        {optimizedResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">🚀 Improved Resume</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadResume(optimizedResume.improvedResume, 'improved-resume.txt')}
                      className="btn-secondary py-2 px-4 text-sm"
                    >
                      📄 Download Text
                    </button>
                    <button
                      onClick={() => downloadResumeAsPDF(optimizedResume.improvedResume, 'improved-resume.pdf')}
                      disabled={isGeneratingPDF}
                      className="btn-primary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingPDF ? (
                        <div className="flex items-center">
                          <div className="spinner mr-2"></div>
                          Generating PDF...
                        </div>
                      ) : (
                        '📥 Download PDF'
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                {/* Optimization Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-success-50 rounded-lg">
                    <div className="text-2xl font-bold text-success-600 mb-2">
                      {optimizedResume.atsOptimization.estimatedATSScore}
                    </div>
                    <p className="text-sm text-gray-600">Estimated ATS Score</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {optimizedResume.atsOptimization.formattingScore}
                    </div>
                    <p className="text-sm text-gray-600">Formatting Score</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {optimizedResume.atsOptimization.readabilityScore}
                    </div>
                    <p className="text-sm text-gray-600">Readability Score</p>
                  </div>
                </div>

                {/* Summary */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">📋 Optimization Summary</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {optimizedResume.summary}
                  </p>
                </div>

                {/* Improvements Made */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">✨ Improvements Made</h3>
                  <ul className="space-y-2">
                    {optimizedResume.atsOptimization.improvements?.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specific Changes Made */}
                {optimizedResume.changesMade && optimizedResume.changesMade.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">🔍 Specific Changes Made</h3>
                    <div className="space-y-4">
                      {optimizedResume.changesMade.map((change, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded">
                          <h4 className="font-medium text-gray-900 mb-2">{change.section}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-sm font-medium text-red-600 mb-1">Original:</h5>
                              <p className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                                {change.originalText}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-green-600 mb-1">Improved:</h5>
                              <p className="text-sm text-gray-700 bg-green-50 p-2 rounded">
                                {change.improvedText}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong>Reason:</strong> {change.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keyword Density Analysis */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">🔍 Keyword Optimization</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {optimizedResume.atsOptimization.keywordDensity}
                  </p>
                </div>

                {/* Improved Resume Content */}
                <div className="space-y-6">
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                    <button
                      type="button"
                      onClick={() => setViewMode('improved')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'improved'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      📄 Improved Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('comparison')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'comparison'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      ⚖️ Side-by-Side
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('changes')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'changes'
                          ? 'bg-white text-primary-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      🔍 Changes Only
                    </button>
                  </div>

                  {viewMode === 'improved' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">📄 Improved Resume (Same Format)</h3>
                        <button
                          onClick={() => downloadResumeAsPDFFromElement('resume-display', 'improved-resume-formatted.pdf')}
                          disabled={isGeneratingPDF}
                          className="btn-secondary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isGeneratingPDF ? (
                            <div className="flex items-center">
                              <div className="spinner mr-2"></div>
                              Generating PDF...
                            </div>
                          ) : (
                            '📥 Download Formatted PDF'
                          )}
                        </button>
                      </div>
                      <div 
                        id="resume-display"
                        className="bg-white border border-gray-200 rounded-lg p-6"
                      >
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                          {optimizedResume.improvedResume}
                        </pre>
                      </div>
                    </div>
                  )}

                  {viewMode === 'comparison' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">⚖️ Original vs Improved Comparison</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadResumeAsPDF(resumeText || 'PDF Resume Content', 'original-resume.pdf')}
                            disabled={isGeneratingPDF}
                            className="btn-secondary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGeneratingPDF ? (
                              <div className="flex items-center">
                                <div className="spinner mr-2"></div>
                                Generating PDF...
                              </div>
                            ) : (
                              '📥 Original PDF'
                            )}
                          </button>
                          <button
                            onClick={() => downloadResumeAsPDF(optimizedResume.improvedResume, 'improved-resume.pdf')}
                            disabled={isGeneratingPDF}
                            className="btn-primary py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGeneratingPDF ? (
                              <div className="flex items-center">
                                <div className="spinner mr-2"></div>
                                Generating PDF...
                              </div>
                            ) : (
                              '📥 Improved PDF'
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-red-600">Original Resume</h4>
                          <div 
                            id="original-resume-display"
                            className="bg-red-50 border border-red-200 rounded-lg p-4 h-96 overflow-y-auto"
                          >
                            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                              {resumeText || (selectedFile ? 'PDF Resume Content' : 'No content available')}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-green-600">Improved Resume</h4>
                          <div 
                            id="improved-resume-display"
                            className="bg-green-50 border border-green-200 rounded-lg p-4 h-96 overflow-y-auto"
                          >
                            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                              {optimizedResume.improvedResume}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {viewMode === 'changes' && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">🔍 Detailed Changes Analysis</h3>
                      <div className="space-y-4">
                        {optimizedResume.changesMade?.map((change, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{change.section}</h4>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Change #{index + 1}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div>
                                <h5 className="text-sm font-medium text-red-600 mb-1">❌ Original Text:</h5>
                                <div className="bg-red-50 border border-red-200 rounded p-3">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {change.originalText}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-green-600 mb-1">✅ Improved Text:</h5>
                                <div className="bg-green-50 border border-green-200 rounded p-3">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {change.improvedText}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-xs text-gray-700">
                                <strong>💡 Reason for Change:</strong> {change.reason}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer; 