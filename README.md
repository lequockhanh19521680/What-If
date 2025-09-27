# What If Studio

🚀 **Next-generation AI-powered creative scenario generator** that transforms your hypotheses into logical, scientifically-grounded scenarios with stunning multimedia content.

## ✨ New Features & Improvements

### 🎨 **Modern UI/UX Redesign**
- **Beautiful Interface**: Completely redesigned with modern gradients, animations, and micro-interactions
- **Enhanced Typography**: Inter font family for better readability and professional appearance
- **Responsive Design**: Optimized for all screen sizes with mobile-first approach
- **Accessibility**: Improved contrast, focus states, and reduced motion support

### 🔐 **Advanced Authentication System**
- **Dual Authentication**: Support for both AWS Cognito (Google/Facebook) and custom RDS-based auth
- **Enhanced Security**: JWT tokens with session management and secure password hashing
- **Password Recovery**: Complete forgot password flow with email verification
- **User Profiles**: Extended user management with preferences and social links

### 📊 **Project Management Dashboard**
- **Dedicated Projects Page**: Comprehensive project management interface
- **Advanced Filtering**: Search, filter by date, and view mode toggles
- **Bulk Operations**: Select and manage multiple projects simultaneously
- **Detailed Analytics**: View counts, share statistics, and project insights

### 🎯 **Enhanced Content Generation**
- **Real-time Progress**: Step-by-step generation process with detailed status updates
- **Auto Language Detection**: No need to specify language - system detects from prompt
- **Smart Media Generation**: Context-aware image styling and enhanced video production
- **Improved AI Prompts**: Better scientific analysis and visual content creation

### 🏗️ **Separate Page Architecture**
- **About Page**: Dedicated about page with team info, stats, and mission
- **Proper Routing**: React Router navigation instead of anchor-based scrolling
- **Modular Components**: Clean separation of concerns for better maintainability

## 🏗️ Architecture

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Tailwind CSS, React Router | Modern SPA with responsive design |
| **Backend** | AWS Lambda (Serverless Framework) | Scalable API endpoints |
| **AI Models** | AWS Bedrock (Claude 3, Stable Diffusion) | Content generation and analysis |
| **Database** | Amazon RDS (MySQL) + DynamoDB | User management + project storage |
| **Storage** | Amazon S3 | Media files and assets |
| **Authentication** | Custom JWT + AWS Cognito | Dual auth system |
| **Hosting** | CloudFront + S3 (Frontend), API Gateway (Backend) | Global CDN delivery |

### AWS Services Used

| Service | Purpose | Notes |
|---------|---------|-------|
| **AWS Bedrock** | AI model access (Claude 3, Stable Diffusion) | Scientific analysis + image generation |
| **Lambda** | Serverless compute for API functions | Auto-scaling, cost-effective |
| **RDS MySQL** | User management and authentication | Secure, ACID-compliant user data |
| **DynamoDB** | Project storage and metadata | Fast, scalable project data |
| **S3** | Media storage for images and videos | Optimized for multimedia content |
| **Cognito** | Social authentication (Google/Facebook) | OAuth integration |
| **API Gateway** | RESTful API endpoints | Request routing and throttling |
| **CloudFront** | CDN for global content delivery | Low-latency media serving |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS account with Bedrock access
- MySQL database (RDS or local)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd what-if-studio
   npm run install:all
   ```

2. **Set up database**
   ```bash
   # For RDS MySQL
   mysql -h your-rds-endpoint -u username -p
   CREATE DATABASE whatif_studio;
   ```

3. **Configure environment variables**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Update with your AWS credentials and RDS details
   
   # Frontend  
   cd ../frontend
   cp .env.example .env
   # Update with API endpoints
   ```

