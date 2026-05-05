/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {AUDIENCE_COMPOSITION_QUERY, IndividualMetric} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {AudienceCompositionCardContent} from './AudienceCompositionCardContent';

export interface AudienceCompositionCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
}

type Data = {
	individualMetric: IndividualMetric | null;
};

export const AudienceCompositionCard: React.FC<
	AudienceCompositionCardIProps
> = ({aiInsightsEnabled, channelId, rangeSelectors}) => {
	const variables = useMemo(
		() => ({
			channelId,
			rangeKey: rangeSelectors.rangeKey,
		}),
		[channelId, rangeSelectors.rangeKey]
	);

	const {data, error, loading} = useQuery<Data>(
		AUDIENCE_COMPOSITION_QUERY,
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
					<AudienceCompositionCardContent
						metric={data?.individualMetric ?? null}
					/>

					<AIInsightCallout
						data={data?.individualMetric ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Audience Size"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default AudienceCompositionCard;
