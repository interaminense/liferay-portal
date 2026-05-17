import {
	Criterion,
	CriterionGroup,
	Serializer
} from '@liferay/osb-faro-segment-builder-web';

/**
 * OData-flavoured filter-string serializer for the poc-builder demo.
 * Walks the criterion tree and emits a single expression like
 *
 *   (device.type eq 'mobile' and session.pageViews gt 3)
 *
 * Operators are kept short and OData-compatible: `eq`, `ne`, `gt`, `lt`
 * become infix; `contains` becomes the function form `contains(prop,
 * 'value')`. Strings are single-quoted with embedded quotes doubled,
 * numbers and booleans are emitted bare, dates are quoted strings.
 */

const isCriterionGroup = (
	criterion: Criterion | CriterionGroup
): criterion is CriterionGroup =>
	!!criterion && Array.isArray((criterion as CriterionGroup).items);

const escapeQuotes = (value: string): string => value.replace(/'/g, "''");

const formatValue = (value: unknown): string => {
	if (value === null || value === undefined) {
		return 'null';
	}

	if (typeof value === 'number') {
		return String(value);
	}

	if (typeof value === 'boolean') {
		return value ? 'true' : 'false';
	}

	const raw = String(value);

	if (raw === 'true' || raw === 'false') {
		return raw;
	}

	if (raw !== '' && !Number.isNaN(Number(raw))) {
		return raw;
	}

	return `'${escapeQuotes(raw)}'`;
};

const renderCriterion = (criterion: Criterion): string => {
	const {operatorName, propertyName, value} = criterion;

	if (!propertyName || !operatorName) {
		return '';
	}

	if (operatorName === 'contains') {
		return `contains(${propertyName}, ${formatValue(value)})`;
	}

	return `${propertyName} ${operatorName} ${formatValue(value)}`;
};

const renderGroup = (group: CriterionGroup): string => {
	if (!group?.items?.length) {
		return '';
	}

	const parts = group.items
		.map(item =>
			isCriterionGroup(item) ? renderGroup(item) : renderCriterion(item)
		)
		.filter(Boolean);

	if (parts.length === 0) {
		return '';
	}

	if (parts.length === 1) {
		return parts[0];
	}

	return `(${parts.join(` ${group.conjunctionName} `)})`;
};

export const FilterStringSerializer: Serializer<string> = {
	serialize(criteria: CriterionGroup | null): string {
		if (!criteria) {
			return '';
		}

		return isCriterionGroup(criteria)
			? renderGroup(criteria)
			: renderCriterion(criteria);
	}
};
