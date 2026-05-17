import {
	ACTIVITY_KEY,
	EVENT_KEY,
	FunctionalOperators,
	PropertyTypes,
	RelationalOperators,
	TimeSpans
} from '../utils/constants';
import {
	Catalog,
	CatalogItem,
	CatalogSection
} from '@liferay/osb-faro-segment-builder-web';
import {createCustomValueMap} from '../utils/custom-inputs';
import {getRemoteCriterionTypeByPropertyKey} from '../criterion-types/registry';
import {
	GROUP_LABELS,
	GROUP_ORDER,
	PROPERTY_KEY_TO_GROUP
} from './sidebarGrouping';
import {jsDatetoYYYYMMDD} from '@liferay/osb-faro-segment-builder-web';
import {List} from 'immutable';
import {Property, PropertyGroup, PropertySubgroup} from 'shared/util/records';
import {SegmentTypes} from 'shared/util/constants';

const REMOTE_PAGE_SIZE = 12;

const TYPE_ICON_MAP: Record<string, string> = {
	[PropertyTypes.Behavior]: 'web-content',
	[PropertyTypes.Boolean]: 'check',
	[PropertyTypes.AccountDate]: 'date',
	[PropertyTypes.AccountNumber]: 'integer',
	[PropertyTypes.AccountText]: 'text',
	[PropertyTypes.Date]: 'date',
	[PropertyTypes.DateTime]: 'date',
	[PropertyTypes.Duration]: 'time',
	[PropertyTypes.Event]: 'ac_event_analysis',
	[PropertyTypes.Number]: 'integer',
	[PropertyTypes.OrganizationBoolean]: 'check',
	[PropertyTypes.OrganizationDate]: 'date',
	[PropertyTypes.OrganizationDateTime]: 'date',
	[PropertyTypes.OrganizationNumber]: 'integer',
	[PropertyTypes.OrganizationSelectText]: 'text',
	[PropertyTypes.OrganizationText]: 'text',
	[PropertyTypes.SessionDateTime]: 'date',
	[PropertyTypes.SessionNumber]: 'integer',
	[PropertyTypes.SessionText]: 'text',
	[PropertyTypes.Vocabulary]: 'text',
	[PropertyTypes.Interest]: 'check',
	[PropertyTypes.Tag]: 'text',
	[PropertyTypes.Text]: 'text'
};

const getDefaultValue = (property: Property): any => {
	const {name, options, type} = property;

	switch (type) {
		case PropertyTypes.Date:
			return jsDatetoYYYYMMDD(new Date());
		case PropertyTypes.DateTime:
			return new Date().toISOString();
		case PropertyTypes.OrganizationDate:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: name,
							value: jsDatetoYYYYMMDD(new Date())
						}
					]
				}
			]);
		case PropertyTypes.SessionDateTime:
		case PropertyTypes.OrganizationDateTime:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: name,
							value: new Date().toISOString()
						}
					]
				}
			]);
		case PropertyTypes.Boolean:
			return 'true';
		case PropertyTypes.Interest:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: 'name',
							value: name
						},
						{
							operatorName: RelationalOperators.EQ,
							propertyName: 'score',
							value: 'true'
						}
					]
				}
			]);
		case PropertyTypes.AccountDate:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: name,
							value: new Date().toISOString()
						}
					]
				}
			]);
		case PropertyTypes.AccountNumber:
		case PropertyTypes.AccountText:
		case PropertyTypes.OrganizationSelectText:
		case PropertyTypes.OrganizationText:
		case PropertyTypes.OrganizationNumber:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: name,
							value: ''
						}
					]
				}
			]);
		case PropertyTypes.Event:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: EVENT_KEY,
							value: name
						},

						{
							operatorName: FunctionalOperators.Contains,
							propertyName: 'attribute/',
							value: ''
						},
						{
							operatorName: RelationalOperators.GT,
							propertyName: 'day',
							value: TimeSpans.Last24Hours
						}
					]
				},
				{key: 'operator', value: RelationalOperators.GE},
				{key: 'value', value: 1}
			]);
		case PropertyTypes.Behavior:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: ACTIVITY_KEY,
							value: ''
						},
						{
							operatorName: RelationalOperators.GT,
							propertyName: 'day',
							value: TimeSpans.Last24Hours
						}
					]
				},
				{key: 'operator', value: RelationalOperators.GE},
				{key: 'value', value: 1}
			]);
		case PropertyTypes.Tag:
		case PropertyTypes.Vocabulary:
			return createCustomValueMap([
				{key: 'operator', value: RelationalOperators.GE},
				{key: 'value', value: 1}
			]);
		case PropertyTypes.OrganizationBoolean:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: name,
							value: 'true'
						}
					]
				}
			]);
		case PropertyTypes.SessionGeolocation:
		case PropertyTypes.SessionNumber:
		case PropertyTypes.SessionText:
			return createCustomValueMap([
				{
					key: 'criterionGroup',
					value: [
						{
							operatorName: RelationalOperators.EQ,
							propertyName: name,
							value: options?.length ? options[0].value : ''
						},
						{
							operatorName: RelationalOperators.GT,
							propertyName: 'completeDate',
							value: TimeSpans.Last24Hours
						}
					]
				}
			]);
		case PropertyTypes.Text:
			if (options && !!options.length) {
				return options![0].value;
			}

			return '';
		default:
			return '';
	}
};

