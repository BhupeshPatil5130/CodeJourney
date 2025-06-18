const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  university: {
    type: String,
    maxlength: [100, 'University name cannot exceed 100 characters'],
    default: ''
  },
  graduationYear: {
    type: Number,
    min: [2000, 'Graduation year must be after 2000'],
    max: [2030, 'Graduation year must be before 2030'],
    default: null
  },
  skills: [{
    type: String,
    trim: true
  }],
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user profile (without sensitive data)
userSchema.methods.getProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    profilePicture: this.profilePicture,
    bio: this.bio,
    university: this.university,
    graduationYear: this.graduationYear,
    skills: this.skills,
    github: this.github,
    linkedin: this.linkedin,
    website: this.website,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
    preferences: this.preferences,
    createdAt: this.createdAt
  };
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema); 