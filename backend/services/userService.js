const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

class UserService {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.RDS_HOST,
      port: process.env.RDS_PORT || 3306,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false
    });
    
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async initializeDatabase() {
    try {
      const connection = await this.pool.getConnection();
      
      // Create users table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          email_verified BOOLEAN DEFAULT FALSE,
          verification_token VARCHAR(255),
          reset_token VARCHAR(255),
          reset_token_expires DATETIME,
          subscription_tier ENUM('free', 'premium', 'enterprise') DEFAULT 'free',
          usage_count INT DEFAULT 0,
          last_login DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_verification_token (verification_token),
          INDEX idx_reset_token (reset_token)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create user_sessions table for JWT management
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          token_hash VARCHAR(255) NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_token_hash (token_hash),
          INDEX idx_expires_at (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create user_profiles table for additional info
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          user_id VARCHAR(36) PRIMARY KEY,
          avatar_url VARCHAR(500),
          bio TEXT,
          preferences JSON,
          social_links JSON,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      connection.release();
      console.log('Database tables initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async createUser(email, password, name) {
    try {
      const connection = await this.pool.getConnection();
      
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (existingUsers.length > 0) {
        connection.release();
        throw new Error('User already exists with this email');
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Generate user ID and verification token
      const userId = uuidv4();
      const verificationToken = uuidv4();

      // Insert user
      await connection.execute(
        `INSERT INTO users (id, email, password_hash, name, verification_token) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, email, passwordHash, name, verificationToken]
      );

      // Create user profile
      await connection.execute(
        `INSERT INTO user_profiles (user_id, preferences) 
         VALUES (?, ?)`,
        [userId, JSON.stringify({ language: 'en', theme: 'light' })]
      );

      connection.release();

      return {
        userId,
        email,
        name,
        verificationToken
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async authenticateUser(email, password) {
    try {
      const connection = await this.pool.getConnection();
      
      // Get user with password hash
      const [users] = await connection.execute(
        'SELECT id, email, password_hash, name, email_verified FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        connection.release();
        throw new Error('Invalid email or password');
      }

      const user = users[0];
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        connection.release();
        throw new Error('Invalid email or password');
      }

      // Update last login
      await connection.execute(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id]
      );

      connection.release();

      // Generate JWT token
      const token = this.generateJWT(user.id);
      await this.storeSession(user.id, token);

      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified,
        token
      };
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const connection = await this.pool.getConnection();
      
      const [users] = await connection.execute(
        `SELECT u.id, u.email, u.name, u.email_verified, u.subscription_tier, u.usage_count,
                p.avatar_url, p.bio, p.preferences, p.social_links
         FROM users u
         LEFT JOIN user_profiles p ON u.id = p.user_id
         WHERE u.id = ?`,
        [userId]
      );
      
      connection.release();
      
      if (users.length === 0) {
        return null;
      }

      const user = users[0];
      return {
        userId: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.email_verified,
        subscriptionTier: user.subscription_tier,
        usageCount: user.usage_count,
        avatar: user.avatar_url,
        bio: user.bio,
        preferences: user.preferences ? JSON.parse(user.preferences) : {},
        socialLinks: user.social_links ? JSON.parse(user.social_links) : {}
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  generateJWT(userId) {
    return jwt.sign(
      { userId, type: 'access' },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  async verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      // Check if session exists and is valid
      const connection = await this.pool.getConnection();
      const [sessions] = await connection.execute(
        'SELECT user_id FROM user_sessions WHERE token_hash = ? AND expires_at > NOW()',
        [this.hashToken(token)]
      );
      connection.release();

      if (sessions.length === 0) {
        throw new Error('Invalid or expired session');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async storeSession(userId, token) {
    try {
      const connection = await this.pool.getConnection();
      const sessionId = uuidv4();
      const tokenHash = this.hashToken(token);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

      await connection.execute(
        'INSERT INTO user_sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
        [sessionId, userId, tokenHash, expiresAt]
      );
      
      connection.release();
    } catch (error) {
      console.error('Error storing session:', error);
    }
  }

  async revokeSession(token) {
    try {
      const connection = await this.pool.getConnection();
      const tokenHash = this.hashToken(token);
      
      await connection.execute(
        'DELETE FROM user_sessions WHERE token_hash = ?',
        [tokenHash]
      );
      
      connection.release();
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  }

  hashToken(token) {
    return require('crypto').createHash('sha256').update(token).digest('hex');
  }

  async updateUserUsage(userId) {
    try {
      const connection = await this.pool.getConnection();
      
      await connection.execute(
        'UPDATE users SET usage_count = usage_count + 1 WHERE id = ?',
        [userId]
      );
      
      connection.release();
    } catch (error) {
      console.error('Error updating user usage:', error);
    }
  }

  async getUserUsage(userId) {
    try {
      const connection = await this.pool.getConnection();
      
      const [users] = await connection.execute(
        'SELECT usage_count, subscription_tier FROM users WHERE id = ?',
        [userId]
      );
      
      connection.release();
      
      if (users.length === 0) {
        return { usageCount: 0, subscriptionTier: 'free' };
      }

      return {
        usageCount: users[0].usage_count,
        subscriptionTier: users[0].subscription_tier
      };
    } catch (error) {
      console.error('Error getting user usage:', error);
      return { usageCount: 0, subscriptionTier: 'free' };
    }
  }

  async resetPassword(email) {
    try {
      const connection = await this.pool.getConnection();
      
      // Check if user exists
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        connection.release();
        throw new Error('No user found with this email address');
      }

      // Generate reset token
      const resetToken = uuidv4();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

      await connection.execute(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
        [resetToken, expiresAt, email]
      );
      
      connection.release();

      // In production, send email with reset token
      console.log(`Password reset token for ${email}: ${resetToken}`);

      return { resetToken };
    } catch (error) {
      console.error('Error initiating password reset:', error);
      throw error;
    }
  }

  async confirmPasswordReset(email, resetToken, newPassword) {
    try {
      const connection = await this.pool.getConnection();
      
      // Verify reset token
      const [users] = await connection.execute(
        'SELECT id FROM users WHERE email = ? AND reset_token = ? AND reset_token_expires > NOW()',
        [email, resetToken]
      );
      
      if (users.length === 0) {
        connection.release();
        throw new Error('Invalid or expired reset token');
      }

      // Hash new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      await connection.execute(
        'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?',
        [passwordHash, email]
      );
      
      connection.release();

      return { success: true };
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, profileData) {
    try {
      const connection = await this.pool.getConnection();
      
      // Update user basic info
      if (profileData.name) {
        await connection.execute(
          'UPDATE users SET name = ? WHERE id = ?',
          [profileData.name, userId]
        );
      }

      // Update profile
      const profileFields = [];
      const profileValues = [];
      
      if (profileData.bio !== undefined) {
        profileFields.push('bio = ?');
        profileValues.push(profileData.bio);
      }
      
      if (profileData.avatarUrl !== undefined) {
        profileFields.push('avatar_url = ?');
        profileValues.push(profileData.avatarUrl);
      }
      
      if (profileData.preferences !== undefined) {
        profileFields.push('preferences = ?');
        profileValues.push(JSON.stringify(profileData.preferences));
      }
      
      if (profileData.socialLinks !== undefined) {
        profileFields.push('social_links = ?');
        profileValues.push(JSON.stringify(profileData.socialLinks));
      }

      if (profileFields.length > 0) {
        profileValues.push(userId);
        await connection.execute(
          `UPDATE user_profiles SET ${profileFields.join(', ')} WHERE user_id = ?`,
          profileValues
        );
      }
      
      connection.release();
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const connection = await this.pool.getConnection();
      
      // Start transaction
      await connection.beginTransaction();
      
      // Delete user sessions
      await connection.execute('DELETE FROM user_sessions WHERE user_id = ?', [userId]);
      
      // Delete user profile
      await connection.execute('DELETE FROM user_profiles WHERE user_id = ?', [userId]);
      
      // Delete user
      await connection.execute('DELETE FROM users WHERE id = ?', [userId]);
      
      // Commit transaction
      await connection.commit();
      connection.release();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async cleanupExpiredSessions() {
    try {
      const connection = await this.pool.getConnection();
      
      await connection.execute('DELETE FROM user_sessions WHERE expires_at < NOW()');
      
      connection.release();
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }
}

module.exports = UserService;