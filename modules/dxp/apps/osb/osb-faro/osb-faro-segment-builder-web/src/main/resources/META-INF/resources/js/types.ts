/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ComponentType, ElementType, ReactNode} from 'react';

import {Criterion, CriterionGroup} from './utils/types';

/**
 * Defines a kind of criterion the builder can render. Adapters register one
 * `CriterionTypeDef` per `criterion.type` they support, supplying the input
 * component that edits the value plus optional metadata (label, icon,
 * defaultValue, operator list).
 */
export interface CriterionTypeDef<TValue = unknown> {
	defaultValue?: TValue;
	icon?: string;
	inputComponent: ComponentType<any>;
	label?: string;
	operators?: ReadonlyArray<{key: string; label: string; name: string}>;
	type: string;
}

export interface CatalogItem {
	defaultValue?: any;
	entityName?: string;
	icon?: string;
	label: string;
	metadata?: Record<string, unknown>;
	name: string;
	options?: ReadonlyArray<{label: string; value: any}>;
	touched?: boolean | object;
	type: string;
	valid?: boolean | object;
}

export interface CatalogSubgroup {
	items: ReadonlyArray<CatalogItem>;
	label?: string;
}

export interface CatalogSection {
	emptyState?: ReactNode;
	group?: {label: string; order?: number};
	key: string;
	label: string;
	search?: {
		onSearch: (
			keywords: string,
			page: number
		) => Promise<{
			items: ReadonlyArray<CatalogItem>;
			totalCount: number;
		}>;
		pageSize: number;
	};
	subgroups: ReadonlyArray<CatalogSubgroup>;
}

export interface Catalog {
	sections: ReadonlyArray<CatalogSection>;
}

export interface Serializer<TOutput> {
	serialize(criteria: CriterionGroup | null): TOutput;
}

export interface PocInputProps<TValue = unknown> {
	displayValue?: string;
	id?: string;
	onChange: (
		patch:
			| {touched?: any; valid?: any; value?: TValue}
			| Array<{touched?: any; valid?: any; value?: TValue}>
	) => void;
	operatorRenderer: ElementType;
	options?: ReadonlyArray<{label: string; value: any}>;
	touched?: boolean | object;
	valid?: boolean | object;
	value: TValue;
	[key: string]: any;
}

export type {Criterion, CriterionGroup};
