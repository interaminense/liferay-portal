/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {CriterionGroup, Serializer} from '../types';

/**
 * Default serializer that emits the criterion tree as pretty-printed JSON.
 * Consumers that do not need a domain-specific format (e.g. analytics-cloud's
 * OData filter string) can use this directly.
 */
export const JsonSerializer: Serializer<string> = {
	serialize(criteria: CriterionGroup | null): string {
		return JSON.stringify(criteria, null, 2);
	},
};
