'use client';

import { ApiKeyDto } from '@/app/lib/apiKeyOperations';

interface Props {
  items: ApiKeyDto[];
  onReveal: (id: string) => void;
  revealed: Record<string, boolean>;
  onCopy: (key: string) => void;
  onEdit: (key: ApiKeyDto) => void;
  onDeleteAsk: (id: string) => void;
}

export default function ApiKeysTable({ items, onReveal, revealed, onCopy, onEdit, onDeleteAsk }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USAGE</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KEY</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPTIONS</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((apiKey) => (
            <tr key={apiKey.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{0}</td>
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
                    onClick={() => onReveal(apiKey.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title={revealed[apiKey.id] ? 'Hide' : 'Show'}
                    aria-label="Toggle reveal"
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
                    onClick={() => onCopy(apiKey.key)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copy"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button onClick={() => onEdit(apiKey)} className="text-gray-400 hover:text-gray-600" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => onDeleteAsk(apiKey.id)} className="text-gray-400 hover:text-red-600" title="Delete">
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
  );
}


