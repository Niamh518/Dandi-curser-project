'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Toast from '../components/Toast';
import Sidebar from '../components/Sidebar';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [formData, setFormData] = useState({ name: '', key: '' });
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // Fetch API keys from the API
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await fetch('/api/keys');
        const result = await response.json();
        
        if (result.success) {
          setApiKeys(result.data);
        } else {
          console.error('Failed to fetch API keys:', result.error);
        }
      } catch (error) {
        console.error('Error fetching API keys:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.name }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setApiKeys([...apiKeys, result.data]);
        setFormData({ name: '', key: '' });
        setShowCreateForm(false);
        showToast('API key created successfully!', 'success');
      } else {
        showToast('Failed to create API key: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      showToast('Failed to create API key', 'error');
    }
  };

  const handleUpdate = async () => {
    if (!editingKey || !formData.name.trim()) return;
    
    try {
      const response = await fetch('/api/keys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: editingKey.id, 
          name: formData.name 
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setApiKeys(apiKeys.map(key => 
          key.id === editingKey.id 
            ? { ...key, name: formData.name }
            : key
        ));
        setEditingKey(null);
        setFormData({ name: '', key: '' });
        showToast('API key updated successfully!', 'success');
      } else {
        showToast('Failed to update API key: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error updating API key:', error);
      showToast('Failed to update API key', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        const response = await fetch(`/api/keys?id=${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          setApiKeys(apiKeys.filter(key => key.id !== id));
          showToast('API key deleted successfully!', 'success');
        } else {
          showToast('Failed to delete API key: ' + result.error, 'error');
        }
      } catch (error) {
        console.error('Error deleting API key:', error);
        showToast('Failed to delete API key', 'error');
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    const key = apiKeys.find(k => k.id === id);
    if (!key) return;
    
    try {
      const response = await fetch('/api/keys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: id, 
          isActive: !key.isActive 
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setApiKeys(apiKeys.map(key => 
          key.id === id 
            ? { ...key, isActive: !key.isActive }
            : key
        ));
        showToast(`API key ${!key.isActive ? 'activated' : 'deactivated'} successfully!`, 'success');
      } else {
        showToast('Failed to update API key: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error updating API key:', error);
      showToast('Failed to update API key', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast({
      message: 'API key copied to clipboard!',
      type: 'success',
      isVisible: true,
    });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      {/* Header */}
      <div className="bg-white shadow-sm border-b flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Key Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your API keys for secure access to our services
              </p>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              {sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
            </button>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New API Key */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {showCreateForm ? 'Cancel' : '+ Create New API Key'}
              </button>
            </div>

            {showCreateForm && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      API Key Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., Production API Key"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleCreate}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Create API Key
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* API Keys List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {apiKeys.map((apiKey) => (
              <li key={apiKey.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {editingKey?.id === apiKey.id ? (
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          ) : (
                            apiKey.name
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                          {apiKey.lastUsed && (
                            <span className="ml-4">
                              Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          apiKey.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                          {apiKey.key}
                        </code>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center space-x-2">
                    {editingKey?.id === apiKey.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingKey(null);
                            setFormData({ name: '', key: '' });
                          }}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingKey(apiKey);
                            setFormData({ name: apiKey.name, key: apiKey.key });
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleActive(apiKey.id)}
                          className={`text-sm font-medium ${
                            apiKey.isActive 
                              ? 'text-yellow-600 hover:text-yellow-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {apiKey.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(apiKey.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {apiKeys.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No API keys found. Create your first API key to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
