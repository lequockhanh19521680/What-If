# What If Studio v2.0 Setup Guide

Complete setup guide for the enhanced What If Studio with new authentication system, project management, and modern UI.

## 🎯 Prerequisites

- **Node.js 18+** - Latest LTS version
- **AWS CLI** - Configured with appropriate permissions
- **MySQL Database** - RDS instance or local MySQL
- **AWS Bedrock Access** - For AI model usage

## 🏗️ Infrastructure Setup

### 1. AWS RDS MySQL Setup

Create a new RDS MySQL instance:

```bash
# Create RDS subnet group
aws rds create-db-subnet-group \
  --db-subnet-group-name whatif-subnet-group \
  --db-subnet-group-description "Subnet group for What If Studio" \
  --subnet-ids subnet-12345 subnet-67890

# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier whatif-studio-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password YourSecurePassword123! \
  --allocated-storage 20 \
  --storage-type gp2 \
  --db-subnet-group-name whatif-subnet-group \
  --vpc-security-group-ids sg-12345678 \
  --backup-retention-period 7 \
  --storage-encrypted
```

### 2. Security Group Configuration

Create security group for RDS access:

```bash
# Create security group
aws ec2 create-security-group \
  --group-name whatif-rds-sg \
  --description "Security group for What If Studio RDS"

# Allow MySQL access from Lambda
aws ec2 authorize-security-group-ingress \
  --group-id sg-12345678 \
  --protocol tcp \
  --port 3306 \
  --source-group sg-lambda-sg
```

### 3. AWS Systems Manager Parameters

Store sensitive configuration in SSM:

```bash
# JWT Secret
aws ssm put-parameter \
  --name "/what-if/jwt-secret" \
  --value "your-super-secure-jwt-secret-256-bit-key" \
  --type "SecureString"

# RDS Configuration
aws ssm put-parameter \
  --name "/what-if/rds-host" \
  --value "your-rds-endpoint.amazonaws.com" \
  --type "String"

aws ssm put-parameter \
  --name "/what-if/rds-user" \
  --value "admin" \
  --type "String"

aws ssm put-parameter \
  --name "/what-if/rds-password" \
  --value "YourSecurePassword123!" \
  --type "SecureString"

aws ssm put-parameter \
  --name "/what-if/rds-database" \
  --value "whatif_studio" \
  --type "String"

# Google OAuth (if using)
aws ssm put-parameter \
  --name "/what-if/google-client-id" \
  --value "your-google-client-id" \
  --type "String"

aws ssm put-parameter \
  --name "/what-if/google-client-secret" \
  --value "your-google-client-secret" \
  --type "SecureString"
```

## 🔧 Backend Configuration

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create `.env` file:

```bash
# AWS Configuration
AWS_REGION=us-east-1
BEDROCK_REGION=us-east-1

# Database
RDS_HOST=your-rds-endpoint.amazonaws.com
RDS_PORT=3306
RDS_USER=admin
RDS_PASSWORD=YourSecurePassword123!
RDS_DATABASE=whatif_studio

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-256-bit-key

# Storage
MEDIA_BUCKET=what-if-studio-media-dev

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Deploy Backend

```bash
cd backend
npm run deploy
```

This will:
- Create all Lambda functions
- Set up API Gateway endpoints
- Create DynamoDB tables
- Configure S3 bucket
- Initialize RDS database schema

## 🎨 Frontend Configuration

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

Create `.env` file:

```bash
# API Configuration
REACT_APP_API_URL=https://your-api-gateway-url/api

# AWS Cognito (for social login)
REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_AWS_REGION=us-east-1
REACT_APP_OAUTH_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
```

### 3. Start Development Server

```bash
cd frontend
npm start
```

## 🗄️ Database Initialization

The database will auto-initialize on first backend deployment, but you can manually run:

```javascript
// In Lambda console or local testing
const UserService = require('./services/userService');
const userService = new UserService();

await userService.initializeDatabase();
```

## 🧪 Testing the Setup

### 1. Backend Health Check

```bash
curl https://your-api-gateway-url/api/auth/me
# Should return 401 (expected for no auth)
```

### 2. Frontend Access

Open `http://localhost:3000` and verify:
- ✅ Home page loads with new design
- ✅ Sign in button opens modal
- ✅ About page is accessible via navigation
- ✅ Content generation shows progress

### 3. Database Connectivity

Check RDS connection:

```bash
mysql -h your-rds-endpoint.amazonaws.com -u admin -p
SHOW TABLES;
# Should show: users, user_sessions, user_profiles
```

## 🚀 Production Deployment

### 1. Update Environment Variables

```bash
# Backend production
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production

# Frontend production
REACT_APP_API_URL=https://your-prod-api-gateway-url/api
```

### 2. Deploy Backend

```bash
cd backend
npm run deploy -- --stage prod
```

### 3. Build and Deploy Frontend

```bash
cd frontend
npm run build
aws s3 sync build/ s3://your-production-bucket
```

### 4. CloudFront Invalidation

```bash
aws cloudfront create-invalidation \
  --distribution-id XXXXXXXXXX \
  --paths "/*"
```

## 🔐 Security Checklist

### Backend Security
- ✅ JWT secrets in SSM Parameter Store
- ✅ RDS password encrypted
- ✅ VPC security groups configured
- ✅ CORS properly configured
- ✅ Input validation on all endpoints

### Frontend Security
- ✅ Environment variables for public data only
- ✅ No sensitive data in localStorage
- ✅ Proper token management
- ✅ HTTPS enforced in production
- ✅ Content Security Policy headers

## 📊 Monitoring & Observability

### CloudWatch Metrics

Monitor these key metrics:
- Lambda execution times
- RDS connection count
- S3 storage usage
- API Gateway request counts
- Error rates per function

### Logging Setup

```bash
# View backend logs
cd backend
npm run logs -- functionName

# Frontend error tracking
# Implement Sentry or similar service
```

## 🎯 Feature Verification

### New Features Checklist

- ✅ **About Page**: Separate page with company info
- ✅ **Progress Display**: Real-time generation progress
- ✅ **Sign Button**: Functional auth modal
- ✅ **Media Handling**: Context-aware content generation
- ✅ **Language Detection**: Auto-detection from prompts
- ✅ **Home Navigation**: Proper routing instead of anchors
- ✅ **Enhanced Auth**: Forgot password functionality
- ✅ **User Management**: RDS-based secure user system
- ✅ **Project Management**: Full project dashboard
- ✅ **Modern UI**: Beautiful, responsive design

## 🆘 Common Issues & Solutions

### 1. RDS Connection Timeouts
```bash
# Check VPC configuration
aws ec2 describe-vpcs
aws ec2 describe-subnets
aws ec2 describe-security-groups
```

### 2. JWT Token Errors
```javascript
// Verify JWT secret is properly set
console.log(process.env.JWT_SECRET?.length); // Should be > 32
```

### 3. Media Upload Failures
```bash
# Check S3 bucket permissions
aws s3api get-bucket-policy --bucket your-bucket-name
```

### 4. UI Not Loading
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support & Resources

- **Documentation**: [Complete docs](../docs/)
- **API Reference**: [API docs](./API.md)
- **Component Guide**: [UI components](./COMPONENTS.md)
- **Deployment Guide**: [Production deployment](./DEPLOYMENT.md)
- **Migration Guide**: [v1 to v2 migration](./MIGRATION.md)

---

*What If Studio v2.0 - Enterprise-ready AI content generation platform* 🚀