const getDefaultTouched = (type: string): boolean | object => {
	if (type === PropertyTypes.Behavior) {
		return {asset: false, dateFilter: false, occurenceCount: false};
	}

	if (type === PropertyTypes.Event) {
		return {attributeValue: false, occurenceCount: false};
	}

	if (type === PropertyTypes.SessionGeolocation) {
		return {country: false, dateFilter: false};
	}

	if (
		type === PropertyTypes.SessionNumber ||
		type === PropertyTypes.SessionText
	) {
		return {customInput: false, dateFilter: false};
	}

	return false;
};

const getDefaultValid = (type: string): boolean | object => {
	if (type === PropertyTypes.Behavior) {
		return {asset: false, dateFilter: true, occurenceCount: true};
	}

	if (type === PropertyTypes.Event) {
		return {attributeValue: false, occurenceCount: true};
	}

	if (type === PropertyTypes.SessionGeolocation) {
		return {country: false, dateFilter: true};
	}

	if (
		type === PropertyTypes.SessionNumber ||
		type === PropertyTypes.SessionText
	) {
		return {customInput: false, dateFilter: true};
	}

	if (
		[
			PropertyTypes.AccountNumber,
			PropertyTypes.AccountText,
			PropertyTypes.Duration,
			PropertyTypes.Number,
			PropertyTypes.OrganizationNumber,
			PropertyTypes.OrganizationSelectText,
			PropertyTypes.OrganizationText,
			PropertyTypes.SelectText,
			PropertyTypes.Text
		].includes(type as PropertyTypes)
	) {
		return false;
	}

	return true;
};

const propertyToCatalogItem = (property: Property): CatalogItem => ({
	defaultValue: getDefaultValue(property),
	entityName: property.entityName,
	icon: TYPE_ICON_MAP[property.type as string] ?? 'text',
	label: property.label,
	metadata: {colorKey: property.propertyKey, property},
	name: property.name,
	options: property.options as any,
	touched: getDefaultTouched(property.type as string),
	type: property.type as string,
	valid: getDefaultValid(property.type as string)
});

export interface CreateAcCatalogOptions {
	channelId: string;
	groupId: string;
	segmentType: string;
}

export const createAcCatalog = (
	propertyGroupsIList: List<PropertyGroup>,
	options: CreateAcCatalogOptions
): Catalog => {
	const {channelId, groupId, segmentType} = options;

	const sections: CatalogSection[] = (propertyGroupsIList?.toArray() ?? [])
		.filter(Boolean)
		.map(propertyGroup => {
			const propertyKey = propertyGroup.propertyKey;
			const remoteType = getRemoteCriterionTypeByPropertyKey(propertyKey);
			const groupKey = PROPERTY_KEY_TO_GROUP[propertyKey] ?? 'attributes';

			const subgroups = propertyGroup.propertySubgroups
				.toArray()
				.map((subgroup: PropertySubgroup) => ({
					items: (subgroup.properties.toArray() as Property[]).map(
						propertyToCatalogItem
					),
					label: subgroup.label ?? ''
				}));

			const section: CatalogSection = {
				group: {
					label: GROUP_LABELS[groupKey] ?? groupKey,
					order: GROUP_ORDER.indexOf(groupKey)
				},
				key: propertyKey,
				label: propertyGroup.label,
				subgroups
			};

			if (remoteType && segmentType === SegmentTypes.Batch) {
				section.search = {
					onSearch: (keywords, page) =>
						remoteType
							.api({
								channelId,
								groupId,
								keywords,
								page,
								pageSize: REMOTE_PAGE_SIZE
							})
							.then(result => ({
								items: (result.items ?? []).map(entry => {
									const property =
										remoteType.createProperty(entry);

									return propertyToCatalogItem(property);
								}),
								totalCount: result.totalCount ?? 0
							})),
					pageSize: REMOTE_PAGE_SIZE
				};
			}

			return section;
		});

	return {sections};
};

export {propertyToCatalogItem};
