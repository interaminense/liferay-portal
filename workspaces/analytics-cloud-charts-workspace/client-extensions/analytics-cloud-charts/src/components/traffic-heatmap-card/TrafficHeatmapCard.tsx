/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {HeatMapMetric, TRAFFIC_HEATMAP_QUERY} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {TrafficHeatmapCardContent} from './TrafficHeatmapCardContent';

export interface TrafficHeatmapCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
}

type Data = {
	siteVisitorHeatMap: HeatMapMetric[] | null;
};

const resolveTimeZone = () => {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone;
	}
	catch {
		return 'UTC';
	}
};

export const TrafficHeatmapCard: React.FC<TrafficHeatmapCardIProps> = ({
	aiInsightsEnabled,
	channelId,
	rangeSelectors,
}) => {
	const variables = useMemo(
		() => ({
			channelId,
			rangeEnd: null,
			rangeKey: rangeSelectors.rangeKey,
			rangeStart: null,
			timeZoneId: resolveTimeZone(),
		}),
		[channelId, rangeSelectors.rangeKey]
	);

	const {data, error, loading} = useQuery<Data>(
		TRAFFIC_HEATMAP_QUERY,
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
					<TrafficHeatmapCardContent
						cells={data?.siteVisitorHeatMap ?? []}
					/>

					<AIInsightCallout
						data={data?.siteVisitorHeatMap ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Traffic Heatmap"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default TrafficHeatmapCard;
