/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {SITE_OVERVIEW_QUERY, SiteMetric} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {SiteOverviewCardContent} from './SiteOverviewCardContent';

export interface SiteOverviewCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
}

type Data = {
	site: SiteMetric | null;
};

const INTERVAL = 'D';

export const SiteOverviewCard: React.FC<SiteOverviewCardIProps> = ({
	aiInsightsEnabled,
	channelId,
	rangeSelectors,
}) => {
	const variables = useMemo(
		() => ({
			channelId,
			interval: INTERVAL,
			rangeEnd: null,
			rangeKey: rangeSelectors.rangeKey,
			rangeStart: null,
		}),
		[channelId, rangeSelectors.rangeKey]
	);

	const {data, error, loading} = useQuery<Data>(
		SITE_OVERVIEW_QUERY,
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
					<SiteOverviewCardContent metric={data?.site ?? null} />

					<AIInsightCallout
						data={data?.site ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Site Overview"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default SiteOverviewCard;
