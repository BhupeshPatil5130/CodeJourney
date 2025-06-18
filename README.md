# 🤖 AI CS Portal

<div align="center">

![AI CS Portal](https://img.shields.io/badge/AI-Powered%20CS%20Portal-blue?style=for-the-badge&logo=robot)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js)
![Gemini AI](https://img.shields.io/badge/AI-Gemini%20API-orange?style=for-the-badge&logo=google)

**An intelligent platform designed to accelerate computer science learning and career development through AI-powered tools.**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

---

## ✨ Features

### 🛠️ AI-Powered Tools

| Tool | Description | Icon |
|------|-------------|------|
| **💻 Code Generator** | Generate production-ready code from natural language descriptions in multiple programming languages | `💻` |
| **📄 Resume Analyzer** | ATS-optimized resume analysis with keyword extraction and improvement suggestions | `📄` |
| **❓ Interview Questions** | Personalized technical and behavioral interview questions based on resume content | `❓` |
| **🔍 Code Reviewer** | Intelligent code review with optimization suggestions and best practices | `🔍` |
| **⏱️ Time Complexity Analyzer** | Advanced algorithm analysis for time/space complexity with optimization tips | `⏱️` |
| **🧮 Algorithm Explainer** | Step-by-step algorithm explanations with visual breakdowns | `🧮` |
| **🗺️ Roadmap Generator** | Personalized learning roadmaps based on experience level and career goals | `🗺️` |

### 🎯 Key Features

- 🔐 **Secure Authentication** - JWT-based user authentication and authorization
- 📱 **Responsive Design** - Modern UI that works seamlessly across all devices
- ⚡ **Real-time Processing** - Instant AI-powered responses and analysis
- 📊 **User Dashboard** - Personalized statistics and usage tracking
- 🔒 **Protected Routes** - Role-based access control for all tools
- 📁 **File Upload** - PDF resume processing and analysis
- 🎨 **Modern UI/UX** - Beautiful animations and intuitive user interface

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-cs-portal.git
   cd ai-cs-portal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Configure your environment variables in .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d

# Google Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### API Keys Setup

1. **Google Gemini AI**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

2. **MongoDB**
   - Create a MongoDB Atlas account or use local MongoDB
   - Get your connection string
   - Add it to your `.env` file

---

## 🏗️ Architecture

### Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React.js, Tailwind CSS, Framer Motion | Modern, responsive UI |
| **Backend** | Node.js, Express.js | RESTful API server |
| **Database** | MongoDB, Mongoose | Data persistence |
| **AI/ML** | Google Gemini API | Intelligent responses |
| **Authentication** | JWT, bcryptjs | Secure user management |
| **File Processing** | pdf-parse, multer | Document handling |

</div>

### Project Structure

```
ai-cs-portal/
├── 📁 backend/
│   ├── 📁 controllers/     # API route handlers
│   ├── 📁 middleware/      # Custom middleware
│   ├── 📁 models/         # MongoDB schemas
│   ├── 📁 routes/         # API routes
│   ├── 📁 utils/          # Utility functions
│   ├── 📄 server.js       # Express server
│   └── 📄 package.json    # Backend dependencies
├── 📁 frontend/
│   ├── 📁 public/         # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/ # Reusable components
│   │   ├── 📁 context/    # React context
│   │   ├── 📁 pages/      # Page components
│   │   ├── 📁 utils/      # Utility functions
│   │   └── 📄 App.jsx     # Main app component
│   └── 📄 package.json    # Frontend dependencies
└── 📄 README.md           # Project documentation
```

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### AI Tools
- `POST /api/ai-tools/generate-code` - Generate code from description
- `POST /api/ai-tools/analyze-resume` - Analyze resume text
- `POST /api/ai-tools/analyze-resume-pdf` - Analyze PDF resume
- `POST /api/ai-tools/generate-questions` - Generate interview questions
- `POST /api/ai-tools/review-code` - Review and analyze code
- `POST /api/ai-tools/explain-algorithm` - Explain algorithms
- `POST /api/ai-tools/generate-roadmap` - Generate learning roadmap
- `POST /api/ai-tools/analyze-complexity` - Analyze time complexity

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics

---

## 🎨 UI Components

### Design System

The application uses a custom design system built with Tailwind CSS:

- **Colors**: Primary blue, success green, warning orange, error red
- **Typography**: Inter font family for clean readability
- **Animations**: Framer Motion for smooth transitions
- **Components**: Modular, reusable components with consistent styling

### Key Components

- **Navbar**: Responsive navigation with user authentication
- **Dashboard**: User dashboard with tool cards and statistics
- **Tool Cards**: Interactive cards for each AI tool
- **Forms**: Styled forms with validation and error handling
- **Modals**: Overlay components for detailed interactions

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Express rate limiting to prevent abuse
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Express-validator for request validation
- **Helmet.js**: Security headers for protection
- **Environment Variables**: Secure configuration management

---

## 🚀 Deployment

### Backend Deployment

1. **Environment Setup**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   PORT=5001
   ```

2. **Database Setup**
   - Use MongoDB Atlas for production database
   - Configure connection string in environment variables

3. **Deploy to Platform**
   ```bash
   # Example for Heroku
   heroku create your-app-name
   git push heroku main
   ```

### Frontend Deployment

1. **Build Production**
   ```bash
   npm run build
   ```

2. **Deploy to Platform**
   ```bash
   # Example for Vercel
   vercel --prod
   ```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini AI** for providing the AI capabilities
- **React Team** for the amazing frontend framework
- **Node.js Community** for the robust backend runtime
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations

---

## 📞 Support

- **Email**: support@ai-cs-portal.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-cs-portal/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/ai-cs-portal/wiki)

---

<div align="center">

**Made with ❤️ by the AI CS Portal Team**

[⬆ Back to Top](#-ai-cs-portal)

</div> 
