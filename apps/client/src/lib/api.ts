export type HealthResponse = {
	status: 'ok';
	service: string;
	timestamp: string;
};

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
	const response = await fetch('/api/health', { signal });
	if (!response.ok) {
		throw new Error(`API request failed with ${response.status}`);
	}
	return (await response.json()) as HealthResponse;
}
