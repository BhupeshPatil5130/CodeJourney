const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const {
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
} = require('../controllers/aiToolsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Validation middleware
const codeGenerationValidation = [
  body('problemStatement')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Problem statement must be between 10 and 2000 characters'),
  body('language')
    .optional()
    .isIn(['javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift'])
    .withMessage('Please select a valid programming language')
];

const resumeAnalysisValidation = [
  body('resumeText')
    .trim()
    .isLength({ min: 50, max: 10000 })
    .withMessage('Resume text must be between 50 and 10000 characters')
];

const questionGenerationValidation = [
  body('resumeText')
    .trim()
    .isLength({ min: 50, max: 10000 })
    .withMessage('Resume text must be between 50 and 10000 characters'),
  body('jobTitle')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Job title must be between 2 and 100 characters')
];

const codeReviewValidation = [
  body('code')
    .trim()
    .isLength({ min: 10, max: 50000 })
    .withMessage('Code must be between 10 and 50000 characters'),
  body('language')
    .optional()
    .isIn(['javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift'])
    .withMessage('Please select a valid programming language')
];

const algorithmValidation = [
  body('algorithmName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Algorithm name must be between 2 and 100 characters'),
  body('complexity')
    .optional()
    .isIn(['simple', 'detailed', 'advanced'])
    .withMessage('Complexity level must be simple, detailed, or advanced')
];

const roadmapValidation = [
  body('domain')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Domain must be between 2 and 100 characters'),
  body('experienceLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Experience level must be beginner, intermediate, or advanced'),
  body('focusAreas')
    .optional()
    .isArray()
    .withMessage('Focus areas must be an array')
];

const atsResumeValidation = [
  body('originalResume')
    .trim()
    .isLength({ min: 50, max: 10000 })
    .withMessage('Original resume must be between 50 and 10000 characters'),
  body('analysis')
    .isObject()
    .withMessage('Analysis object is required'),
  body('targetJobTitle')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Target job title must be between 2 and 100 characters')
];

const complexityAnalysisValidation = [
  body('code')
    .trim()
    .isLength({ min: 10, max: 50000 })
    .withMessage('Code must be between 10 and 50000 characters'),
  body('language')
    .optional()
    .isIn(['javascript', 'python', 'java', 'cpp', 'csharp', 'php', 'ruby', 'go', 'rust', 'swift'])
    .withMessage('Please select a valid programming language')
];

// All routes are protected
router.use(protect);

// AI Tools routes
router.get('/', getAvailableTools);
router.get('/highlight', getRandomHighlight);

router.post('/generate-code', codeGenerationValidation, generateCodeHandler);
router.post('/analyze-resume', resumeAnalysisValidation, analyzeResumeHandler);
router.post('/analyze-resume-pdf', upload.single('pdfFile'), analyzeResumePDFHandler);
router.post('/generate-questions', questionGenerationValidation, generateQuestionsHandler);
router.post('/generate-questions-pdf', upload.single('pdfFile'), generateQuestionsPDFHandler);
router.post('/review-code', codeReviewValidation, reviewCodeHandler);
router.post('/explain-algorithm', algorithmValidation, explainAlgorithmHandler);
router.post('/generate-roadmap', roadmapValidation, generateRoadmapHandler);
router.post('/generate-ats-resume', atsResumeValidation, generateATSResumeHandler);
router.post('/generate-ats-resume-pdf', upload.single('pdfFile'), generateATSResumePDFHandler);
router.post('/analyze-complexity', complexityAnalysisValidation, analyzeComplexityHandler);

module.exports = router; 