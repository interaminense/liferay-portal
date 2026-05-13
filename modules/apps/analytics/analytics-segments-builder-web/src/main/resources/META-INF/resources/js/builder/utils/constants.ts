/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Operator, PropertyType} from './types';

export const Conjunctions = {
	And: 'and',
	Or: 'or',
} as const;

export const RelationalOperators = {
	Contains: 'contains',
	EQ: 'eq',
	GT: 'gt',
	LT: 'lt',
	NE: 'ne',
} as const;

export const SUPPORTED_CONJUNCTION_OPTIONS: Operator[] = [
	{label: Liferay.Language.get('and'), name: Conjunctions.And},
	{label: Liferay.Language.get('or'), name: Conjunctions.Or},
];

export const SUPPORTED_OPERATORS_MAP: Record<PropertyType, Operator[]> = {
	boolean: [{label: Liferay.Language.get('is'), name: RelationalOperators.EQ}],
	date: [
		{
			label: Liferay.Language.get('is'),
			name: RelationalOperators.EQ,
		},
		{
			label: Liferay.Language.get('is-before'),
			name: RelationalOperators.LT,
		},
		{
			label: Liferay.Language.get('is-after'),
			name: RelationalOperators.GT,
		},
	],
	number: [
		{
			label: Liferay.Language.get('is-equal-to'),
			name: RelationalOperators.EQ,
		},
		{
			label: Liferay.Language.get('greater-than'),
			name: RelationalOperators.GT,
		},
		{
			label: Liferay.Language.get('less-than'),
			name: RelationalOperators.LT,
		},
		{
			label: Liferay.Language.get('is-not-equal-to'),
			name: RelationalOperators.NE,
		},
	],
	text: [
		{label: Liferay.Language.get('is'), name: RelationalOperators.EQ},
		{
			label: Liferay.Language.get('is-not'),
			name: RelationalOperators.NE,
		},
		{
			label: Liferay.Language.get('contains'),
			name: RelationalOperators.Contains,
		},
	],
};

export const DEFAULT_OPERATOR_FOR_TYPE: Record<PropertyType, string> = {
	boolean: RelationalOperators.EQ,
	date: RelationalOperators.EQ,
	number: RelationalOperators.EQ,
	text: RelationalOperators.EQ,
};

export const DEFAULT_VALUE_FOR_TYPE: Record<PropertyType, string | number | boolean> = {
	boolean: true,
	date: '',
	number: 0,
	text: '',
};
