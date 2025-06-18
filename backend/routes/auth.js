const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const profileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('university')
    .optional()
    .isLength({ max: 100 })
    .withMessage('University name cannot exceed 100 characters'),
  body('graduationYear')
    .optional()
    .isInt({ min: 2000, max: 2030 })
    .withMessage('Graduation year must be between 2000 and 2030'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('github')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  body('linkedin')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL')
];

const passwordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, profileValidation, updateProfile);
router.put('/change-password', protect, passwordValidation, changePassword);
router.post('/logout', protect, logout);

module.exports = router; 