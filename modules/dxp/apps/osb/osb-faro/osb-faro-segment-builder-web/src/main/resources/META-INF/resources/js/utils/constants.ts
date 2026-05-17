/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export enum Conjunctions {
	And = 'and',
	Or = 'or',
}

export const SUPPORTED_CONJUNCTION_OPTIONS = [
	{
		key: Conjunctions.And,
		label: Liferay.Language.get('and'),
		name: Conjunctions.And,
	},
	{
		key: Conjunctions.Or,
		label: Liferay.Language.get('or'),
		name: Conjunctions.Or,
	},
];
