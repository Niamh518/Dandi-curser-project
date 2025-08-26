'use client';

import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (values: { name: string; type: 'dev' | 'prod'; monthlyLimit?: number | null }) => Promise<void> | void;
}

export default function CreateApiKeyModal({ isOpen, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'dev' | 'prod'>('dev');
  const [limitMonthly, setLimitMonthly] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState<number | ''>(1000);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onCreate({ name: name.trim(), type, monthlyLimit: limitMonthly ? (typeof monthlyLimit === 'number' ? monthlyLimit : 0) : null });
      setName('');
      setType('dev');
      setLimitMonthly(false);
      setMonthlyLimit(1000);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-2">Create a new API key</h2>
        <p className="text-gray-600 mb-6">Enter a name and limit for the new API key.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="key-name" className="block text-sm font-medium text-gray-900 mb-1">
              Key Name — <span className="text-gray-500">A unique name to identify this key</span>
            </label>
            <input id="key-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Key Name" className="w-full px-4 py-2 border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500" />
          </div>

          <div className="mb-4">
            <div className="block text-sm font-medium text-gray-900 mb-2">Key Type — <span className="text-gray-500">Choose the environment</span></div>
            <div className="space-y-3">
              <label className={`flex items-center space-x-3 rounded-2xl border p-4 cursor-pointer ${type === 'dev' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="keyType" value="dev" checked={type === 'dev'} onChange={() => setType('dev')} className="form-radio text-blue-600" />
                <div>
                  <div className="font-semibold">Development</div>
                  <div className="text-gray-500 text-sm">Rate limited to 100 requests/minute</div>
                </div>
              </label>
              <label className={`flex items-center space-x-3 rounded-2xl border p-4 cursor-pointer ${type === 'prod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="keyType" value="prod" checked={type === 'prod'} onChange={() => setType('prod')} className="form-radio text-blue-600" />
                <div>
                  <div className="font-semibold">Production</div>
                  <div className="text-gray-500 text-sm">Rate limited to 1,000 requests/minute</div>
                </div>
              </label>
            </div>
          </div>

          <div className="mb-2">
            <label className="flex items-center space-x-3 text-sm text-gray-900">
              <input type="checkbox" checked={limitMonthly} onChange={(e) => setLimitMonthly(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span>Limit monthly usage*</span>
            </label>
            <input type="number" min={0} value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1000" disabled={!limitMonthly} className={`mt-2 w-full px-4 py-2 rounded-xl border ${limitMonthly ? 'border-gray-300' : 'border-gray-200 bg-gray-50 text-gray-400'}`} />
            <p className="text-xs text-gray-500 mt-2">* If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading || !name.trim()} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


