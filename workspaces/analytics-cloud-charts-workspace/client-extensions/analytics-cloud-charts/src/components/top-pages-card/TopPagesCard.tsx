/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayTabs from '@clayui/tabs';
import React, {useMemo, useState} from 'react';

import {useQuery} from '../../hooks/useQuery';
import {
	AssetMetricBag,
	PageAssetMetric,
	TOP_PAGES_QUERY,
} from '../../lib/analytics';
import {fetchPolicyForRange} from '../../lib/fetch-policy';
import {RangeSelectors} from '../../lib/types';
import {AIInsightCallout} from '../AIInsightCallout';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {TopPagesValueFormat} from '../charts/TopPagesList';
import {TopPagesCardContent} from './TopPagesCardContent';

export interface TopPagesCardIProps {
	aiInsightsEnabled: boolean;
	channelId: string;
	rangeSelectors: RangeSelectors;
}

type Data = {
	pages: AssetMetricBag | null;
};

interface TabDefinition {
	format: TopPagesValueFormat;
	getValue: (entry: PageAssetMetric) => number;
	label: string;
	sortColumn: string;
}

const TAB_DEFINITIONS: TabDefinition[] = [
	{
		format: 'number',
		getValue: (entry) => entry.visitorsMetric?.value ?? 0,
		label: 'Visited',
		sortColumn: 'visitorsMetric',
	},
	{
		format: 'number',
		getValue: (entry) => entry.entrancesMetric?.value ?? 0,
		label: 'Entrances',
		sortColumn: 'entrancesMetric',
	},
	{
		format: 'percentage',
		getValue: (entry) => entry.exitRateMetric?.value ?? 0,
		label: 'Exits',
		sortColumn: 'exitRateMetric',
	},
];

const SIZE = 10;

export const TopPagesCard: React.FC<TopPagesCardIProps> = ({
	aiInsightsEnabled,
	channelId,
	rangeSelectors,
}) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const activeDefinition = TAB_DEFINITIONS[activeIndex];

	const variables = useMemo(
		() => ({
			channelId,
			rangeEnd: null,
			rangeKey: rangeSelectors.rangeKey,
			rangeStart: null,
			size: SIZE,
			sort: {
				column: activeDefinition.sortColumn,
				type: 'DESC' as const,
			},
			start: 0,
		}),
		[channelId, rangeSelectors.rangeKey, activeDefinition.sortColumn]
	);

	const {data, error, loading} = useQuery<Data>(TOP_PAGES_QUERY, variables, {
		fetchPolicy: fetchPolicyForRange(rangeSelectors),
	});

	return (
		<>
			<ClayTabs active={activeIndex} onActiveChange={setActiveIndex}>
				{TAB_DEFINITIONS.map((definition, index) => (
					<ClayTabs.Item
						innerProps={{
							'aria-controls': `analytics-top-pages-tab-${index}`,
						}}
						key={definition.label}
					>
						{definition.label}
					</ClayTabs.Item>
				))}
			</ClayTabs>

			<div className="flex-grow-1 mt-3">
				<StatesRenderer error={!!error} loading={loading}>
					<StatesRenderer.Error apolloError={error}>
						<ErrorDisplay message={error?.message} />
					</StatesRenderer.Error>

					<StatesRenderer.Loading />

					<StatesRenderer.Success>
						<>
							<TopPagesCardContent
								bag={data?.pages ?? null}
								format={activeDefinition.format}
								getValue={activeDefinition.getValue}
								tabLabel={activeDefinition.label}
							/>

							<AIInsightCallout
								data={data?.pages ?? null}
								enabled={aiInsightsEnabled}
								metricLabel={`Top Pages — ${activeDefinition.label}`}
							/>
						</>
					</StatesRenderer.Success>
				</StatesRenderer>
			</div>
		</>
	);
};

export default TopPagesCard;
