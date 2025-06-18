import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { aiToolsAPI } from '../utils/api.jsx';
import { toast } from 'react-toastify';

const CodeGenerator = () => {
  const [formData, setFormData] = useState({
    problemStatement: '',
    language: 'javascript'
  });
  const [generatedCode, setGeneratedCode] = useState('');
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

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = 'Problem statement is required';
    } else if (formData.problemStatement.trim().length < 10) {
      newErrors.problemStatement = 'Problem statement must be at least 10 characters';
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
    setGeneratedCode('');

    try {
      console.log('Submitting code generation request:', formData);
      const response = await aiToolsAPI.generateCode(formData);
      console.log('Code generation response:', response);
      
      // Extract only the code from the response
      let code = response.data.code || response.data;
      
      // Clean the code for display
      code = cleanCodeForDisplay(code);
      
      setGeneratedCode(code);
      toast.success('Code generated successfully!');
    } catch (error) {
      console.error('Code generation error:', error);
      const message = error.message || 'Failed to generate code';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy code');
    }
  };

  const clearForm = () => {
    setFormData({
      problemStatement: '',
      language: 'javascript'
    });
    setGeneratedCode('');
    setErrors({});
  };

  // Function to clean and format code for display
  const cleanCodeForDisplay = (code) => {
    if (!code || typeof code !== 'string') {
      return '';
    }
    
    let cleanCode = code;
    
    // Remove markdown code blocks
    cleanCode = cleanCode.replace(/```[\s\S]*?\n/g, '');
    cleanCode = cleanCode.replace(/```[\s\S]*$/g, '');
    
    // Remove language identifiers
    cleanCode = cleanCode.replace(/^(javascript|js|python|py|java|cpp|csharp|php|ruby|go|rust|swift)\s*\n?/i, '');
    
    // Remove JSDoc comments (/** ... */)
    cleanCode = cleanCode.replace(/\/\*\*[\s\S]*?\*\//g, '');
    
    // Remove multi-line comments (/* ... */)
    cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove single-line comments (// ...)
    cleanCode = cleanCode.replace(/\/\/.*$/gm, '');
    
    // Remove example usage sections
    cleanCode = cleanCode.replace(/\n\s*\/\*\s*Example Usage:?\s*\*\/[\s\S]*$/i, '');
    cleanCode = cleanCode.replace(/\n\s*\/\/\s*Example Usage:?[\s\S]*$/i, '');
    
    // Remove lines that are just comments or documentation
    const lines = cleanCode.split('\n');
    const codeLines = [];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (trimmedLine === '') continue;
      
      // Skip comment-only lines
      if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) continue;
      
      // Skip lines that are clearly explanatory text
      if (trimmedLine.toLowerCase().includes('here is the code')) continue;
      if (trimmedLine.toLowerCase().includes('generated code')) continue;
      if (trimmedLine.toLowerCase().includes('example with')) continue;
      if (trimmedLine.toLowerCase().includes('example usage')) continue;
      
      // Skip lines that are just example code (commented out)
      if (trimmedLine.startsWith('// const') || trimmedLine.startsWith('// console.log')) continue;
      if (trimmedLine.startsWith('// if (') || trimmedLine.startsWith('// }')) continue;
      
      codeLines.push(line);
    }
    
    cleanCode = codeLines.join('\n').trim();
    
    // Remove any remaining empty lines at the beginning or end
    cleanCode = cleanCode.replace(/^\n+/, '').replace(/\n+$/, '');
    
    return cleanCode;
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
            <div className="text-3xl">💻</div>
            <h1 className="text-3xl font-bold text-gray-900">Code Generator</h1>
          </div>
          <p className="text-gray-600">
            Describe your problem and get clean, efficient code in your preferred programming language.
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
                <h2 className="text-xl font-semibold text-gray-900">Generate Code</h2>
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
                    <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 mb-2">
                      Problem Statement
                    </label>
                    <textarea
                      id="problemStatement"
                      name="problemStatement"
                      rows="8"
                      value={formData.problemStatement}
                      onChange={handleChange}
                      className={`textarea ${errors.problemStatement ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : ''}`}
                      placeholder="Describe the problem you want to solve. Be as detailed as possible for better results..."
                    />
                    {errors.problemStatement && (
                      <p className="mt-1 text-sm text-error-600">
                        {errors.problemStatement}
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
                          Generating Code...
                        </div>
                      ) : (
                        'Generate Code'
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

          {/* Generated Code */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Generated Code</h2>
                  {generatedCode && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className="btn-secondary text-sm"
                    >
                      📋 Copy
                    </motion.button>
                  )}
                </div>
              </div>
              <div className="card-body">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="spinner mx-auto mb-4"></div>
                      <p className="text-gray-600">Generating your code...</p>
                    </div>
                  </div>
                ) : generatedCode ? (
                  <div className="relative">
                    <SyntaxHighlighter
                      language={formData.language}
                      style={tomorrow}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.5rem',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}
                      showLineNumbers={true}
                    >
                      {cleanCodeForDisplay(generatedCode)}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">💻</div>
                    <p className="text-gray-500">
                      Your generated code will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">💡 Tips for Better Results</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Be Specific</h4>
                  <p className="text-sm text-gray-600">
                    Include details about input/output, constraints, and edge cases.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Mention Requirements</h4>
                  <p className="text-sm text-gray-600">
                    Specify if you need error handling, specific algorithms, or performance requirements.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Include Examples</h4>
                  <p className="text-sm text-gray-600">
                    Provide sample inputs and expected outputs for better understanding.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Choose Language</h4>
                  <p className="text-sm text-gray-600">
                    Select the programming language that best fits your project needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CodeGenerator; 