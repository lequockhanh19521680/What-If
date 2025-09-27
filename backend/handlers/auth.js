const UserService = require('../services/userService');

const userService = new UserService();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
  "Content-Type": "application/json",
};

// Sign Up Handler
exports.signUp = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    const { email, password, name } = JSON.parse(event.body);

    if (!email || !password || !name) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Email, password, and name are required" }),
      };
    }

    // Validate password strength
    if (password.length < 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Password must be at least 8 characters long" }),
      };
    }

    const user = await userService.createUser(email, password, name);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: "User created successfully. Please check your email for verification.",
        userId: user.userId
      }),
    };
  } catch (error) {
    console.error("Error in signUp:", error);
    return {
      statusCode: error.message.includes('already exists') ? 409 : 500,
      headers,
      body: JSON.stringify({
        error: error.message || "Failed to create user",
      }),
    };
  }
};

// Sign In Handler
exports.signIn = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Email and password are required" }),
      };
    }

    const authResult = await userService.authenticateUser(email, password);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user: {
          userId: authResult.userId,
          email: authResult.email,
          name: authResult.name,
          emailVerified: authResult.emailVerified
        },
        token: authResult.token
      }),
    };
  } catch (error) {
    console.error("Error in signIn:", error);
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        error: error.message || "Authentication failed",
      }),
    };
  }
};

// Get Current User Handler
exports.getCurrentUser = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    const token = event.headers.Authorization?.replace('Bearer ', '');
    
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "No token provided" }),
      };
    }

    const decoded = await userService.verifyJWT(token);
    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        user
      }),
    };
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        error: "Invalid or expired token",
      }),
    };
  }
};

// Reset Password Handler
exports.resetPassword = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    await userService.resetPassword(email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Password reset code sent to your email"
      }),
    };
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: error.message || "Failed to send reset code",
      }),
    };
  }
};

// Confirm Password Reset Handler
exports.confirmResetPassword = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    const { email, resetToken, newPassword } = JSON.parse(event.body);

    if (!email || !resetToken || !newPassword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Email, reset token, and new password are required" }),
      };
    }

    if (newPassword.length < 8) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Password must be at least 8 characters long" }),
      };
    }

    await userService.confirmPasswordReset(email, resetToken, newPassword);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Password reset successfully"
      }),
    };
  } catch (error) {
    console.error("Error in confirmResetPassword:", error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: error.message || "Failed to reset password",
      }),
    };
  }
};

// Sign Out Handler
exports.signOut = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    const token = event.headers.Authorization?.replace('Bearer ', '');
    
    if (token) {
      await userService.revokeSession(token);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Signed out successfully"
      }),
    };
  } catch (error) {
    console.error("Error in signOut:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to sign out",
      }),
    };
  }
};

// Update Profile Handler
exports.updateProfile = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    const token = event.headers.Authorization?.replace('Bearer ', '');
    
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Authentication required" }),
      };
    }

    const decoded = await userService.verifyJWT(token);
    const profileData = JSON.parse(event.body);

    await userService.updateUserProfile(decoded.userId, profileData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Profile updated successfully"
      }),
    };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to update profile",
      }),
    };
  }
};