/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {ACQUISITIONS_QUERY, Acquisitions} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {AcquisitionsCardContent} from './AcquisitionsCardContent';

export interface AcquisitionsCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
}

const SIZE = 10;

export const AcquisitionsCard: React.FC<AcquisitionsCardIProps> = ({
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
			size: SIZE,
			start: 0,
		}),
		[channelId, rangeSelectors.rangeKey]
	);

	const {data, error, loading} = useQuery<Acquisitions>(
		ACQUISITIONS_QUERY,
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
					<AcquisitionsCardContent acquisitions={data ?? null} />

					<AIInsightCallout
						data={data ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Acquisitions"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default AcquisitionsCard;
