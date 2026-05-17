/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	CriterionGroup,
	SegmentBuilder,
	Serializer,
	createNewGroup,
} from '@liferay/osb-faro-segment-builder-web';
import React, {useEffect, useState} from 'react';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {MOCK_SEGMENTS} from './mockSegments';
import {primitiveCriterionTypes} from './primitiveCriterionTypes';
import {sessionCatalog} from './sessionCatalog';
import DndProvider from './shared/DndProvider';

/**
 * Reads the saved-segment id from the page URL's `?id=...` query string.
 *
 * Why a query string instead of a route param: when this page lived as a
 * route in osb-faro-web's React Router SPA, the id arrived through
 * `useParams<{id?: string}>()` from `react-router-dom`. The page now renders
 * inside a Liferay portlet on a portal-served URL, where react-router isn't
 * mounted — switching to `URLSearchParams` keeps the same `:id` semantic
 * (open `?id=1` or `?id=2` to hydrate one of the mock segments) without
 * dragging react-router into a portlet that doesn't need routing.
 */
function useRouteId(): string | undefined {
	if (typeof window === 'undefined') {
		return undefined;
	}

	return new URLSearchParams(window.location.search).get('id') ?? undefined;
}

export interface IPocBuilderSharedPageProps {
	outputLabel: string;
	serializer: Serializer<string>;
}

/**
 * Shared shell for the poc-builder demo pages. Two consumers compose this:
 * `PocBuilderJsonDemoPage` (pretty-printed JSON output) and
 * `PocBuilderFilterStringDemoPage` (OData-flavoured filter string output).
 * Each just hands in its `serializer`; everything else — the session catalog,
 * mock-segment hydration on `?id`, live output panel — lives here so both
 * routes stay in sync.
 */
export default function PocBuilderSharedPage({
	outputLabel,
	serializer,
}: IPocBuilderSharedPageProps) {
	const routeId = useRouteId();
	const savedSegment = routeId ? MOCK_SEGMENTS[routeId] : undefined;

	const [criteria, setCriteria] = useState<CriterionGroup | null>(
		() => savedSegment?.criteria ?? createNewGroup([])
	);

	const [serialized, setSerialized] = useState<string>(() =>
		serializer.serialize(savedSegment?.criteria ?? createNewGroup([]))
	);

	useEffect(() => {
		const next = routeId ? MOCK_SEGMENTS[routeId] : undefined;
		const nextCriteria = next?.criteria ?? createNewGroup([]);

		setCriteria(nextCriteria);
		setSerialized(serializer.serialize(nextCriteria));
	}, [routeId, serializer]);

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="poc-builder-demo-root">
				<SegmentBuilder
					catalog={sessionCatalog}
					criterionTypes={primitiveCriterionTypes}
					key={routeId ?? 'new'}
					onChange={(next, output) => {
						setCriteria(next);
						setSerialized(output);
					}}
					serializer={serializer}
					title="Browser Session"
					value={criteria as CriterionGroup}
				/>

				<div className="poc-builder-demo-output">
					<h4>{outputLabel}</h4>

					<pre>{serialized}</pre>
				</div>
			</div>
		</DndProvider>
	);
}
