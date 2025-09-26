# What If Studio - Production Deployment Guide

## Overview

This guide covers deploying What If Studio to production AWS infrastructure with proper security, scalability, and monitoring.

## Prerequisites

- AWS Account with administrative access
- Domain name (optional but recommended)
- SSL certificate for HTTPS (AWS Certificate Manager)
- AWS CLI configured with deployment credentials

## Architecture Overview

### Production Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CloudFront    │────│   S3 (Static)   │    │   API Gateway   │
│   (Frontend)    │    │   (Frontend)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │   Lambda Fns    │
                                               │   (API Logic)   │
                                               └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cognito       │    │   DynamoDB      │    │   S3 (Media)    │
│   (Auth)        │    │   (Data)        │    │   (Assets)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                               ┌─────────────────┐
                                               │   Bedrock       │
                                               │   (AI Models)   │
                                               └─────────────────┘
```

## Step 1: Backend Deployment

### 1.1 Configure Production Environment

```bash
cd backend

# Create production environment file
cp .env.example .env.production

# Update with production values
vim .env.production
```

**Production Environment Variables:**
```env
AWS_REGION=us-east-1
BEDROCK_REGION=us-east-1
STAGE=prod
FRONTEND_URL=https://your-domain.com
```

### 1.2 Deploy Backend Infrastructure

```bash
# Deploy to production
serverless deploy --stage prod

# Note the outputs:
# - API Gateway URL
# - User Pool ID
# - User Pool Client ID
# - S3 Media Bucket name
```

### 1.3 Configure Bedrock Access

Ensure your Lambda execution role has Bedrock permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:ListFoundationModels"
      ],
      "Resource": "*"
    }
  ]
}
```

### 1.4 Configure Custom Domain (Optional)

```bash
# Install serverless domain manager
npm install serverless-domain-manager --save-dev

# Add to serverless.yml
plugins:
  - serverless-domain-manager

custom:
  customDomain:
    domainName: api.your-domain.com
    certificateName: '*.your-domain.com'
    stage: prod
    endpointType: 'regional'

# Create domain
serverless create_domain --stage prod

# Deploy with custom domain
serverless deploy --stage prod
```

## Step 2: Frontend Deployment

### 2.1 Configure Production Build

```bash
cd frontend

# Create production environment
cp .env.example .env.production

# Update with production values
vim .env.production
```

**Production Environment Variables:**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_AWS_REGION=us-east-1
REACT_APP_OAUTH_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
REACT_APP_FRONTEND_URL=https://your-domain.com
```

### 2.2 Build for Production

```bash
# Build optimized production bundle
npm run build

# Verify build output
ls -la build/
```

### 2.3 Deploy to S3 + CloudFront

#### Option A: Manual Deployment

```bash
# Create S3 bucket for static hosting
aws s3 mb s3://your-frontend-bucket --region us-east-1

# Configure bucket for static website hosting
aws s3 website s3://your-frontend-bucket \
  --index-document index.html \
  --error-document index.html

# Upload build files
aws s3 sync build/ s3://your-frontend-bucket --delete

# Create CloudFront distribution (recommended)
```

#### Option B: Automated Deployment Script

Create `deploy-frontend.sh`:
```bash
#!/bin/bash
BUCKET_NAME="your-frontend-bucket"
DISTRIBUTION_ID="your-cloudfront-distribution-id"

# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://$BUCKET_NAME --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

### 2.4 Configure CloudFront Distribution

```json
{
  "Origins": [{
    "DomainName": "your-frontend-bucket.s3.amazonaws.com",
    "Id": "S3-Frontend",
    "S3OriginConfig": {
      "OriginAccessIdentity": ""
    }
  }],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-Frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "managed-caching-optimized"
  },
  "CustomErrorResponses": [{
    "ErrorCode": 404,
    "ResponsePagePath": "/index.html",
    "ResponseCode": 200
  }]
}
```

## Step 3: Security Configuration

### 3.1 IAM Roles and Policies

**Lambda Execution Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-media-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:Query"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/your-projects-table",
        "arn:aws:dynamodb:us-east-1:*:table/your-users-table"
      ]
    }
  ]
}
```

### 3.2 S3 Bucket Policies

**Media Bucket Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-media-bucket/*"
    }
  ]
}
```

### 3.3 API Gateway Configuration

- Enable CORS for all origins in production
- Set up request validation
- Configure rate limiting
- Enable CloudWatch logging

## Step 4: Monitoring and Logging

### 4.1 CloudWatch Dashboards

