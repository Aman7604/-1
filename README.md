# ReWear - Sustainable Fashion Exchange Platform

A modern web application for sustainable fashion exchange built with React, Firebase, and Tailwind CSS.

## 🔥 Firebase Integration Features

### Authentication System
- **Email/Password registration** with Firebase Auth
- **Email verification** required before login
- **OTP verification** via Firebase's `sendEmailVerification()`
- **Resend verification email** functionality
- **Secure password handling** by Firebase

### Database Structure
- **Firestore collections** for users, items, redemptions, and swap requests
- **Real-time data synchronization**
- **Structured data models** with proper relationships
- **Automatic timestamps** and metadata

### Security Features
- **Email verification required** for login
- **Comprehensive error handling** for all scenarios
- **Input validation** and sanitization
- **Firebase security rules** ready for implementation

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project

### Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore Database

2. **Configure Authentication**
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Configure email verification settings

3. **Set up Firestore**
   - In Firebase Console, go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

4. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on web app icon to get config
   - Copy the configuration object

### Environment Setup

1. **Update .env file**
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_actual_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
   VITE_FIREBASE_APP_ID=your_actual_app_id
   ```

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

## 🔒 Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Items can be read by anyone, but only created/updated by authenticated users
    match /items/{itemId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         request.auth.uid == request.resource.data.ownerId);
    }
    
    // Redemptions can only be accessed by the user who made them
    match /redemptions/{redemptionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Swap requests can be accessed by involved users
    match /swapRequests/{requestId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.fromUserId || 
         request.auth.uid == resource.data.toUserId);
      allow create: if request.auth != null;
    }
  }
}
```

## 📱 Features

### User Authentication
- Email/password registration
- Email verification requirement
- Secure login/logout
- Password reset functionality
- User profile management

### Item Management
- Upload clothing items with images
- Browse available items
- Search and filter functionality
- Real-time updates

### Point System
- Earn points for uploading items
- Spend points to redeem items
- Track point history
- Bonus point system

### Swap System
- Create swap requests
- Accept/decline swaps
- Track swap history

## 🛠 Technology Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React
- **Backend**: Firebase Authentication, Firestore Database
- **Build Tool**: Vite
- **Deployment**: Ready for Netlify/Vercel

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── pages/              # Page components
├── services/           # Firebase service layers
├── config/             # Firebase configuration
└── utils/              # Utility functions
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

- **AuthService**: Handles all authentication operations
- **DataService**: Manages Firestore operations
- **AuthContext**: Provides authentication state
- **DataContext**: Provides application data state

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Netlify: Connect your GitHub repo
   - Vercel: Import your project
   - Firebase Hosting: Use Firebase CLI

3. **Set environment variables** on your deployment platform

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, email support@rewear.com or create an issue in the repository.
</parameter>