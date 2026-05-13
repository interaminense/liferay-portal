/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export type Property = {
	defaultValue?: string | number | boolean;
	label: string;
	name: string;
	type: PropertyType;
};

export type PropertyGroup = {
	label: string;
	properties: Property[];
	propertyKey: string;
};

export type Operator = {
	label: string;
	name: string;
};

export type PropertyType = 'boolean' | 'date' | 'number' | 'text';

export type Criterion = {
	defaultValue?: string | number | boolean;
	operatorName?: string;
	propertyLabel?: string;
	propertyName?: string;
	rowId: string;
	type?: PropertyType;
	value?: string | number | boolean;
};

export type CriterionGroup = {
	conjunctionName: 'and' | 'or';
	criteriaGroupId: string;
	items: Array<Criterion | CriterionGroup>;
};

export type Criteria = Criterion | CriterionGroup;
