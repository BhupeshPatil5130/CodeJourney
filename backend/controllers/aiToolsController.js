const {
  generateCode,
  analyzeResume,
  generateInterviewQuestions,
  reviewCode,
  explainAlgorithm,
  generateRoadmap,
  generateATSResume,
  analyzeTimeComplexity
} = require('../utils/geminiAI');
const pdf = require('pdf-parse');

// @desc    Generate code based on problem statement
// @route   POST /api/ai-tools/generate-code
// @access  Private
const generateCodeHandler = async (req, res) => {
  try {
    const { problemStatement, language = 'javascript' } = req.body;

    if (!problemStatement) {
      return res.status(400).json({
        success: false,
        message: 'Problem statement is required'
      });
    }

    const code = await generateCode(problemStatement, language);
      console.log(code);
    res.json({
      success: true,
      message: 'Code generated successfully',
      data: {
        code,
        language,
        problemStatement
      }
    });
  } catch (error) {
    console.error('Code generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate code. Please try again.'
    });
  }
};

const analyzeResumeHandler = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      });
    }

    const analysis = await analyzeResume(resumeText);

    res.json({
      success: true,
      message: 'Resume analyzed successfully',
      data: analysis
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume. Please try again.'
    });
  }
};

const analyzeResumePDFHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed'
      });
    }

    let pdfText;
    try {
      const pdfData = await pdf(req.file.buffer);
      pdfText = pdfData.text;
      
      if (!pdfText || pdfText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Could not extract text from PDF. Please ensure the PDF contains readable text.'
        });
      }
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return res.status(400).json({
        success: false,
        message: 'Failed to parse PDF. Please ensure the file is a valid PDF with readable text.'
      });
    }

    // Analyze the extracted text
    const analysis = await analyzeResume(pdfText);

    res.json({
      success: true,
      message: 'PDF resume analyzed successfully',
      data: {
        ...analysis,
        extractedText: pdfText.substring(0, 500) + (pdfText.length > 500 ? '...' : '') // Show first 500 chars
      }
    });
  } catch (error) {
    console.error('PDF resume analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze PDF resume. Please try again.'
    });
  }
};

// @desc    Generate interview questions based on resume
// @route   POST /api/ai-tools/generate-questions
// @access  Private
const generateQuestionsHandler = async (req, res) => {
  try {
    const { resumeText, jobTitle = 'Software Engineer' } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      });
    }

    const questions = await generateInterviewQuestions(resumeText, jobTitle);

    res.json({
      success: true,
      message: 'Interview questions generated successfully',
      data: questions
    });
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate interview questions. Please try again.'
    });
  }
};

// @desc    Generate interview questions based on PDF resume
// @route   POST /api/ai-tools/generate-questions-pdf
// @access  Private
const generateQuestionsPDFHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    // Check if file is PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed'
      });
    }

    const { jobTitle = 'Software Engineer' } = req.body;

    // Parse PDF content
    let pdfText;
    try {
      const pdfData = await pdf(req.file.buffer);
      pdfText = pdfData.text;
      
      if (!pdfText || pdfText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Could not extract text from PDF. Please ensure the PDF contains readable text.'
        });
      }
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return res.status(400).json({
        success: false,
        message: 'Failed to parse PDF. Please ensure the file is a valid PDF with readable text.'
      });
    }

    // Generate questions based on the extracted text
    const questions = await generateInterviewQuestions(pdfText, jobTitle);

    res.json({
      success: true,
      message: 'Interview questions generated successfully from PDF',
      data: {
        ...questions,
        extractedText: pdfText.substring(0, 500) + (pdfText.length > 500 ? '...' : '') // Show first 500 chars
      }
    });
  } catch (error) {
    console.error('PDF interview questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate interview questions from PDF. Please try again.'
    });
  }
};

// @desc    Review code for improvements
// @route   POST /api/ai-tools/review-code
// @access  Private
const reviewCodeHandler = async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code is required'
      });
    }

    const review = await reviewCode(code, language);

    res.json({
      success: true,
      message: 'Code reviewed successfully',
      data: review
    });
  } catch (error) {
    console.error('Code review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review code. Please try again.'
    });
  }
};

