# What If Studio

🚀 **AI-powered creative scenario generator** that transforms your hypotheses into logical, scientifically-grounded scenarios with multimedia content.

## ✨ Features

- 🧠 **Intelligent AI Analysis**: Uses Claude 3 for scientific reasoning and scenario generation
- 🎨 **Auto-Generated Content**: Creates 4 high-quality concept art images using Stable Diffusion
- 🎬 **Video Slideshow**: Automatically combines images into an MP4 video
- 🌍 **Multilingual Support**: Available in English and Vietnamese
- 📱 **Social Sharing**: Easy sharing to Facebook, Twitter, and Reddit
- 🔐 **User Authentication**: AWS Cognito with Google/Facebook login
- 💾 **Project History**: Save and manage your creative scenarios

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 18, Tailwind CSS, React Router
- **Backend**: AWS Lambda (Serverless Framework)
- **AI Models**: AWS Bedrock (Claude 3, Stable Diffusion)
- **Database**: Amazon DynamoDB
- **Storage**: Amazon S3
- **Authentication**: AWS Cognito
- **Hosting**: CloudFront + S3 (Frontend), API Gateway (Backend)

### AWS Services Used

| Service | Purpose |
|---------|---------|
| AWS Bedrock | AI model access (Claude 3, Stable Diffusion) |
| Lambda | Serverless compute for API functions |
| DynamoDB | NoSQL database for projects and users |
| S3 | Media storage for images and videos |
| Cognito | User authentication and management |
| API Gateway | RESTful API endpoints |
| CloudFront | CDN for global content delivery |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- AWS CLI configured
- AWS account with Bedrock access

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd what-if-studio
   npm run install:all
   ```

2. **Deploy backend infrastructure**
   ```bash
   cd backend
   cp .env.example .env
   npm run deploy
   ```

3. **Configure frontend**
   ```bash
   cd frontend
   cp .env.example .env
   # Update .env with backend deployment outputs
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

5. **Open http://localhost:3000**

For detailed setup instructions, see [Local Development Guide](docs/LOCAL_DEVELOPMENT.md).

## 📖 Documentation

- 🔧 [Local Development Setup](docs/LOCAL_DEVELOPMENT.md)
- 🚀 [Production Deployment Guide](docs/DEPLOYMENT.md)
- 📋 [API Documentation](docs/API.md)
- 🎨 [UI Components Guide](docs/COMPONENTS.md)

## 🎯 How It Works

1. **Input**: User enters a creative hypothesis (e.g., "What if gravity was twice as strong?")
2. **AI Analysis**: Claude 3 analyzes the hypothesis scientifically and creates a detailed scenario
3. **Image Generation**: Stable Diffusion creates 4 concept art images based on the scenario
4. **Video Creation**: Images are automatically combined into an MP4 slideshow
5. **Storage**: All content is stored in S3 with metadata in DynamoDB
6. **Sharing**: Users can share projects across social platforms with optimized meta tags

## 🌟 Key Features

### Intelligent Content Generation
- **Scientific Analysis**: Deep reasoning about hypothetical scenarios
- **Creative Scenarios**: Detailed, engaging storylines
- **Visual Content**: High-quality concept art automatically generated
- **Video Production**: Seamless slideshow creation

### User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Multilingual**: Full support for English and Vietnamese
- **Progressive Enhancement**: Works without authentication (5 free uses)
- **Real-time Progress**: Live updates during content generation

### Technical Excellence
- **Serverless Architecture**: Scalable, cost-effective AWS infrastructure
- **Security**: AWS Cognito authentication with social login
- **Performance**: CDN delivery, optimized images, efficient caching
- **Monitoring**: CloudWatch logging and metrics

## 🔒 Security & Privacy

- **Data Protection**: All user data encrypted at rest and in transit
- **Authentication**: Secure AWS Cognito integration
- **API Security**: Request validation and rate limiting
- **Media Security**: Signed URLs for secure media access

## 💰 Cost Structure

### Free Tier
- 5 content generations per anonymous user
- Public project sharing
- Basic image quality

### Authenticated Users
- Unlimited content generations
- Project history and management
- Priority processing
- High-quality media

## 🚀 Deployment

### Development
```bash
# Deploy backend
cd backend && npm run deploy

# Deploy frontend
cd frontend && npm run build
aws s3 sync build/ s3://your-bucket
```

### Production
See the comprehensive [Deployment Guide](docs/DEPLOYMENT.md) for:
- AWS infrastructure setup
- Custom domain configuration
- SSL certificate management
- Monitoring and logging
- CI/CD pipeline setup

## 🛠️ Development

### Project Structure
```
what-if-studio/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and auth services
│   │   ├── hooks/         # Custom React hooks
│   │   └── i18n/          # Internationalization
├── backend/               # Serverless API
│   ├── handlers/          # Lambda function handlers
│   ├── services/          # Business logic services
│   └── utils/             # Utility functions
└── docs/                  # Documentation
```

### Available Scripts

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@whatifstudio.com
- 📖 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- **AWS Bedrock** for providing access to state-of-the-art AI models
- **Anthropic Claude 3** for intelligent text generation
- **Stability AI** for high-quality image generation
- **React** and **Tailwind CSS** for excellent frontend frameworks
- **Serverless Framework** for simplified AWS deployment

---

**What If Studio** - Where imagination meets science through AI ✨