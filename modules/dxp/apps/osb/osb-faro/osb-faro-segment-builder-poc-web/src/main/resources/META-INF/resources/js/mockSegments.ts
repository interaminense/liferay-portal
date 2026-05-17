import {CriterionGroup} from '@liferay/osb-faro-segment-builder-web';

export interface MockSegment {
	criteria: CriterionGroup;
	name: string;
}

/**
 * Hardcoded "saved segments" the poc-builder demo pages load when the user
 * navigates with `?id=1` or `?id=2`. Each entry pairs a criterion tree
 * built against the session catalog with a human-readable name shown in the
 * page header.
 */
export const MOCK_SEGMENTS: Record<string, MockSegment> = {
	1: {
		criteria: {
			conjunctionName: 'and',
			criteriaGroupId: 'group_mock_1_root',
			items: [
				{
					operatorName: 'eq',
					propertyName: 'device.type',
					rowId: 'row_mock_1_device',
					touched: false,
					type: 'select',
					valid: true,
					value: 'mobile',
				},
				{
					operatorName: 'gt',
					propertyName: 'session.pageViews',
					rowId: 'row_mock_1_pageviews',
					touched: false,
					type: 'number',
					valid: true,
					value: 3,
				},
				{
					operatorName: 'eq',
					propertyName: 'session.returning',
					rowId: 'row_mock_1_returning',
					touched: false,
					type: 'boolean',
					valid: true,
					value: 'true',
				},
			],
		},
		name: 'Engaged mobile returners',
	},
	2: {
		criteria: {
			conjunctionName: 'or',
			criteriaGroupId: 'group_mock_2_root',
			items: [
				{
					conjunctionName: 'and',
					criteriaGroupId: 'group_mock_2_paid',
					items: [
						{
							operatorName: 'eq',
							propertyName: 'navigation.trafficSource',
							rowId: 'row_mock_2_paid_source',
							touched: false,
							type: 'select',
							valid: true,
							value: 'paid',
						},
						{
							operatorName: 'eq',
							propertyName: 'navigation.utmCampaign',
							rowId: 'row_mock_2_paid_campaign',
							touched: false,
							type: 'text',
							valid: true,
							value: 'black-friday-2026',
						},
					],
				},
				{
					operatorName: 'eq',
					propertyName: 'time.holiday',
					rowId: 'row_mock_2_holiday',
					touched: false,
					type: 'select',
					valid: true,
					value: 'black-friday',
				},
			],
		},
		name: 'Black Friday campaign traffic',
	},
};
