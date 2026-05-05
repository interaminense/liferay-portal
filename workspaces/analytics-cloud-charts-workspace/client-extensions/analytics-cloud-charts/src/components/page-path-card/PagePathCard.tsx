/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {PAGE_PATH_QUERY, PagePathNode} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {PagePathCardContent} from './PagePathCardContent';

export interface PagePathCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
	title?: string;
	touchpoint?: string;
}

export type Data = {
	pagePath: PagePathNode | null;
};

export const PagePathCard: React.FC<PagePathCardIProps> = ({
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
			segmentId: null,
			title: title ?? '',
		}),
		[channelId, rangeSelectors.rangeKey, title, touchpoint]
	);

	const {data, error, loading} = useQuery<Data>(
		PAGE_PATH_QUERY,
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
					<PagePathCardContent pagePath={data?.pagePath ?? null} />

					<AIInsightCallout
						data={data?.pagePath ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Page Path"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default PagePathCard;
