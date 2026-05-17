/**
 * Maps analytics-cloud `propertyKey` values to the picker group they live in.
 * This is consumer-specific data, so it stays inside the adapter.
 */
export const PROPERTY_KEY_TO_GROUP: Record<string, string> = {
	account: 'attributes',
	individual: 'attributes',
	interest: 'page-topics',
	organization: 'attributes',
	session: 'attributes',
	tag: 'asset-categorization',
	vocabulary: 'asset-categorization',
	web: 'behavioral'
};

export const GROUP_ORDER = [
	'behavioral',
	'attributes',
	'asset-categorization',
	'page-topics'
];

export const GROUP_LABELS: Record<string, string> = {
	'asset-categorization': Liferay.Language.get('asset-categorization'),
	attributes: Liferay.Language.get('attributes'),
	behavioral: Liferay.Language.get('behavioral'),
	'page-topics': Liferay.Language.get('interests')
};
