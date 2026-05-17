/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {createContext} from 'react';

import {CatalogRegistry} from './CatalogRegistry';

/**
 * Provides the active `CatalogRegistry` to descendants so `CriteriaRow` can
 * look up the input component and operator list for a criterion's `type`.
 */
export const CatalogRegistryContext = createContext<CatalogRegistry | null>(
	null
);

/**
 * Opaque payload propagated from the consumer to every input component. The
 * core does not interpret this value; adapters define the shape they need
 * (e.g. AC passes `{channelId, groupId, timeZoneId, segmentType}`).
 */
export const RowContext = createContext<Record<string, any>>({});

/**
 * Metadata about a criterion that the row needs to render visual decoration
 * (label, color stripe, options) and to look up its supported operators.
 */
export interface FindRowPropertyMeta {
	label?: string;
	options?: ReadonlyArray<{label: string; value: any}>;
	propertyKey?: string;
	type?: string;
	[key: string]: any;
}

export type FindRowProperty = (
	criterion: any
) => FindRowPropertyMeta | undefined;

/**
 * Callback that resolves a criterion to its property metadata. Adapters
 * provide one (AC implements it via `findPropertyByCriterion` against the
 * referenced-objects context). Optional: consumers that bake metadata into
 * the criterion itself can omit it.
 */
export const FindRowPropertyContext = createContext<FindRowProperty | null>(
	null
);
