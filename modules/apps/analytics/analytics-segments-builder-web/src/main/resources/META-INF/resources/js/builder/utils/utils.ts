/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Conjunctions, SUPPORTED_OPERATORS_MAP} from './constants';
import {
	Criteria,
	Criterion,
	CriterionGroup,
	Operator,
	PropertyType,
} from './types';

let _idCounter = 0;

const nextId = (prefix: string) => `${prefix}${++_idCounter}_${Date.now()}`;

export const generateGroupId = (): string => nextId('group_');

export const generateRowId = (): string => nextId('row_');

export const isCriterionGroup = (
	value: Criteria | undefined | null
): value is CriterionGroup =>
	!!value && (value as CriterionGroup).items !== undefined;

export const wrapInCriteriaGroup = (
	items: Array<Criterion | CriterionGroup>
): CriterionGroup => ({
	conjunctionName: Conjunctions.And,
	criteriaGroupId: generateGroupId(),
	items,
});

export const getSupportedOperatorsFromType = (
	type: PropertyType | undefined
): Operator[] => (type ? SUPPORTED_OPERATORS_MAP[type] || [] : []);