// @desc    Explain algorithm in detail
// @route   POST /api/ai-tools/explain-algorithm
// @access  Private
const explainAlgorithmHandler = async (req, res) => {
  try {
    const { algorithmName, complexity = 'detailed' } = req.body;

    if (!algorithmName) {
      return res.status(400).json({
        success: false,
        message: 'Algorithm name is required'
      });
    }

    const explanation = await explainAlgorithm(algorithmName, complexity);

    res.json({
      success: true,
      message: 'Algorithm explained successfully',
      data: explanation
    });
  } catch (error) {
    console.error('Algorithm explanation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to explain algorithm. Please try again.'
    });
  }
};

// @desc    Generate learning roadmap
// @route   POST /api/ai-tools/generate-roadmap
// @access  Private
const generateRoadmapHandler = async (req, res) => {
  try {
    const { domain, experienceLevel = 'beginner', focusAreas = [] } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: 'Domain is required'
      });
    }

    const roadmap = await generateRoadmap(domain, experienceLevel, focusAreas);

    res.json({
      success: true,
      message: 'Learning roadmap generated successfully',
      data: roadmap
    });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate roadmap. Please try again.'
    });
  }
};

// @desc    Generate ATS-optimized resume
// @route   POST /api/ai-tools/generate-ats-resume
// @access  Private
const generateATSResumeHandler = async (req, res) => {
  try {
    const { originalResume, analysis, targetJobTitle = 'Software Engineer' } = req.body;

    if (!originalResume) {
      return res.status(400).json({
        success: false,
        message: 'Original resume content is required'
      });
    }

    if (!analysis) {
      return res.status(400).json({
        success: false,
        message: 'Resume analysis is required'
      });
    }

    const optimizedResume = await generateATSResume(originalResume, analysis, targetJobTitle);

    res.json({
      success: true,
      message: 'ATS-optimized resume generated successfully',
      data: optimizedResume
    });
  } catch (error) {
    console.error('ATS resume generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ATS-optimized resume. Please try again.'
    });
  }
};

// @desc    Generate ATS-optimized resume from PDF
// @route   POST /api/ai-tools/generate-ats-resume-pdf
// @access  Private
const generateATSResumePDFHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required'
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed'
      });
    }

    const { targetJobTitle = 'Software Engineer' } = req.body;

    // Parse PDF content
    let pdfText;
    try {
      const pdfData = await pdf(req.file.buffer);
      pdfText = pdfData.text;
      
      if (!pdfText || pdfText.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Could not extract text from PDF. Please ensure the PDF contains readable text.'
        });
      }
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return res.status(400).json({
        success: false,
        message: 'Failed to parse PDF. Please ensure the file is a valid PDF with readable text.'
      });
    }

    // First analyze the resume
    const analysis = await analyzeResume(pdfText);

    // Then generate the optimized resume
    const optimizedResume = await generateATSResume(pdfText, analysis, targetJobTitle);

    res.json({
      success: true,
      message: 'ATS-optimized resume generated successfully from PDF',
      data: {
        ...optimizedResume,
        originalText: pdfText.substring(0, 500) + (pdfText.length > 500 ? '...' : '')
      }
    });
  } catch (error) {
    console.error('PDF ATS resume generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate ATS-optimized resume from PDF. Please try again.'
    });
  }
};

