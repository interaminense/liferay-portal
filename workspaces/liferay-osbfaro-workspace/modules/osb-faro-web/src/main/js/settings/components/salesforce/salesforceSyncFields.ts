export type SyncFieldDataType = 'Boolean' | 'Date' | 'Number' | 'String';

export interface ISyncField {
	name: string;
	required: boolean;
	selected: boolean;
	type: SyncFieldDataType;
}

export interface ISyncFieldsTab {
	entity: string;
	fields: ISyncField[];
	gatedOnFirst?: boolean;
	label: string;
}

export interface ISyncFieldsEntity {
	gateDescription?: string;
	modalTitle: string;
	tabs: ISyncFieldsTab[];
}

const toFields = (entries: [string, SyncFieldDataType][]): ISyncField[] =>
	entries.map(([name, type]) => ({
		name,
		required: false,
		selected: false,
		type,
	}));

const ACCOUNT_FIELDS = toFields([
	['Name', 'String'],
	['AccountNumber', 'Number'],
	['Type', 'String'],
	['Industry', 'String'],
	['AnnualRevenue', 'Number'],
	['Website', 'String'],
	['Phone', 'Number'],
	['Fax', 'Number'],
	['Description', 'String'],
	['NumberOfEmployees', 'Number'],
	['Ownership', 'String'],
	['Rating', 'String'],
	['Site', 'String'],
	['TickerSymbol', 'String'],
	['BillingStreet', 'String'],
	['BillingCity', 'String'],
	['BillingState', 'String'],
	['BillingPostalCode', 'String'],
	['BillingCountry', 'String'],
	['ShippingStreet', 'String'],
	['ShippingCity', 'String'],
	['ShippingState', 'String'],
	['ShippingPostalCode', 'String'],
	['ShippingCountry', 'String'],
	['CreatedDate', 'Date'],
	['LastModifiedDate', 'Date'],
]);

const OPPORTUNITY_FIELDS = toFields([
	['Amount', 'Number'],
	['CloseDate', 'Date'],
	['StageName', 'String'],
	['Name', 'String'],
	['Type', 'String'],
	['Probability', 'Number'],
	['LeadSource', 'String'],
	['NextStep', 'String'],
	['ForecastCategoryName', 'String'],
	['ExpectedRevenue', 'Number'],
	['IsClosed', 'Boolean'],
	['IsWon', 'Boolean'],
	['CreatedDate', 'Date'],
	['LastModifiedDate', 'Date'],
]);

const CAMPAIGN_FIELDS = toFields([
	['Name', 'String'],
	['Type', 'String'],
	['Status', 'String'],
	['StartDate', 'Date'],
	['EndDate', 'Date'],
	['BudgetedCost', 'Number'],
	['ActualCost', 'Number'],
	['ExpectedRevenue', 'Number'],
	['NumberOfLeads', 'Number'],
	['NumberOfContacts', 'Number'],
	['NumberSent', 'Number'],
	['IsActive', 'Boolean'],
	['Description', 'String'],
	['CreatedDate', 'Date'],
	['LastModifiedDate', 'Date'],
]);

const CAMPAIGN_MEMBER_FIELDS = toFields([
	['Status', 'String'],
	['HasResponded', 'Boolean'],
	['FirstRespondedDate', 'Date'],
	['Type', 'String'],
	['LeadOrContactId', 'String'],
	['CampaignId', 'String'],
	['Email', 'String'],
	['Phone', 'Number'],
	['City', 'String'],
	['Country', 'String'],
	['CreatedDate', 'Date'],
	['LastModifiedDate', 'Date'],
]);

const CONTACT_FIELDS = toFields([
	['FirstName', 'String'],
	['LastName', 'String'],
	['Email', 'String'],
	['Phone', 'Number'],
	['MobilePhone', 'Number'],
	['Title', 'String'],
	['Department', 'String'],
	['MailingCity', 'String'],
	['MailingCountry', 'String'],
	['Birthdate', 'Date'],
	['LeadSource', 'String'],
	['CreatedDate', 'Date'],
	['LastModifiedDate', 'Date'],
]);

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
				entity: 'Account',
				fields: ACCOUNT_FIELDS,
				label: Liferay.Language.get('account'),
			},
			{
				entity: 'Opportunities',
				fields: OPPORTUNITY_FIELDS,
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
				entity: 'Campaign',
				fields: CAMPAIGN_FIELDS,
				label: Liferay.Language.get('campaign'),
			},
			{
				entity: 'Campaign Member',
				fields: CAMPAIGN_MEMBER_FIELDS,
				gatedOnFirst: true,
				label: Liferay.Language.get('campaign-member'),
			},
		],
	},
	individuals: {
		modalTitle: Liferay.Language.get('sync-individual-attributes'),
		tabs: [
			{
				entity: 'Contact',
				fields: CONTACT_FIELDS,
				label: Liferay.Language.get('contact'),
			},
		],
	},
};
