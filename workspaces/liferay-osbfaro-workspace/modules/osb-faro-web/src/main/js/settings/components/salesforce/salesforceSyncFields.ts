export interface ISyncField {
	name: string;
	required: boolean;
	selected: boolean;
	type: string;
}

export interface ISyncFieldsTab {
	catalogKey: string;
	entity: string;
	gatedOnFirst?: boolean;
	label: string;
}

export interface ISyncFieldsEntity {
	gateDescription?: string;
	modalTitle: string;
	tabs: ISyncFieldsTab[];
}

export const SYNC_FIELDS_ENTITIES: Record<string, ISyncFieldsEntity> = {
	accountsAndOpportunities: {
		gateDescription: Liferay.Language.get(
			'to-select-opportunity-fields-first-select-at-least-one-account-attribute'
		),
		modalTitle: Liferay.Language.get(
			'sync-account-and-opportunity-attributes'
		),
		tabs: [
			{
				catalogKey: 'ACCOUNT',
				entity: 'Account',
				label: Liferay.Language.get('account'),
			},
			{
				catalogKey: 'OPPORTUNITY',
				entity: 'Opportunities',
				gatedOnFirst: true,
				label: Liferay.Language.get('opportunities'),
			},
		],
	},
	campaignsAndCampaignMembers: {
		gateDescription: Liferay.Language.get(
			'to-select-campaign-member-fields-first-select-at-least-one-campaign-attribute'
		),
		modalTitle: Liferay.Language.get(
			'sync-campaign-and-campaign-member-attributes'
		),
		tabs: [
			{
				catalogKey: 'CAMPAIGN',
				entity: 'Campaign',
				label: Liferay.Language.get('campaign'),
			},
			{
				catalogKey: 'CAMPAIGN_MEMBER',
				entity: 'Campaign Member',
				gatedOnFirst: true,
				label: Liferay.Language.get('campaign-member'),
			},
		],
	},
	individuals: {
		modalTitle: Liferay.Language.get('sync-individual-attributes'),
		tabs: [
			{
				catalogKey: 'CONTACT',
				entity: 'Contact',
				label: Liferay.Language.get('contact'),
			},
		],
	},
};
