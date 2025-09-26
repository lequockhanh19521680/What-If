# What If Studio - Local Development Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** (v8 or later)
- **AWS CLI** configured with appropriate credentials
- **Git**

## Project Structure

```
what-if-studio/
├── frontend/          # React frontend application
├── backend/           # Serverless backend with AWS Lambda
├── docs/             # Documentation
└── package.json      # Root package configuration
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd what-if-studio

# Install all dependencies (root, frontend, and backend)
npm run install:all
```

### 2. AWS Configuration

Ensure your AWS CLI is configured with credentials that have access to:
- AWS Bedrock (Claude 3 and Stable Diffusion models)
- DynamoDB
- S3
- Lambda
- API Gateway
- Cognito

```bash
# Verify AWS configuration
aws configure list
aws sts get-caller-identity
```

### 3. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Install serverless globally (if not already installed)
npm install -g serverless

# Deploy backend infrastructure to AWS
npm run deploy

# Note the API Gateway URL from the deployment output
```

The deployment will create:
- DynamoDB tables for projects and users
- S3 bucket for media storage
- Lambda functions for API endpoints
- Cognito User Pool for authentication
- API Gateway for HTTP endpoints

### 4. Frontend Setup

```bash
cd frontend

# Copy environment template
cp .env.example .env

# Update .env with values from backend deployment:
# - REACT_APP_API_URL (from API Gateway)
# - REACT_APP_USER_POOL_ID (from Cognito)
# - REACT_APP_USER_POOL_CLIENT_ID (from Cognito)
```

### 5. Start Development Servers

#### Option 1: Start both frontend and backend together
```bash
# From project root
npm run dev
```

#### Option 2: Start individually

**Backend (Serverless Offline):**
```bash
cd backend
npm run dev
# Backend will run on http://localhost:3001
```

**Frontend (React Dev Server):**
```bash
cd frontend
npm start
# Frontend will run on http://localhost:3000
```

## Environment Variables

### Backend (.env)
```env
AWS_REGION=us-east-1
BEDROCK_REGION=us-east-1
PROJECTS_TABLE=what-if-studio-backend-projects-dev
USERS_TABLE=what-if-studio-backend-users-dev
MEDIA_BUCKET=what-if-studio-backend-media-dev
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_AWS_REGION=us-east-1
REACT_APP_OAUTH_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
REACT_APP_FRONTEND_URL=http://localhost:3000
```

## Development Workflow

### Testing the Application

1. **Start the development servers** (both frontend and backend)
2. **Open http://localhost:3000** in your browser
3. **Test the main workflow:**
   - Enter a creative hypothesis (e.g., "What if gravity was twice as strong?")
   - Click "Generate Content"
   - Wait for AI processing (images, video creation)
   - View the generated scenario, analysis, images, and video
   - Test sharing functionality

### Key Features to Test

- ✅ **Multilingual Support**: Toggle between English/Vietnamese
- ✅ **AI Content Generation**: Claude 3 scenario creation
- ✅ **Image Generation**: Stable Diffusion concept art
- ✅ **Video Creation**: Automatic slideshow generation
- ✅ **Social Sharing**: Facebook, Twitter, Reddit integration
- ✅ **Authentication**: Cognito sign-in/sign-up
- ✅ **Project Management**: View and manage created projects

## Common Issues and Solutions

### 1. AWS Bedrock Access
**Error**: `AccessDeniedException` when calling Bedrock models

**Solution**: Ensure your AWS account has access to Bedrock and the specific models:
```bash
# Check Bedrock model access
aws bedrock list-foundation-models --region us-east-1
```

### 2. Lambda Timeout
**Error**: Function timeout during image generation

**Solution**: Increase timeout in `serverless.yml`:
```yaml
provider:
  timeout: 900  # 15 minutes max
```

### 3. S3 Bucket Permissions
**Error**: S3 access denied when uploading media

**Solution**: Verify bucket policy allows public read access for generated content.

### 4. CORS Issues
**Error**: CORS blocking frontend API calls

**Solution**: Ensure backend CORS headers include your frontend URL:
```javascript
headers: {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  // ... other headers
}
```

## Performance Optimization

### Development Tips

1. **Use small prompts** during development to speed up testing
2. **Cache API responses** locally for faster iteration
3. **Use serverless offline** for faster backend testing
4. **Monitor AWS CloudWatch logs** for debugging

### Resource Limits

- **Lambda**: 15-minute timeout, 10GB memory max
- **Bedrock**: Rate limits apply to model calls
- **S3**: No practical limits for development
- **DynamoDB**: 25GB free tier

## Next Steps

Once local development is working:
1. Review the [Deployment Guide](DEPLOYMENT.md) for production setup
2. Configure CI/CD pipeline for automated deployments
3. Set up monitoring and logging for production
4. Configure custom domain and SSL certificates

## Support

For issues with local development:
1. Check CloudWatch logs in AWS Console
2. Verify environment variables are set correctly
3. Ensure AWS credentials have necessary permissions
4. Check the GitHub issues for common problems