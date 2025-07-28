# Pettit - Social Media Platform Documentation

## Overview
Pettit is a Reddit-like social media platform built with Next.js, featuring real-time posts, community management, and user authentication through Firebase.

## Tech Stack

### Frontend
- **Next.js 12.3.4** - React framework with Pages Router
- **React 18.2.0** - UI library
- **TypeScript** - Type safety
- **Chakra UI 2.8.2** - Component library and styling
- **Framer Motion 11.0.5** - Animations
- **Recoil 0.7.7** - State management

### Backend & Services
- **Firebase 10.8.0** - Authentication, Firestore database, storage
- **Firebase Functions 4.7.0** - Serverless functions

### Additional Libraries
- **react-firebase-hooks 5.1.1** - Firebase React hooks
- **react-icons 5.0.1** - Icon library
- **moment 2.30.1** - Date manipulation

## Project Structure

```
src/
├── pages/                 # Next.js pages (Pages Router)
│   ├── _app.tsx          # App wrapper with providers
│   ├── index.tsx         # Home page
│   └── api/              # API routes
├── components/           # React components
│   ├── Layout/           # Layout components
│   ├── Navbar/           # Navigation components
│   ├── Posts/            # Post-related components
│   └── Community/        # Community features
├── chakra/               # Chakra UI theme configuration
├── firebase/             # Firebase configuration
├── hooks/                # Custom React hooks
└── atoms/                # Recoil state atoms
```

## Architecture Overview

### State Management
- **Recoil** for global state management
- Atomic state pattern with separate atoms for:
  - Posts (`postsAtom`)
  - Communities (`communitiesAtom`) 
  - Directory menu (`DirectoryMenuAtom`)

### Authentication
- Firebase Authentication integrated via `react-firebase-hooks`
- User state managed globally through `useAuthState(auth)`

### Data Layer
- **Firestore** for real-time database
- Collections for posts, communities, votes
- Real-time listeners for live updates

### Styling System
- **Chakra UI** with custom theme
- Dark theme with brand colors (`#ff3c00` primary)
- Custom button variants and global styles
- Responsive design with breakpoints

## Key Features

### Posts System
- Create, read, update, delete posts
- Voting system (upvote/downvote)
- Real-time updates
- Post loading states

### Community Management
- Community creation and joining
- Community-specific posts
- Recommendations system

### User Interface
- Responsive navbar with search
- Directory navigation
- Personal home dashboard
- Post creation interface

## Development Setup

### Prerequisites
- Node.js
- Firebase project setup
- Environment variables configured

### Installation
```bash
npm install
npm run dev
```

### Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Component Architecture

### Layout System
- `Layout.tsx` - Main layout wrapper
- `PageContent.tsx` - Content area layout
- `Navbar.tsx` - Navigation header

### State Hooks
- `usePosts()` - Post management logic
- `useCommunityData()` - Community data handling
- `useDirectory()` - Navigation state

### Firebase Integration
- `clientApp.ts` - Firebase initialization
- SSR-compatible setup with `getApps()` check
- Modular exports for auth, firestore, storage

## Deployment
- Configured for Vercel deployment
- Static asset optimization
- SWC compiler enabled for performance