// @desc    Analyze time and space complexity of code
// @route   POST /api/ai-tools/analyze-complexity
// @access  Private
const analyzeComplexityHandler = async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Code is required'
      });
    }

    const analysis = await analyzeTimeComplexity(code, language);

    // Check if this is a fallback analysis
    const isFallback = analysis.overview && analysis.overview.includes('appears to be');
    
    res.json({
      success: true,
      message: isFallback 
        ? 'Time complexity analysis completed using fallback analysis (AI service temporarily unavailable)'
        : 'Time complexity analysis completed successfully',
      data: analysis,
      isFallback: isFallback
    });
  } catch (error) {
    console.error('Time complexity analysis error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to analyze time complexity. Please try again.';
    
    if (error.message && error.message.includes('503')) {
      errorMessage = 'AI service is temporarily unavailable. Please try again in a few minutes.';
    } else if (error.message && error.message.includes('429')) {
      errorMessage = 'Too many requests. Please wait a moment before trying again.';
    } else if (error.message && error.message.includes('UNAVAILABLE')) {
      errorMessage = 'AI service is currently unavailable. Please try again later.';
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// @desc    Get available AI tools
// @route   GET /api/ai-tools
// @access  Private
const getAvailableTools = async (req, res) => {
  try {
    const tools = [
      {
        id: 'code-generator',
        name: 'Code Generator',
        description: 'Generate clean, efficient code based on problem statements',
        icon: '💻',
        category: 'Development',
        features: ['Multiple languages', 'Error handling', 'Best practices']
      },
      {
        id: 'resume-analyzer',
        name: 'Resume Analyzer & Optimizer',
        description: 'Analyze resumes for ATS optimization and generate improved versions',
        icon: '📄',
        category: 'Career',
        features: ['ATS scoring', 'Keyword analysis', 'Optimized resume generation', 'Download functionality']
      },
      {
        id: 'interview-questions',
        name: 'Interview Questions',
        description: 'Generate tailored interview questions based on your resume',
        icon: '❓',
        category: 'Career',
        features: ['Technical questions', 'Behavioral questions', 'Project-based questions']
      },
      {
        id: 'code-reviewer',
        name: 'Code Reviewer',
        description: 'Get detailed feedback and improvements for your code',
        icon: '🔍',
        category: 'Development',
        features: ['Security analysis', 'Performance tips', 'Best practices']
      },
      {
        id: 'complexity-analyzer',
        name: 'Time Complexity Analyzer',
        description: 'Analyze and explain the time and space complexity of a given code',
        icon: '⏱️',
        category: 'Development',
        features: ['Time complexity analysis', 'Space complexity analysis', 'Optimization suggestions', 'Performance insights']
      },
      {
        id: 'algorithm-explainer',
        name: 'Algorithm Explainer',
        description: 'Get detailed explanations of algorithms and data structures',
        icon: '🧮',
        category: 'Education',
        features: ['Step-by-step explanation', 'Complexity analysis', 'Use cases']
      },
      {
        id: 'roadmap-generator',
        name: 'Roadmap Generator',
        description: 'Generate personalized learning roadmaps for tech domains',
        icon: '🗺️',
        category: 'Education',
        features: ['Structured learning paths', 'Project-based learning', 'Career guidance']
      }
    ];

    res.json({
      success: true,
      data: tools
    });
  } catch (error) {
    console.error('Get tools error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available tools'
    });
  }
};

// @desc    Get random AI tool highlight for dashboard
// @route   GET /api/ai-tools/highlight
// @access  Private
const getRandomHighlight = async (req, res) => {
  try {
    const highlights = [
      {
        tool: 'code-generator',
        title: 'Generate Code Instantly',
        description: 'Describe your problem and get production-ready code in multiple languages',
        icon: '💻',
        color: 'blue'
      },
      {
        tool: 'resume-analyzer',
        title: 'Optimize Your Resume',
        description: 'Get ATS-friendly resume analysis and generate an optimized version that passes screening',
        icon: '📄',
        color: 'green'
      },
      {
        tool: 'interview-questions',
        title: 'Prepare for Interviews',
        description: 'Get personalized interview questions based on your experience',
        icon: '❓',
        color: 'purple'
      },
      {
        tool: 'code-reviewer',
        title: 'Review Your Code',
        description: 'Get expert feedback on your code with security and performance tips',
        icon: '🔍',
        color: 'orange'
      },
      {
        tool: 'complexity-analyzer',
        title: 'Analyze Code Complexity',
        description: 'Understand the time and space complexity of your algorithms with detailed analysis',
        icon: '⏱️',
        color: 'red'
      },
      {
        tool: 'algorithm-explainer',
        title: 'Learn Algorithms',
        description: 'Understand complex algorithms with step-by-step explanations',
        icon: '🧮',
        color: 'indigo'
      },
      {
        tool: 'roadmap-generator',
        title: 'Plan Your Learning',
        description: 'Generate personalized learning roadmaps for any tech domain',
        icon: '🗺️',
        color: 'yellow'
      }
    ];

    const randomHighlight = highlights[Math.floor(Math.random() * highlights.length)];

    res.json({
      success: true,
      data: randomHighlight
    });
  } catch (error) {
    console.error('Get highlight error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tool highlight'
    });
  }
};

module.exports = {
  generateCodeHandler,
  analyzeResumeHandler,
  analyzeResumePDFHandler,
  generateQuestionsHandler,
  generateQuestionsPDFHandler,
  reviewCodeHandler,
  explainAlgorithmHandler,
  generateRoadmapHandler,
  generateATSResumeHandler,
  generateATSResumePDFHandler,
  analyzeComplexityHandler,
  getAvailableTools,
  getRandomHighlight
}; 