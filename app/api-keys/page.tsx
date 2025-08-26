'use client';

import { useState, useEffect } from 'react';
import Toast from '../components/Toast';
import Navigation from '../components/Navigation';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
  type?: string;
  usage?: number;
  monthlyLimit?: number | null;
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Fetch API keys
  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/keys');
      const result = await response.json();
      if (result.success) {
        // Add type and usage data to match the design
        const enhancedKeys = result.data.map((key: ApiKey) => ({
          ...key,
          type: 'dev',
          usage: 0
        }));
        setApiKeys(enhancedKeys);
      } else {
        showToast('Failed to fetch API keys', 'error');
      }
    } catch (error) {
      showToast('Failed to fetch API keys', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Create API key
  const createApiKey = async (
    payload: { name: string; type: 'dev' | 'prod'; monthlyLimit?: number | null }
  ) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        const newKey = { ...result.data, type: result.data.type ?? 'dev', usage: 0 };
        setApiKeys([...apiKeys, newKey]);
        showToast('API key created successfully', 'success');
        setShowCreateForm(false);
      } else {
        showToast(result.error || 'Failed to create API key', 'error');
      }
    } catch (error) {
      showToast('Failed to create API key', 'error');
    }
  };

  // Update API key
  const updateApiKey = async (id: string, updates: Partial<ApiKey>) => {
    try {
      const response = await fetch('/api/keys', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const result = await response.json();
      if (result.success) {
        setApiKeys(apiKeys.map(key => key.id === id ? { ...result.data, type: key.type, usage: key.usage } : key));
        showToast('API key updated successfully', 'success');
        setEditingKey(null);
      } else {
        showToast(result.error || 'Failed to update API key', 'error');
      }
    } catch (error) {
      showToast('Failed to update API key', 'error');
    }
  };

  // Delete API key
  const deleteApiKey = async (id: string) => {
    try {
      const response = await fetch(`/api/keys?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setApiKeys(apiKeys.filter(key => key.id !== id));
        showToast('API key deleted successfully', 'error');
        setShowDeleteModal(null);
      } else {
        showToast(result.error || 'Failed to delete API key', 'error');
      }
    } catch (error) {
      showToast('Failed to delete API key', 'error');
    }
  };

  // Copy API key to clipboard
  const copyToClipboard = async (key: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(key);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = key;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('API key copied to clipboard', 'success');
    } catch (error) {
      showToast('Failed to copy API key', 'error');
    }
  };

  // Toggle reveal/hide a key value
  const toggleRevealKey = (id: string) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Show toast message
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  // Close toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500 mb-2">Pages / Overview</div>
              <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Operational</span>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Current Plan Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="inline-block bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full mb-4">
                  CURRENT PLAN
                </div>
                <h2 className="text-2xl font-bold mb-4">Researcher</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">API Usage</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Plan</span>
                      <span>0/1,000 Credits</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                      <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Pay as you go</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-10 h-6 bg-white bg-opacity-20 rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Manage Plan</span>
              </button>
            </div>
          </div>
        </div>

        {/* API Keys Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
                <p className="text-sm text-gray-600 mt-1">
                  The key is used to authenticate your requests to the{' '}
                  <a href="#" className="text-blue-600 underline">Research API</a>. 
                  To learn more, see the{' '}
                  <a href="#" className="text-blue-600 underline">documentation page</a>.
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <span>+</span>
                <span>Add API Key</span>
              </button>
            </div>
          </div>

          {/* API Keys Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TYPE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USAGE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KEY
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OPTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {apiKey.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {apiKey.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {apiKey.usage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {revealed[apiKey.id]
                          ? apiKey.key
                          : `${apiKey.key.substring(0, 8)}-${apiKey.key.substring(8, 12)}-*******************`}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleRevealKey(apiKey.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={revealed[apiKey.id] ? 'Hide' : 'Show'}
                          aria-label={revealed[apiKey.id] ? 'Hide API key' : 'Show API key'}
                        >
                          {revealed[apiKey.id] ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.299-3.79M6.343 6.343A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-4.478 5.223M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditingKey(apiKey)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(apiKey.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {apiKeys.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔑</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No API keys yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first API key to get started
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create API Key
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingKey) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-1 text-center">{editingKey ? 'Edit API key' : 'Create a new API key'}</h2>
            {!editingKey && (
              <p className="text-center text-gray-600 mb-6">Enter a name and limit for the new API key.</p>
            )}
            <ApiKeyForm
              apiKey={editingKey}
              onSubmit={async (data) => {
                if (editingKey) {
                  await updateApiKey(editingKey.id, { name: data.name });
                } else {
                  await createApiKey({ name: data.name, type: data.type, monthlyLimit: data.limitMonthly ? data.monthlyLimit ?? null : null });
                }
              }}
              onCancel={() => {
                setShowCreateForm(false);
                setEditingKey(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete API Key</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this API key? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteApiKey(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}

// API Key Form Component
interface ApiKeyFormValues {
  name: string;
  type: 'dev' | 'prod';
  limitMonthly: boolean;
  monthlyLimit?: number | null;
}

interface ApiKeyFormProps {
  apiKey?: ApiKey | null;
  onSubmit: (values: ApiKeyFormValues) => void;
  onCancel: () => void;
}

function ApiKeyForm({ apiKey, onSubmit, onCancel }: ApiKeyFormProps) {
  const [name, setName] = useState(apiKey?.name || '');
  const [type, setType] = useState<'dev' | 'prod'>(apiKey?.type === 'prod' ? 'prod' : 'dev');
  const [limitMonthly, setLimitMonthly] = useState<boolean>(false);
  const [monthlyLimit, setMonthlyLimit] = useState<number | ''>(1000);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        type,
        limitMonthly,
        monthlyLimit: limitMonthly ? (typeof monthlyLimit === 'number' ? monthlyLimit : 0) : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Key Name */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
          Key Name — <span className="text-gray-500">A unique name to identify this key</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Key Name"
          className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-0 focus:border-blue-500"
          required
        />
      </div>

      {/* Key Type */}
      {!apiKey && (
        <div className="mb-4">
          <div className="block text-sm font-medium text-gray-900 mb-2">
            Key Type — <span className="text-gray-500">Choose the environment for this key</span>
          </div>
          <div className="space-y-3">
            <label className={`flex items-center space-x-3 rounded-2xl border p-4 cursor-pointer ${
              type === 'dev' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="keyType"
                value="dev"
                checked={type === 'dev'}
                onChange={() => setType('dev')}
                className="form-radio text-blue-600"
              />
              <div>
                <div className="font-semibold">Development</div>
                <div className="text-gray-500 text-sm">Rate limited to 100 requests/minute</div>
              </div>
            </label>
            <label className={`flex items-center space-x-3 rounded-2xl border p-4 cursor-pointer ${
              type === 'prod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="keyType"
                value="prod"
                checked={type === 'prod'}
                onChange={() => setType('prod')}
                className="form-radio text-blue-600"
              />
              <div>
                <div className="font-semibold">Production</div>
                <div className="text-gray-500 text-sm">Rate limited to 1,000 requests/minute</div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Monthly limit */}
      {!apiKey && (
        <div className="mb-2">
          <label className="flex items-center space-x-3 text-sm text-gray-900">
            <input
              type="checkbox"
              checked={limitMonthly}
              onChange={(e) => setLimitMonthly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Limit monthly usage*</span>
          </label>
          <input
            type="number"
            min={0}
            value={monthlyLimit}
            onChange={(e) => setMonthlyLimit(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="1000"
            disabled={!limitMonthly}
            className={`mt-2 w-full px-4 py-2 rounded-xl border ${
              limitMonthly ? 'border-gray-300' : 'border-gray-200 bg-gray-50 text-gray-400'
            }`}
          />
          <p className="text-xs text-gray-500 mt-2">
            * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
          </p>
        </div>
      )}

      <div className="flex space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (apiKey ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  );
}
