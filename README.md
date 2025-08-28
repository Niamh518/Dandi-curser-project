# Dandi - Google SSO with Supabase

A Next.js application with Google Single Sign-On (SSO) authentication and user profile management using Supabase.

## Features

- 🔐 Google OAuth authentication
- 👤 User profile management
- 🛡️ Protected routes with middleware
- 📱 Responsive design
- 🔑 API key management
- 🎯 Dashboard with user information

## Prerequisites

- Node.js 18+ 
- Supabase account
- Google Cloud Console account

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to **Authentication** > **Providers**
4. Enable **Google** provider
5. Add your Google OAuth credentials (see Google Cloud Console setup below)
6. Set the redirect URL to: `https://your-project-ref.supabase.co/auth/v1/callback`

### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Configure the OAuth consent screen
6. Set the authorized redirect URIs to include your Supabase auth callback URL
7. Copy the Client ID and Client Secret

### 4. Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the SQL commands from `database/schema.sql` to create the user profiles table and triggers

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3005](http://localhost:3005) to view the application.

## Project Structure

```
dandi/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── user-profile/     # User profile API routes
│   │   └── auth/
│   │       └── callback/         # OAuth callback handler
│   ├── auth/
│   │   └── auth-code-error/      # Auth error page
│   ├── components/
│   │   ├── LoginButton.tsx       # Google sign-in button
│   │   └── UserProfile.tsx       # User profile display
│   ├── contexts/
│   │   └── AuthContext.tsx       # Authentication context
│   ├── dashboard/                # Protected dashboard page
│   └── page.tsx                  # Home page with auth
├── lib/
│   ├── supabaseClient.ts         # Client-side Supabase client
│   ├── supabaseServer.ts         # Server-side Supabase client
│   └── userOperations.ts         # User profile operations
├── middleware.ts                 # Authentication middleware
└── database/
    └── schema.sql               # Database schema
```

## Authentication Flow

1. User clicks "Sign in with Google" button
2. User is redirected to Google OAuth consent screen
3. After authorization, Google redirects to Supabase auth callback
4. Supabase creates/updates user record and session
5. User is redirected back to the application
6. Application checks for user session and displays appropriate content

## User Profile Management

The application automatically creates a user profile when a user signs up through Google OAuth. The profile includes:

- User ID (from Supabase auth)
- Email address
- Full name (from Google profile)
- Avatar URL (from Google profile)
- Created and updated timestamps

## Protected Routes

The following routes require authentication:
- `/dashboard` - User dashboard
- `/api/auth/user-profile` - User profile API

Users are automatically redirected to the home page if they try to access protected routes without authentication.

## API Endpoints

- `GET /api/auth/user-profile` - Get current user's profile
- `POST /api/auth/user-profile` - Create user profile
- `PUT /api/auth/user-profile` - Update user profile

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
