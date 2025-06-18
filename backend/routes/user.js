const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// All routes are protected
router.use(protect);

// Placeholder for user profile image upload
// This would typically integrate with Cloudinary or similar service
router.post('/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Here you would typically:
    // 1. Upload to Cloudinary or similar service
    // 2. Get the URL
    // 3. Update user profile with new image URL
    
    // For now, return a mock response
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: 'https://via.placeholder.com/150',
        filename: req.file.originalname
      }
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

// Get user statistics
router.get('/stats', (req, res) => {
  try {
    // Mock user statistics
    const stats = {
      totalLogins: req.user.loginCount,
      lastLogin: req.user.lastLogin,
      memberSince: req.user.createdAt,
      toolsUsed: Math.floor(Math.random() * 20) + 1, // Mock data
      profileCompletion: calculateProfileCompletion(req.user)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  let completed = 0;
  let total = 8; // Total number of profile fields

  if (user.name) completed++;
  if (user.email) completed++;
  if (user.profilePicture) completed++;
  if (user.bio) completed++;
  if (user.university) completed++;
  if (user.graduationYear) completed++;
  if (user.skills && user.skills.length > 0) completed++;
  if (user.github || user.linkedin || user.website) completed++;

  return Math.round((completed / total) * 100);
};

module.exports = router; 