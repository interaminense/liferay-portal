import {ISyncField} from './salesforceSyncFields';

export const MOCK_ENDPOINT_BASE = '/o/faro/mock/salesforce-sync-fields';

export const getMockEndpoint = (entityKey: string, tabType: string) =>
	`${MOCK_ENDPOINT_BASE}/${entityKey}/${encodeURIComponent(tabType)}`;

interface IMockHandler {
	endpoint: string;
	fields: ISyncField[];
}

const applyDataTypeFilter = (fields: ISyncField[], filter: string) => {
	const match = filter.match(/type (?:eq|in) \(?([^)]*)\)?/);

	if (!match) {
		return fields;
	}

	const values = match[1]
		.split(',')
		.map((value) => value.replace(/'/g, '').trim());

	return fields.filter((field) => values.includes(field.type));
};

const buildMockResponse = (url: URL, fields: ISyncField[]) => {
	let items = [...fields];

	const search = url.searchParams.get('search');

	if (search) {
		items = items.filter((field) =>
			field.name.toLowerCase().includes(search.toLowerCase())
		);
	}

	const filter = url.searchParams.get('filter');

	if (filter) {
		items = applyDataTypeFilter(items, filter);
	}

	const sort = url.searchParams.get('sort');

	if (sort) {
		const [key, direction] = sort.split(':');
		const field = (key || 'name') as keyof ISyncField;

		items.sort((a, b) => {
			const comparison = String(a[field]).localeCompare(String(b[field]));

			return direction === 'desc' ? -comparison : comparison;
		});
	}

	const page = Number(url.searchParams.get('page')) || 1;
	const pageSize = Number(url.searchParams.get('pageSize')) || 20;
	const totalCount = items.length;
	const start = (page - 1) * pageSize;

	return {
		items: items.slice(start, start + pageSize),
		lastPage: Math.ceil(totalCount / pageSize) || 1,
		page,
		pageSize,
		totalCount,
	};
};

export const installSyncFieldsMockFetch = (handlers: IMockHandler[]) => {
	const originalFetch = window.fetch;

	window.fetch = ((
		resource: Parameters<typeof window.fetch>[0],
		init?: Parameters<typeof window.fetch>[1]
	) => {
		const urlString =
			typeof resource === 'string'
				? resource
				: resource instanceof URL
					? resource.toString()
					: resource.url;

		const handler = handlers.find(({endpoint}) =>
			urlString.includes(endpoint)
		);

		if (handler) {
			const body = buildMockResponse(
				new URL(urlString, window.location.origin),
				handler.fields
			);

			return Promise.resolve(
				new Response(JSON.stringify(body), {
					headers: {'Content-Type': 'application/json'},
					status: 200,
				})
			);
		}

		return originalFetch(resource, init);
	}) as typeof window.fetch;

	return () => {
		window.fetch = originalFetch;
	};
};
