# Migration Guide - What If Studio v2.0

This guide covers migrating from v1.0 to v2.0 with the new authentication system and enhanced features.

## 🔄 Overview

Version 2.0 introduces significant changes:
- **New RDS-based user management** alongside existing AWS Cognito
- **Enhanced UI/UX** with modern design patterns
- **Project management dashboard** for better user experience
- **Improved content generation** with real-time progress tracking

## 🗄️ Database Migration

### 1. RDS Setup

Create a new RDS MySQL instance or use existing one:

```sql
CREATE DATABASE whatif_studio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Environment Variables

Add these new environment variables to your backend:

```bash
# RDS Configuration
RDS_HOST=your-rds-endpoint.amazonaws.com
RDS_PORT=3306
RDS_USER=your_username
RDS_PASSWORD=your_password
RDS_DATABASE=whatif_studio

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret-key-here
```

### 3. Initialize Database Schema

The UserService will automatically create tables on first run:

```bash
cd backend
npm install mysql2 bcryptjs jsonwebtoken
npm run deploy
```

### 4. Migrate Existing Users (Optional)

If you have existing Cognito users, you can migrate them:

```javascript
// Migration script example
const UserService = require('./services/userService');
const userService = new UserService();

async function migrateUsers() {
  // Get existing Cognito users
  const cognitoUsers = await getCognitoUsers();
  
  for (const user of cognitoUsers) {
    try {
      await userService.createUser(
        user.email,
        'temporary-password', // Users will need to reset
        user.name || user.email.split('@')[0]
      );
      console.log(`Migrated user: ${user.email}`);
    } catch (error) {
      console.error(`Failed to migrate ${user.email}:`, error.message);
    }
  }
}
```

## 🎨 Frontend Updates

### 1. Install New Dependencies

```bash
cd frontend
npm install @tailwindcss/typography
```

### 2. Component Updates

Key components have been redesigned:
- `AuthModal.jsx` - Enhanced with forgot password
- `Header.jsx` - Proper routing navigation
- `Generator.jsx` - Real-time progress tracking
- `Hero.jsx` - Modern design with animations

### 3. New Pages

- **AboutPage.jsx** - Dedicated about page
- **ProjectsPage.jsx** - Project management dashboard

### 4. Routing Changes

Updated React Router configuration:
```javascript
// Old
<Route path="/" element={<HomePage />} />

// New
<Route path="/" element={<HomePage />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/projects" element={<ProjectsPage />} />
```

## 🔐 Authentication Migration

### Dual Authentication System

v2.0 supports both systems:

1. **AWS Cognito** (existing) - For Google/Facebook login
2. **RDS MySQL** (new) - For email/password accounts

### Frontend Auth Service

The auth service now supports both:

```javascript
// Auto-detects authentication method
await authService.signIn(email, password);

// New methods
await authService.resetPassword(email);
await authService.confirmResetPassword(email, code, newPassword);
```

## 📊 Project Management

### New Features

Users now have access to:
- **Project Dashboard** - View all projects in grid/list mode
- **Search & Filter** - Find projects by title, date, or status
- **Bulk Operations** - Select and manage multiple projects
- **Analytics** - View count and share statistics

### Database Schema

Projects remain in DynamoDB but with enhanced metadata:
```javascript
{
  projectId: "uuid",
  userId: "user-uuid",
  title: "Project Title",
  language: "auto-detected", // No longer required in request
  enhancedPrompts: [], // New: AI-enhanced image prompts
  analytics: {
    viewCount: 0,
    shareCount: 0,
    createdAt: "2025-01-01",
    lastViewed: "2025-01-01"
  }
}
```

## 🎯 Content Generation Updates

### Language Auto-Detection

Remove language parameter from generation requests:

```javascript
// Old
await apiService.generateContent(prompt, 'en', userId);

// New
await apiService.generateContent(prompt, userId);
```

### Enhanced Progress Tracking

The new Generator component provides real-time updates:
- Step-by-step progress visualization
- Detailed status messages
- Output previews for each step
- Estimated completion times

## 🚀 Deployment

### Backend Deployment

1. **Update Serverless Config**
   ```yaml
   # New auth functions added automatically
   functions:
     signUp:
       handler: handlers/auth.signUp
     signIn:
       handler: handlers/auth.signIn
     # ... other auth functions
   ```

2. **Deploy**
   ```bash
   cd backend
   npm run deploy
   ```

### Frontend Deployment

1. **Build with New Assets**
   ```bash
   cd frontend
   npm run build
   ```

2. **Update Environment**
   ```bash
   # Add new API endpoints
   REACT_APP_API_URL=https://your-api-gateway-url/api
   ```

## 🧪 Testing

### Test New Features

1. **Authentication Flow**
   - Sign up with email/password
   - Test forgot password flow
   - Verify social login still works

2. **Content Generation**
   - Test language auto-detection
   - Verify progress tracking works
   - Check enhanced media quality

3. **Project Management**
   - Create and manage projects
   - Test search and filtering
   - Verify bulk operations

## 🔧 Troubleshooting

### Common Issues

1. **RDS Connection Errors**
   - Verify security group allows Lambda access
   - Check VPC configuration
   - Validate credentials

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration settings
   - Verify session cleanup

3. **UI Rendering Issues**
   - Clear browser cache
   - Check Tailwind CSS compilation
   - Verify font loading

### Debug Commands

```bash
# Backend logs
cd backend && npm run logs -- generateContent

# Frontend debug
cd frontend && npm start

# Database connection test
mysql -h $RDS_HOST -u $RDS_USER -p $RDS_DATABASE
```

## 📈 Performance Improvements

### v2.0 Optimizations

- **Lazy Loading**: Components load on demand
- **Image Optimization**: Better compression and sizing
- **Caching**: Enhanced browser and CDN caching
- **Bundle Size**: Reduced JavaScript payload
- **Database**: Optimized queries with proper indexing

## 🎯 Next Steps

After migration:

1. **Monitor Performance**: Check CloudWatch metrics
2. **User Feedback**: Gather feedback on new features
3. **Analytics**: Set up user behavior tracking
4. **Optimization**: Fine-tune based on usage patterns

## 📞 Support

Need help with migration?
- 📧 Email: dev-support@whatifstudio.com
- 📖 Documentation: [Full docs](../docs/)
- 🐛 Issues: Report on GitHub

---

*Migration guide for What If Studio v2.0 - Built for scale, designed for users* ✨