4. **Deploy backend infrastructure**
   ```bash
   cd backend
   npm run deploy
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

For detailed setup instructions, see [Local Development Guide](docs/LOCAL_DEVELOPMENT.md).

## 🎯 How It Works

### Enhanced Content Generation Flow

1. **Smart Input Processing**: Auto-detects language and analyzes context
2. **AI Scientific Analysis**: Claude 3 provides deep reasoning and scenario creation
3. **Context-Aware Visuals**: Stable Diffusion creates themed concept art with smart prompting
4. **Professional Video Production**: Enhanced MP4 slideshows with smooth transitions
5. **Secure Storage**: Multi-tier storage with RDS user data and DynamoDB projects
6. **Social Sharing**: Optimized sharing across all major platforms

### New User Experience

- **Progressive Onboarding**: 5 free generations, no signup required
- **Seamless Authentication**: Multiple auth options with smooth transitions
- **Real-time Feedback**: Live progress updates during generation
- **Project Management**: Full CRUD operations for user projects
- **Professional UI**: Modern design with attention to detail

## 🌟 Key Features

### 🧠 **Intelligent Content Generation**
- **Advanced AI Analysis**: Claude 3 with scientific reasoning capabilities
- **Context-Aware Media**: Smart image styling based on content themes
- **Language Auto-Detection**: Automatic language detection from user prompts
- **Professional Video**: Enhanced slideshow creation with smooth transitions

### 👤 **Enhanced User Management**
- **Dual Authentication**: Support for social login and custom accounts
- **Secure Data Storage**: RDS MySQL for user data with encryption
- **Session Management**: JWT-based authentication with automatic cleanup
- **Profile Management**: Extended user profiles with preferences

### 📱 **Modern User Interface**
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Beautiful Animations**: Smooth transitions and micro-interactions
- **Dark Mode Ready**: Prepared for future dark mode implementation
- **Accessibility**: WCAG compliant with keyboard navigation support

### 🎨 **Project Management**
- **Comprehensive Dashboard**: View, search, and manage all projects
- **Advanced Filtering**: Filter by date, popularity, or custom criteria
- **Bulk Operations**: Multi-select for efficient project management
- **Analytics**: Detailed view and share statistics

## 🔒 Security & Privacy

- **Data Protection**: All user data encrypted at rest and in transit
- **Secure Authentication**: Bcrypt password hashing with salt rounds
- **Session Security**: JWT tokens with automatic expiration and cleanup
- **API Security**: Request validation, rate limiting, and CORS protection
- **Media Security**: Signed URLs for secure media access

## 💰 Updated Pricing Structure

### Free Tier
- 5 content generations (no signup required)
- Public project sharing
- Standard image quality
- Basic video slideshows

### Authenticated Users
- Unlimited content generations
- Private project management
- Priority AI processing
- High-quality media output
- Advanced sharing options
- Project analytics

### Premium Features (Future)
- Custom AI model fine-tuning
- Bulk generation capabilities
- Advanced export formats
- Priority support
- Commercial licensing

## 🚀 New API Endpoints

### Authentication
```
POST /api/auth/signup       # Create new user account
POST /api/auth/signin       # User authentication
GET  /api/auth/me          # Get current user
POST /api/auth/signout     # Sign out user
POST /api/auth/reset-password      # Initiate password reset
POST /api/auth/confirm-reset       # Confirm password reset
PUT  /api/auth/profile     # Update user profile
```

### Projects
```
POST /api/generate         # Generate new content (language auto-detected)
GET  /api/project/:id      # Get specific project
GET  /api/user/:id/projects # Get user's projects
POST /api/share           # Create share links
```

## 🛠️ Development

### Updated Project Structure
```
what-if-studio/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── AuthModal.jsx      # Enhanced auth with forgot password
│   │   │   ├── Generator.jsx      # Redesigned with progress tracking
│   │   │   ├── Header.jsx         # Updated navigation
│   │   │   ├── Hero.jsx           # Modern hero section
│   │   │   └── ProjectDisplay.jsx # Enhanced project viewer
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.jsx       # Streamlined home page
│   │   │   ├── AboutPage.jsx      # New dedicated about page
│   │   │   ├── ProjectsPage.jsx   # New project management
│   │   │   └── ProjectPage.jsx    # Individual project view
│   │   ├── services/      # API and auth services
│   │   │   ├── api.js            # Updated API client
│   │   │   └── auth.js           # New RDS-based auth service
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useAuth.js        # Enhanced auth hook
│   │   └── i18n/          # Internationalization
├── backend/               # Serverless API
│   ├── handlers/          # Lambda function handlers
│   │   ├── auth.js               # New auth handlers
│   │   ├── generateContent.js    # Updated with auto-detection
│   │   ├── getProject.js         # Project retrieval
│   │   └── getUserProjects.js    # User project management
│   ├── services/          # Business logic services
│   │   ├── aiService.js          # Enhanced AI with context-aware prompting
│   │   ├── userService.js        # New RDS user management
│   │   ├── databaseService.js    # DynamoDB for projects
│   │   └── mediaService.js       # Improved media processing
└── docs/                  # Documentation
```

### Enhanced Available Scripts

```bash
# Root commands
npm run dev              # Start both frontend and backend
npm run install:all      # Install all dependencies
npm run build           # Build frontend for production

