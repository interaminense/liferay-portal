/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {ReactNode, useMemo} from 'react';

import {CatalogRegistry} from '../registry/CatalogRegistry';
import {
	CatalogRegistryContext,
	FindRowProperty,
	FindRowPropertyContext,
	FindRowPropertyMeta,
	RowContext,
} from '../registry/context';
import {Catalog, CatalogItem, CriterionTypeDef, Serializer} from '../types';
import {Criteria, CriterionGroup} from '../utils/types';
import CriteriaBuilder from './CriteriaBuilder';
import CriteriaSidebar from './CriteriaSidebar';

/**
 * Default property-metadata resolver derived from the catalog: indexes every
 * `CatalogItem` by `name` so a criterion that was dropped from the sidebar
 * keeps its label, options, type, and color when the row re-renders. AC
 * overrides this by passing its own `findProperty` that also resolves
 * criteria parsed from a saved filter string.
 */
const buildCatalogFindProperty = (catalog: Catalog): FindRowProperty => {
	const byName = new Map<string, CatalogItem>();

	catalog.sections.forEach((section) => {
		section.subgroups.forEach((subgroup) => {
			subgroup.items.forEach((item) => {
				byName.set(item.name, item);
			});
		});
	});

	return (criterion: any): FindRowPropertyMeta | undefined => {
		if (!criterion?.propertyName) {
			return undefined;
		}

		const item = byName.get(criterion.propertyName);

		if (!item) {
			return undefined;
		}

		return {
			label: item.label,
			options: item.options as any,
			propertyKey: item.metadata?.colorKey as string | undefined,
			type: item.type,
		};
	};
};

interface ISegmentBuilderProps<TOutput = unknown> {
	catalog: Catalog;
	channelId?: string;

	/**
	 * Optional content rendered in the main column above the criteria canvas.
	 * Consumers like analytics-cloud use this slot to host adjacent form
	 * fields (external reference code, alerts, etc.) without breaking the
	 * sidebar/canvas layout.
	 */
	children?: ReactNode;
	criterionTypes: ReadonlyArray<CriterionTypeDef>;
	findProperty?: FindRowProperty | null;
	groupId?: string;
	id?: string;
	onChange: (next: CriterionGroup | null, serialized: TOutput) => void;
	onPropertyDrop?: (item: {criterion: any; property?: any}) => void;
	rowContext?: Record<string, any>;
	segmentType?: any;
	sequential?: boolean;
	serializer: Serializer<TOutput>;
	title?: string;
	value: CriterionGroup;
}

/**
 * Public entry point for the segment builder. Hosts the drag-and-drop
 * provider, builds the `CatalogRegistry` from the supplied criterion-type
 * definitions, exposes the consumer-supplied `rowContext` and `findProperty`
 * through React context, and lays out the sidebar and canvas. `onChange`
 * receives both the new criterion tree and the result of `serializer`, so
 * consumers can keep both in their own state.
 */
function SegmentBuilder<TOutput = unknown>({
	catalog,
	channelId = '',
	children,
	criterionTypes,
	findProperty = null,
	groupId = '',
	id,
	onChange,
	onPropertyDrop,
	rowContext,
	segmentType,
	sequential = false,
	serializer,
	title,
	value,
}: ISegmentBuilderProps<TOutput>) {
	const registry = useMemo(
		() => new CatalogRegistry(criterionTypes),
		[criterionTypes]
	);

	const resolvedRowContext = useMemo(
		() => rowContext ?? {channelId, groupId, segmentType},
		[rowContext, channelId, groupId, segmentType]
	);

	const resolvedFindProperty = useMemo(
		() => findProperty ?? buildCatalogFindProperty(catalog),
		[findProperty, catalog]
	);

	const handleChange = (next: Criteria) => {
		const nextGroup = (next ?? null) as CriterionGroup | null;

		onChange(nextGroup, serializer.serialize(nextGroup));
	};

	return (
		<CatalogRegistryContext.Provider value={registry}>
			<RowContext.Provider value={resolvedRowContext}>
				<FindRowPropertyContext.Provider value={resolvedFindProperty}>
					<div className="ac-segment-builder-web form-body">
						<div className="ac-segment-builder-web__sidebar-section">
							<CriteriaSidebar catalog={catalog} title={title} />
						</div>

						<div className="ac-segment-builder-web__main-section">
							{children}

							<CriteriaBuilder
								channelId={channelId}
								criteria={value}
								groupId={groupId}
								id={id}
								onChange={handleChange}
								onPropertyDrop={onPropertyDrop}
								segmentType={segmentType}
								sequential={sequential}
							/>
						</div>
					</div>
				</FindRowPropertyContext.Provider>
			</RowContext.Provider>
		</CatalogRegistryContext.Provider>
	);
}

export default SegmentBuilder;
