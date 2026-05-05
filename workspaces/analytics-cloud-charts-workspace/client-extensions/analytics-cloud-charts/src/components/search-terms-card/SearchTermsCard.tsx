/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {CompositionBag, SEARCH_TERMS_QUERY} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {SearchTermsCardContent} from './SearchTermsCardContent';

export interface SearchTermsCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
}

type Data = {
	searchTerms: CompositionBag | null;
};

const SIZE = 10;

export const SearchTermsCard: React.FC<SearchTermsCardIProps> = ({
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

	const {data, error, loading} = useQuery<Data>(
		SEARCH_TERMS_QUERY,
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
					<SearchTermsCardContent
						bag={data?.searchTerms ?? null}
					/>

					<AIInsightCallout
						data={data?.searchTerms ?? null}
						enabled={aiInsightsEnabled}
						metricLabel="Search Terms"
					/>
				</>
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default SearchTermsCard;
