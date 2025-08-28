'use client'

import { useAuth } from '@/app/contexts/AuthContext'
import { useState, useEffect } from 'react'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export default function UserProfileInfo() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/user-profile')
      
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        console.log('User profile loaded:', data.profile)
      } else if (response.status === 404) {
        setError('User profile not found in database')
        console.log('User profile not found - this might be a new user')
      } else {
        setError('Failed to load user profile')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setError('Error loading user profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        User Profile Information
      </h3>
      
      {/* Auth User Info */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Authentication Data:</h4>
        <div className="bg-gray-50 rounded p-3 text-sm">
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.user_metadata?.full_name || 'Not provided'}</p>
          <p><strong>Avatar:</strong> {user.user_metadata?.avatar_url ? 'Available' : 'Not provided'}</p>
          <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
        </div>
      </div>

      {/* Database Profile Info */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Database Profile:</h4>
        
        {loading && (
          <div className="bg-blue-50 rounded p-3 text-sm">
            <p className="text-blue-700">Loading profile from database...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 rounded p-3 text-sm">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchUserProfile}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}
        
        {profile && (
          <div className="bg-green-50 rounded p-3 text-sm">
            <p className="text-green-700 font-medium">✅ Profile found in database!</p>
            <p><strong>Database ID:</strong> {profile.id}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Full Name:</strong> {profile.full_name || 'Not set'}</p>
            <p><strong>Avatar URL:</strong> {profile.avatar_url ? 'Available' : 'Not set'}</p>
            <p><strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(profile.updated_at).toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={fetchUserProfile}
          disabled={loading}
          className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Profile'}
        </button>
        
        {!profile && !loading && (
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/auth/user-profile', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                })
                if (response.ok) {
                  await fetchUserProfile()
                }
              } catch (error) {
                console.error('Error creating profile:', error)
              }
            }}
            className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            Create Profile
          </button>
        )}
      </div>
    </div>
  )
}
