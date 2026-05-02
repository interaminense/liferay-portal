/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import React, {useMemo} from 'react';

import {PagePathNode} from '../../lib/analytics';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {Sankey, SankeyData} from '../charts/Sankey';

export interface PagePathCardContentIProps {
	pagePath: PagePathNode | null;
}

const truncate = (raw: string | null | undefined, max = 32) => {
	if (!raw) {
		return '—';
	}

	return raw.length > max ? `${raw.slice(0, max - 1)}…` : raw;
};

const nodeName = (node: PagePathNode | null | undefined) =>
	truncate(node?.title ?? node?.canonicalUrl ?? '—');

export const PagePathCardContent: React.FC<PagePathCardContentIProps> = ({
	pagePath,
}) => {
	const sankeyData = useMemo<SankeyData | null>(() => {
		if (!pagePath) {
			return null;
		}

		const previous = pagePath.previousPagePathNodes ?? [];
		const following = pagePath.followingPagePathNodes ?? [];

		if (previous.length === 0 && following.length === 0) {
			return null;
		}

		const nodes: SankeyData['nodes'] = [];
		const links: SankeyData['links'] = [];

		previous.forEach((node) => {
			nodes.push({
				canonicalUrl: node.canonicalUrl,
				external: node.external,
				name: nodeName(node),
			});
		});

		const currentIndex = nodes.length;

		nodes.push({
			canonicalUrl: pagePath.canonicalUrl,
			name: nodeName(pagePath),
		});

		following.forEach((node) => {
			nodes.push({
				canonicalUrl: node.canonicalUrl,
				external: node.external,
				name: nodeName(node),
			});
		});

		previous.forEach((node, index) => {
			links.push({
				source: index,
				target: currentIndex,
				value: Math.max(node.views ?? 0, 1),
			});
		});

		following.forEach((node, index) => {
			links.push({
				source: currentIndex,
				target: currentIndex + 1 + index,
				value: Math.max(node.views ?? 0, 1),
			});
		});

		return {links, nodes};
	}, [pagePath]);

	if (!sankeyData) {
		return (
			<ClayEmptyState
				description="There are no page transitions on the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	return <Sankey data={sankeyData} height={420} metricLabel="views" />;
};

export default PagePathCardContent;
