/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ComponentType} from 'react';

import {CriterionTypeDef} from '../types';

/**
 * Indexes a list of `CriterionTypeDef` entries by `type` so `CriteriaRow` can
 * resolve the input component (and optional metadata) for a criterion without
 * importing any specific input implementation.
 */
export class CatalogRegistry {
	private readonly byType: ReadonlyMap<string, CriterionTypeDef>;

	constructor(criterionTypes: ReadonlyArray<CriterionTypeDef>) {
		this.byType = new Map(criterionTypes.map((d) => [d.type, d]));
	}

	getType(type: string | undefined): CriterionTypeDef | undefined {
		return type ? this.byType.get(type) : undefined;
	}

	getInputComponent(
		type: string | undefined
	): ComponentType<any> | undefined {
		return this.getType(type)?.inputComponent;
	}

	getOperators(
		type: string | undefined
	): ReadonlyArray<{key: string; label: string; name: string}> {
		return this.getType(type)?.operators ?? [];
	}

	getDefaultValue(type: string | undefined): unknown {
		return this.getType(type)?.defaultValue;
	}
}
