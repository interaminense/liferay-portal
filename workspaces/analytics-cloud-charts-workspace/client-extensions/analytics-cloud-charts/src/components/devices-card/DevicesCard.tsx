/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {Metric, TOUCHPOINT_DEVICES_QUERY} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {DevicesCardContent} from './DevicesCardContent';

export interface DevicesCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
	title?: string;
	touchpoint?: string;
}

export type Data = {
	page: {
		viewsMetric: Metric | null;
	} | null;
};

export const DevicesCard: React.FC<DevicesCardIProps> = ({
	aiInsightsEnabled,
	channelId,
	rangeSelectors,
	title,
	touchpoint,
}) => {
	const variables = useMemo(
		() => ({
			channelId,
			devices: 'Any',
			experienceId: null,
			location: 'Any',
			rangeEnd: null,
			rangeKey: rangeSelectors.rangeKey,
			rangeStart: null,
			title: title ?? '',
			touchpoint: touchpoint ?? '',
		}),
		[channelId, rangeSelectors.rangeKey, title, touchpoint]
	);

	const {data, error, loading} = useQuery<Data>(
		TOUCHPOINT_DEVICES_QUERY,
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
					<DevicesCardContent
						viewsMetric={data?.page?.viewsMetric ?? null}
					/>

					<AIInsightCallout
						data={data?.page?.viewsMetric ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Devices"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default DevicesCard;
