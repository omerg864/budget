interface GenerateLinkParams {
	baseUrl?: string;
	route: string[];
	params?: Record<string, string>;
	query?: Record<string, string>;
}

export function generateLink({
	baseUrl = '',
	route,
	params,
	query,
}: GenerateLinkParams): string {
	let path = route.join('');

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			path = path.replace(`:${key}`, value);
		});
	}

	// remove double slashes
	path = path.replace(/([^:]\/)\/+/g, '$1');

	const fullUrl = `${baseUrl}${path}`;
	const finalUrl = fullUrl.endsWith('/') ? fullUrl.slice(0, -1) : fullUrl;

	if (query) {
		const queryString = Object.entries(query)
			.map(([key, value]) => `${key}=${value}`)
			.join('&');
		return `${finalUrl}?${queryString}`;
	}

	return finalUrl;
}