Create monitoring dashboard for:
- Lambda function metrics (duration, errors, invocations)
- API Gateway metrics (latency, error rates)
- DynamoDB metrics (read/write capacity)
- S3 metrics (requests, data transfer)

### 4.2 Alarms

Set up CloudWatch alarms for:
- Lambda function errors
- High API Gateway latency
- DynamoDB throttling
- S3 access errors

### 4.3 Log Aggregation

Configure log groups:
```bash
# Lambda logs
/aws/lambda/what-if-studio-backend-prod-generateContent
/aws/lambda/what-if-studio-backend-prod-getProject

# API Gateway logs
/aws/apigateway/what-if-studio-backend-prod
```

## Step 5: Performance Optimization

### 5.1 Lambda Optimization

```yaml
# serverless.yml production settings
provider:
  memorySize: 3008  # Maximum for CPU-intensive AI tasks
  timeout: 900      # 15 minutes for complex generations
  environment:
    NODE_OPTIONS: '--max-old-space-size=3008'

functions:
  generateContent:
    reservedConcurrency: 10  # Limit concurrent executions
    provisionedConcurrency: 2  # Keep warm instances
```

### 5.2 DynamoDB Optimization

```yaml
resources:
  Resources:
    ProjectsTable:
      Properties:
        BillingMode: ON_DEMAND  # Auto-scaling for production
        PointInTimeRecoverySpecification:
          PointInTimeRecoveryEnabled: true
        StreamSpecification:
          StreamViewType: NEW_AND_OLD_IMAGES
```

### 5.3 CloudFront Optimization

- Enable compression
- Set appropriate cache headers
- Configure origin shield for global performance
- Use HTTP/2 and HTTP/3

## Step 6: Backup and Disaster Recovery

### 6.1 Database Backups

- Enable DynamoDB Point-in-Time Recovery
- Set up cross-region replication for critical data
- Automate daily backups

### 6.2 Media Storage Backup

- Enable S3 Cross-Region Replication
- Configure lifecycle policies for cost optimization
- Set up versioning for critical assets

## Step 7: SSL and Domain Configuration

### 7.1 Certificate Manager

```bash
# Request SSL certificate
aws acm request-certificate \
  --domain-name your-domain.com \
  --subject-alternative-names "*.your-domain.com" \
  --validation-method DNS \
  --region us-east-1
```

### 7.2 Route 53 Configuration

```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name your-domain.com \
  --caller-reference $(date +%s)

# Add A record for CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1D633PJN98FT9 \
  --change-batch file://dns-record.json
```

## Step 8: Deployment Automation

### 8.1 GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Deploy Backend
        run: |
          cd backend
          npm install
          npx serverless deploy --stage prod
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

  deploy-frontend:
    needs: deploy-backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build and Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          aws s3 sync build/ s3://your-frontend-bucket --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Step 9: Post-Deployment Verification

### 9.1 Health Checks

Create automated tests to verify:
- API endpoints respond correctly
- Authentication flow works
- AI content generation functions
- Media upload/download works
- Sharing links are generated properly

### 9.2 Load Testing

Use tools like Artillery or k6 to test:
- API response times under load
- Concurrent user scenarios
- Database performance
- Media storage throughput

## Cost Optimization

### Estimated Monthly Costs (moderate usage)

- **Lambda**: $20-50/month (based on execution time)
- **DynamoDB**: $5-15/month (on-demand pricing)
- **S3**: $10-30/month (storage and transfer)
- **Bedrock**: $50-200/month (based on API calls)
- **CloudFront**: $5-15/month
- **API Gateway**: $3-10/month

**Total**: ~$100-350/month for moderate usage

### Cost Reduction Strategies

1. **Implement caching** to reduce Bedrock API calls
2. **Use reserved capacity** for predictable workloads
3. **Set up budget alerts** in AWS
4. **Optimize image sizes** to reduce storage costs
5. **Use lifecycle policies** for old media files

## Troubleshooting

### Common Production Issues

1. **Cold starts**: Use provisioned concurrency
2. **Timeouts**: Increase Lambda timeout and memory
3. **Rate limiting**: Implement exponential backoff
4. **CORS errors**: Verify API Gateway CORS configuration
5. **Authentication issues**: Check Cognito configuration

### Monitoring Tools

- AWS CloudWatch for metrics and logs
- AWS X-Ray for distributed tracing
- Third-party tools like Datadog or New Relic
- Custom health check endpoints

This completes the production deployment guide. The application should now be fully operational in a scalable, secure AWS environment.