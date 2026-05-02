/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {VISIT_FREQUENCY_QUERY, VisitFrequencyBag} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {VisitFrequencyCardContent} from './VisitFrequencyCardContent';

export interface VisitFrequencyCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
}

type Data = {
	visitFrequency: VisitFrequencyBag | null;
};

export const VisitFrequencyCard: React.FC<VisitFrequencyCardIProps> = ({
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
		}),
		[channelId, rangeSelectors.rangeKey]
	);

	const {data, error, loading} = useQuery<Data>(
		VISIT_FREQUENCY_QUERY,
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
					<VisitFrequencyCardContent
						bag={data?.visitFrequency ?? null}
					/>

					<AIInsightCallout
						data={data?.visitFrequency ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Visit Frequency"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default VisitFrequencyCard;
