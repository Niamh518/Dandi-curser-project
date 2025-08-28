'use client'

import { useAuth } from '@/app/contexts/AuthContext'

export default function UserProfile() {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="animate-pulse bg-gray-200 rounded-full h-8 w-8"></div>
        <div className="animate-pulse bg-gray-200 rounded h-4 w-24"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata?.full_name || user.email || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {user.user_metadata?.full_name || user.email}
          </span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </div>
      <button
        onClick={signOut}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        Sign out
      </button>
    </div>
  )
}
