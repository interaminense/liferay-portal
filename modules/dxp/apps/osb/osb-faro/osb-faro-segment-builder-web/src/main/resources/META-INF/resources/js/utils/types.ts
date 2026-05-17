/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export type CriterionGroup = {
	conjunctionName: string;
	criteriaGroupId: string;
	items: (CriterionGroup | Criterion)[];
};

export type Criterion = {
	defaultValue?: any;
	operatorName?: string;
	propertyName?: string;
	rowId?: string;
	touched?: boolean | object;
	type?: string;
	valid?: boolean | object;
	value?: any;
};

export type Criteria = Criterion | CriterionGroup;

export type OnCriterionAdd = (index: number, criterion: Criterion) => void;

export type OnMove = (
	startGroupId: string,
	startIndex: number,
	destGroupId: string,
	destIndex: number,
	criterion: Criterion | CriterionGroup,
	replace?: boolean
) => void;

export type Operator = {
	key: string;
	label: string;
	name: string;
};
