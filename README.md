# Chat Realtime

A modern, real-time messaging web application enabling instant communication between users with authentication, online status tracking, and a responsive UI built with Next.js and Firebase.

## Tech Stack

- **Frontend Framework:** Next.js + React
- **Styling:** Tailwind CSS
- **Real-time Communication:** Socket.io
- **Authentication & Database:** Firebase (Firestore + Authentication)
- **Hosting:** Vercel

## Features

- **User Authentication** - Secure login and registration with Firebase Authentication
- **Real-time Messaging** - Instant message delivery using Firebase Realtime Database and Socket.io
- **Online/Offline Status** - Live user presence tracking and status indicators
- **Modern Chat UI** - Clean, intuitive interface with smooth animations
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Deployed on Vercel** - Production-ready with automatic deployments from GitHub

## Project Structure

```
chat-realtime/
├── src/
│   ├── assets/              # Static assets (images, icons)
│   ├── auth/                # Authentication utilities and helpers
│   ├── components/          # Reusable React components
│   ├── context/             # React context for global state
│   ├── hook/                # Custom React hooks
│   │   ├── useAddFriend.ts  # Hook for adding friends
│   │   ├── useAuth.ts       # Authentication hook
│   │   ├── useCall.ts       # Voice/video call hook
│   │   ├── usePresence.ts   # User presence tracking
│   │   └── useUserStatus.ts # User status management
│   ├── layouts/             # Layout components
│   │   ├── ChatLayout.tsx   # Main chat layout
│   │   ├── AddFriend.tsx    # Add friend component
│   │   ├── Login.tsx        # Login page layout
│   │   └── provider.tsx     # Context provider
│   ├── lib/                 # Utility functions
│   │   └── page.tsx         # Page utilities
│   ├── services/            # Business logic and API calls
│   ├── type/                # TypeScript type definitions
│   │   └── types.ts         # Shared type definitions
│   ├── App.css              # Global styles
│   ├── App.tsx              # Root app component
│   ├── index.css            # Index styles
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts        # Vite environment types
├── public/                  # Static public files
├── node_modules/            # Dependencies
├── .env                     # Environment variables (not committed)
├── .gitattributes          # Git attributes
├── .gitignore              # Git ignore rules
├── dsd                      # Project documentation
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Locked dependency versions
├── README.md               # This file
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── vercel.json             # Vercel deployment configuration

chat-realtime-server/       # Backend server directory
├── node_modules/           # Server dependencies
├── .env                     # Server environment variables
├── index.js                # Express/Socket.io server entry point
├── package.json            # Server dependencies
├── package-lock.json       # Server locked dependencies
└── .gitattributes          # Git attributes
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git
- Firebase account with Firestore Database and Authentication enabled

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/chat-realtime.git
cd chat-realtime
```

### 2. Install Frontend Dependencies

```bash
npm install
# or
yarn install
```

### 3. Install Backend Dependencies

```bash
cd chat-realtime-server
npm install
cd ..
```

### 4. Configure Environment Variables

Create `.env` file in the root directory:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_SOCKET_SERVER_URL=http://localhost:3001
```

Create `.env` file in `chat-realtime-server/`:

```
PORT=3001
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### 5. Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

**Terminal 2 - Backend:**
```bash
cd chat-realtime-server
npm start
# Backend runs on http://localhost:3001
```

## Key Components & Hooks

### Custom Hooks

- **useAuth.ts** - Manages user authentication state and login/logout
- **useAddFriend.ts** - Handles adding new friends to contact list
- **useCall.ts** - Manages voice/video call functionality
- **usePresence.ts** - Tracks real-time user presence (online/offline)
- **useUserStatus.ts** - Manages individual user status updates

### Layouts

- **ChatLayout.tsx** - Main messaging interface
- **AddFriend.tsx** - Friend addition UI
- **Login.tsx** - Authentication page

## Firebase Setup

### Enable Required Services

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Enable **Firebase Authentication** (Email/Password provider)
5. Set Firestore Security Rules:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /conversations/{conversationId} {
      allow read, write: if request.auth.uid in resource.data.participants;
    }
    match /messages/{messageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Database Schema

### Users Collection
```javascript
{
  uid: string,
  email: string,
  name: string,
  photoURL: string,
  online: 'true'| 'false',
  createdAt: number,
}
```

### Friends Collection
```javascript
{
  list:[];
}
```

### Chats Collection
```javascript
{
 messages:[
  sender: string;
  text: string;
  seenBy:[];
  createdAt: timestamp;
 ]

}
```

## Available Scripts

```bash
# Development
npm run dev              # Start frontend dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Linting
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Backend
cd chat-realtime-server
npm start                # Start backend server
npm run dev              # Start backend with nodemon
```

## Responsive Design

The application is fully responsive using Tailwind CSS breakpoints:

- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md-lg)
- **Desktop:** > 1024px (xl+)