# Backend commands
cd backend
npm run dev             # Start serverless offline
npm run deploy          # Deploy to AWS
npm run logs            # View function logs

# Frontend commands
cd frontend
npm start               # Start development server
npm run build           # Build for production
npm test                # Run tests
```

## 🔄 Migration Guide

### For Existing Users
1. **Data Migration**: Existing DynamoDB user data will be migrated to RDS
2. **Session Updates**: Users will need to re-authenticate once
3. **Project Access**: All existing projects remain accessible
4. **Feature Access**: Immediate access to new project management features

### For Developers
1. **New Dependencies**: Install mysql2, bcryptjs, and jsonwebtoken
2. **Environment Variables**: Add RDS configuration to your .env files
3. **Database Setup**: Run the user service initialization
4. **API Updates**: Frontend now uses new auth endpoints

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#2563eb to #3b82f6)
- **Secondary**: Purple gradient (#764ba2 to #667eea)
- **Accent**: Various theme-based gradients
- **Neutral**: Modern gray scale with proper contrast ratios

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Optimized line height and spacing
- **Code**: Monospace with syntax highlighting

### Components
- **Cards**: Elevated shadows with rounded corners
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with floating labels
- **Modals**: Backdrop blur with smooth animations

## 📖 Documentation

- 🔧 [Local Development Setup](docs/LOCAL_DEVELOPMENT.md)
- 🚀 [Production Deployment Guide](docs/DEPLOYMENT.md)
- 📋 [API Documentation](docs/API.md)
- 🎨 [UI Components Guide](docs/COMPONENTS.md)
- 🔐 [Authentication Setup](docs/AUTH.md)
- 🗄️ [Database Schema](docs/DATABASE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our coding standards
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

### Coding Standards
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS with component-based design
- **State**: Context API for global state, local state for components
- **API**: RESTful design with proper error handling
- **Security**: Input validation and sanitization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@whatifstudio.com
- 📖 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discord: [Join our community](https://discord.gg/whatifstudio)

## 🙏 Acknowledgments

- **AWS Bedrock** for providing access to state-of-the-art AI models
- **Anthropic Claude 3** for intelligent text generation and scientific analysis
- **Stability AI** for high-quality image generation
- **React** and **Tailwind CSS** for excellent frontend frameworks
- **Serverless Framework** for simplified AWS deployment
- **Inter Font** by Rasmus Andersson for beautiful typography

## 🔄 Changelog

### Version 2.0.0 (Latest)

#### ✨ New Features
- **Separate About Page**: Dedicated about page with team information and company details
- **Project Management**: Complete project dashboard with search, filtering, and bulk operations
- **Enhanced Authentication**: Forgot password, account creation, and dual auth system
- **Progress Tracking**: Real-time step-by-step generation progress with detailed feedback
- **Language Auto-Detection**: Automatic language detection from user prompts
- **Smart Media Generation**: Context-aware image styling and enhanced video production

#### 🎨 UI/UX Improvements
- **Modern Design**: Complete visual redesign with gradients and animations
- **Better Navigation**: Proper routing instead of anchor-based scrolling
- **Enhanced Forms**: Beautiful form design with validation and feedback
- **Responsive Layouts**: Improved mobile and tablet experiences
- **Loading States**: Better loading indicators and skeleton screens

#### 🔧 Technical Improvements
- **RDS Integration**: MySQL database for secure user management
- **Enhanced Security**: JWT authentication with session management
- **Better Error Handling**: Comprehensive error states and user feedback
- **Code Organization**: Improved component structure and reusability
- **Performance**: Optimized animations and reduced bundle size

#### 🐛 Bug Fixes
- **Sign Button**: Fixed non-functional sign-in button
- **Navigation**: Fixed home navigation routing
- **Auth Flow**: Improved authentication state management
- **Media Processing**: Enhanced video creation with better transitions

---

**What If Studio v2.0** - Where imagination meets science through next-generation AI ✨

*Built with ❤️ using React, AWS, and cutting-edge AI technology*