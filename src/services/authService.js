import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    
    // Listen for auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.authStateListeners.forEach(callback => callback(user));
    });
  }

  // Register new user
  async register(email, password, name) {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, {
        displayName: name
      });

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        name: name,
        points: 50, // Welcome bonus
        joinDate: new Date().toISOString(),
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          name: name,
          emailVerified: user.emailVerified
        },
        message: 'Registration successful! Please check your email for verification.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
        code: error.code
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await signOut(auth); // Sign out unverified user
        return {
          success: false,
          error: 'Please verify your email before logging in.',
          code: 'email-not-verified',
          needsVerification: true
        };
      }

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Update email verification status in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          emailVerified: true,
          lastLogin: new Date(),
          updatedAt: new Date()
        });

        return {
          success: true,
          user: {
            uid: user.uid,
            email: user.email,
            name: userData.name,
            points: userData.points,
            joinDate: userData.joinDate,
            emailVerified: true
          }
        };
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code),
        code: error.code
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Failed to logout'
      };
    }
  }

  // Resend verification email
  async resendVerificationEmail() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return {
          success: true,
          message: 'Verification email sent successfully!'
        };
      } else {
        return {
          success: false,
          error: 'No user logged in'
        };
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // Get current user data
  async getCurrentUserData() {
    try {
      if (!auth.currentUser) return null;

      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        return {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
          ...userDoc.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  // Update user points
  async updateUserPoints(userId, newPoints) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        points: newPoints,
        updatedAt: new Date()
      });
      return { success: true };
    } catch (error) {
      console.error('Update points error:', error);
      return { success: false, error: error.message };
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  }

  // Get user-friendly error messages
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered. Please use a different email or try logging in.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your internet connection.',
      'auth/invalid-credential': 'Invalid email or password. Please try again.',
      'email-not-verified': 'Please verify your email before logging in.'
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }
}

export default new AuthService();</parameter>