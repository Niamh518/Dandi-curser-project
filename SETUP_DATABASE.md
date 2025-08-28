# Database Setup Guide

This guide will help you set up the database schema to automatically create user profiles when users sign in for the first time.

## 🗄️ Database Schema Setup

### Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Schema

1. Click **New Query**
2. Copy and paste the entire contents of `database/schema.sql`
3. Click **Run** to execute the SQL

### Step 3: Verify the Setup

After running the schema, you should see:

1. **Table Created**: `user_profiles` table
2. **Triggers Created**: 
   - `on_auth_user_created` - Creates profile when user signs up
   - `on_auth_user_updated` - Updates profile when user data changes
3. **Policies Created**: Row Level Security policies for the `user_profiles` table

## 🔍 How It Works

### Automatic User Profile Creation

When a user signs in for the first time:

1. **Google OAuth** authenticates the user
2. **Supabase Auth** creates a user record in `auth.users`
3. **Database Trigger** automatically creates a profile in `user_profiles`
4. **User data** (email, name, avatar) is extracted from Google profile

### Fallback Mechanism

If the database trigger doesn't work, the application has a fallback:

1. **AuthContext** checks if user profile exists
2. **API Call** to `/api/auth/user-profile` endpoint
3. **Manual Creation** if profile doesn't exist

## 📊 Database Schema Details

### User Profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security

- Users can only view their own profile
- Users can only update their own profile
- Users can only delete their own profile

### Triggers

- **`handle_new_user()`**: Creates profile on user signup
- **`handle_user_update()`**: Updates profile when user data changes

## 🧪 Testing the Setup

1. **Sign in** with a new Google account
2. **Check Dashboard** - you should see "✅ Profile found in database!"
3. **Verify Data** - user information should be displayed
4. **Check Supabase** - go to Table Editor → `user_profiles` to see the record

## 🔧 Troubleshooting

### If profiles aren't being created automatically:

1. **Check Triggers**: Go to Database → Functions to verify triggers exist
2. **Check Policies**: Go to Authentication → Policies to verify RLS policies
3. **Manual Creation**: Use the "Create Profile" button in the dashboard
4. **Check Logs**: Look at browser console for error messages

### Common Issues:

- **"Provider not enabled"**: Enable Google OAuth in Supabase Auth settings
- **"Profile not found"**: Run the database schema or use manual creation
- **"Permission denied"**: Check Row Level Security policies

## 📝 Next Steps

After setting up the database:

1. **Test Authentication**: Sign in with Google
2. **Verify Profile Creation**: Check the dashboard
3. **Customize Profile**: Add additional fields as needed
4. **Monitor Usage**: Check Supabase logs for any issues

## 🚀 Production Considerations

- **Backup**: Regularly backup your database
- **Monitoring**: Set up alerts for authentication failures
- **Scaling**: Consider database performance as user base grows
- **Security**: Regularly review RLS policies and permissions
