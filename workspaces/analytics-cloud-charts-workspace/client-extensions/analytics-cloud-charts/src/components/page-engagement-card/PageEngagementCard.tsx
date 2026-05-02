/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {PAGE_ENGAGEMENT_QUERY, PageMetric} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {PageEngagementCardContent} from './PageEngagementCardContent';

export interface PageEngagementCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
	title?: string;
	touchpoint?: string;
}

export type Data = {
	page: PageMetric | null;
};

export const PageEngagementCard: React.FC<PageEngagementCardIProps> = ({
	aiInsightsEnabled,
	channelId,
	rangeSelectors,
	title,
	touchpoint,
}) => {
	const variables = useMemo(
		() => ({
			canonicalUrl: touchpoint ?? '',
			channelId,
			rangeEnd: null,
			rangeKey: rangeSelectors.rangeKey,
			rangeStart: null,
			title: title ?? '',
		}),
		[channelId, rangeSelectors.rangeKey, title, touchpoint]
	);

	const {data, error, loading} = useQuery<Data>(
		PAGE_ENGAGEMENT_QUERY,
		variables,
		{fetchPolicy: fetchPolicyForRange(rangeSelectors)}
	);

	return (
		<StatesRenderer error={!!error} loading={loading}>
			<StatesRenderer.Error apolloError={error}>
				<ErrorDisplay message={error?.message} />
			</StatesRenderer.Error>

			<StatesRenderer.Loading />

			<StatesRenderer.Success>
				<>
					<PageEngagementCardContent metric={data?.page ?? null} />

					<AIInsightCallout
						data={data?.page ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Page Engagement"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default PageEngagementCard;
