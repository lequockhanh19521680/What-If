import { Amplify } from 'aws-amplify';
import { signIn, signOut, signUp, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// Configure Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
      signUpVerificationMethod: 'email',
      loginWith: {
        oauth: {
          domain: process.env.REACT_APP_OAUTH_DOMAIN || 'your-domain.auth.us-east-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: ['http://localhost:3000/', 'https://yourdomain.com/'],
          redirectSignOut: ['http://localhost:3000/', 'https://yourdomain.com/'],
          responseType: 'code'
        },
        email: true,
        username: false
      }
    }
  }
};

Amplify.configure(amplifyConfig);

class AuthService {
  async getCurrentUser() {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      return null;
    }
  }

  async signIn(email, password) {
    try {
      const result = await signIn({
        username: email,
        password
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signUp(email, password, name) {
    try {
      const result = await signUp({
        username: email,
        password,
        attributes: {
          email,
          name
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut();
    } catch (error) {
      throw error;
    }
  }

  async getAccessToken() {
    try {
      const session = await fetchAuthSession();
      return session.tokens?.accessToken?.toString();
    } catch (error) {
      return null;
    }
  }

  async getUserId() {
    try {
      const user = await this.getCurrentUser();
      return user?.userId;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();