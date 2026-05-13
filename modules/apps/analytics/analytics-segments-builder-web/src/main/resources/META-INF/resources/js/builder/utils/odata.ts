/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Criteria, Criterion, CriterionGroup} from './types';
import {isCriterionGroup} from './utils';

const escapeSingleQuotes = (text: string): string => text.replace(/'/g, "''");

const formatValue = (criterion: Criterion): string => {
	const {type, value} = criterion;

	if (value === undefined || value === null || value === '') {
		return "''";
	}

	if (type === 'number') {
		return String(value);
	}

	if (type === 'boolean') {
		return String(value);
	}

	if (type === 'date') {
		return `${value}`;
	}

	return `'${escapeSingleQuotes(String(value))}'`;
};

const renderCriterion = (criterion: Criterion): string => {
	const {operatorName, propertyName, value} = criterion;

	if (!propertyName || !operatorName) {
		return '';
	}

	if (value === undefined || value === '') {
		return '';
	}

	if (operatorName === 'contains') {
		return `contains(${propertyName},${formatValue(criterion)})`;
	}

	return `${propertyName} ${operatorName} ${formatValue(criterion)}`;
};

const renderGroup = (group: CriterionGroup): string => {
	const rendered = group.items
		.map((item) =>
			isCriterionGroup(item) ? renderGroup(item) : renderCriterion(item)
		)
		.filter(Boolean);

	if (!rendered.length) {
		return '';
	}

	if (rendered.length === 1) {
		return rendered[0];
	}

	return `(${rendered.join(` ${group.conjunctionName} `)})`;
};

export const buildQueryString = (criteria: Criteria[]): string =>
	criteria
		.map((c) => (isCriterionGroup(c) ? renderGroup(c) : renderCriterion(c)))
		.filter(Boolean)
		.join(' and ');
