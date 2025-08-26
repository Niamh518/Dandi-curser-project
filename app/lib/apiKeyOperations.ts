export interface ApiKeyDto {
	id: string;
	name: string;
	key: string;
	createdAt: string;
	lastUsed?: string;
	isActive: boolean;
	type?: string;
	monthlyLimit?: number | null;
}

export async function listApiKeys(): Promise<ApiKeyDto[]> {
	const res = await fetch('/api/keys', { cache: 'no-store' });
	const json = await res.json();
	if (!json.success) throw new Error(json.error || 'Failed to fetch api keys');
	return json.data as ApiKeyDto[];
}

export async function createApiKey(payload: { name: string; type: 'dev' | 'prod'; monthlyLimit?: number | null }): Promise<ApiKeyDto> {
	const res = await fetch('/api/keys', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
	});
	const json = await res.json();
	if (!json.success) throw new Error(json.error || 'Failed to create api key');
	return json.data as ApiKeyDto;
}

export async function updateApiKey(id: string, updates: Partial<ApiKeyDto>): Promise<ApiKeyDto> {
	const res = await fetch('/api/keys', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id, ...updates }),
	});
	const json = await res.json();
	if (!json.success) throw new Error(json.error || 'Failed to update api key');
	return json.data as ApiKeyDto;
}

export async function deleteApiKey(id: string): Promise<ApiKeyDto> {
	const res = await fetch(`/api/keys?id=${id}`, { method: 'DELETE' });
	const json = await res.json();
	if (!json.success) throw new Error(json.error || 'Failed to delete api key');
	return json.data as ApiKeyDto;
}


