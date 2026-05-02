/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import ClayTabs from '@clayui/tabs';
import classNames from 'classnames';
import React, {useMemo, useState} from 'react';

import {Metric, PageMetric} from '../../lib/analytics';
import {
	formatDuration,
	formatNumber,
	formatPercentage,
} from '../../lib/charts';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {
	MetricFormat,
	PageEngagementChart,
} from '../charts/PageEngagementChart';

export interface PageEngagementCardContentIProps {
	metric: PageMetric | null;
}

interface MetricDefinition {
	format: MetricFormat;
	key: keyof PageMetric;
	label: string;
}

const METRIC_DEFINITIONS: MetricDefinition[] = [
	{format: 'number', key: 'viewsMetric', label: 'Views'},
	{format: 'number', key: 'visitorsMetric', label: 'Visitors'},
	{
		format: 'duration',
		key: 'avgTimeOnPageMetric',
		label: 'Avg Time on Page',
	},
	{format: 'percentage', key: 'bounceRateMetric', label: 'Bounce Rate'},
	{format: 'number', key: 'entrancesMetric', label: 'Entrances'},
	{format: 'percentage', key: 'exitRateMetric', label: 'Exit Rate'},
];

const formatTotal = (
	value: number | null | undefined,
	format: MetricFormat
) => {
	switch (format) {
		case 'duration':
			return formatDuration(value);
		case 'percentage':
			return formatPercentage(value);
		default:
			return formatNumber(value);
	}
};

const hasHistogramData = (metric: Metric | null | undefined) =>
	(metric?.histogram?.metrics?.length ?? 0) > 0;

const trendColor = (classification: string | null | undefined) => {
	if (classification === 'positive') {
		return 'text-success';
	}

	if (classification === 'negative') {
		return 'text-danger';
	}

	return 'text-secondary';
};

export const PageEngagementCardContent: React.FC<
	PageEngagementCardContentIProps
> = ({metric}) => {
	const [activeIndex, setActiveIndex] = useState(0);

	const hasAnyData = useMemo(() => {
		if (!metric) {
			return false;
		}

		return METRIC_DEFINITIONS.some((definition) =>
			hasHistogramData(metric[definition.key])
		);
	}, [metric]);

	if (!metric || !hasAnyData) {
		return (
			<ClayEmptyState
				description="There are no engagement metrics for the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	const activeDefinition = METRIC_DEFINITIONS[activeIndex];
	const activeMetric = metric[activeDefinition.key];
	const histogram = activeMetric?.histogram?.metrics ?? [];

	const trendPercentage = activeMetric?.trend?.percentage ?? null;
	const trendArrow =
		trendPercentage == null ? null : trendPercentage >= 0 ? '↑' : '↓';

	return (
		<>
			<ClayTabs active={activeIndex} onActiveChange={setActiveIndex}>
				{METRIC_DEFINITIONS.map((definition, index) => (
					<ClayTabs.Item
						innerProps={{
							'aria-controls': `analytics-page-engagement-tab-${index}`,
						}}
						key={definition.key}
					>
						{definition.label}
					</ClayTabs.Item>
				))}
			</ClayTabs>

			<div className="align-items-baseline d-flex flex-wrap mt-3">
				<span className="h3 mb-0 mr-3">
					{formatTotal(activeMetric?.value, activeDefinition.format)}
				</span>

				{trendPercentage != null && (
					<span
						className={classNames(
							trendColor(activeMetric?.trend?.trendClassification),
							'small'
						)}
					>
						{trendArrow} {Math.abs(trendPercentage).toFixed(1)}% vs
						previous period
					</span>
				)}
			</div>

			<div className="flex-grow-1 mt-2">
				{histogram.length > 0 ? (
					<PageEngagementChart
						data={histogram}
						format={activeDefinition.format}
						height={300}
						metricLabel={activeDefinition.label}
					/>
				) : (
					<ClayEmptyState
						description={`No ${activeDefinition.label.toLowerCase()} data for the selected period.`}
						imgSrc={EMPTY_STATE_IMG_SRC}
						small
						title="No data"
					/>
				)}
			</div>
		</>
	);
};

export default PageEngagementCardContent;
