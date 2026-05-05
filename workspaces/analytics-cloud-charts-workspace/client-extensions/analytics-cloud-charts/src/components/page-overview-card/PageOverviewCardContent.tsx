/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import React from 'react';

import {Metric, PageMetric} from '../../lib/analytics';
import {useChartPalette} from '../../lib/chart-palette';
import {
	formatDuration,
	formatNumber,
	formatPercentage,
} from '../../lib/charts';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {KpiCard, KpiCardFormat} from '../charts/KpiCard';

export interface PageOverviewCardContentIProps {
	metric: PageMetric | null;
}

interface KpiDefinition {
	format: KpiCardFormat;
	getMetric: (metric: PageMetric) => Metric | null;
	label: string;
}

const KPI_DEFINITIONS: KpiDefinition[] = [
	{
		format: 'number',
		getMetric: (metric) => metric.viewsMetric,
		label: 'Views',
	},
	{
		format: 'number',
		getMetric: (metric) => metric.visitorsMetric,
		label: 'Visitors',
	},
	{
		format: 'duration',
		getMetric: (metric) => metric.avgTimeOnPageMetric,
		label: 'Avg Time on Page',
	},
	{
		format: 'percentage',
		getMetric: (metric) => metric.bounceRateMetric,
		label: 'Bounce Rate',
	},
];

const formatValue = (
	value: number | null | undefined,
	format: KpiCardFormat
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

export const PageOverviewCardContent: React.FC<
	PageOverviewCardContentIProps
> = ({metric}) => {
	const palette = useChartPalette();

	const hasAnyData =
		!!metric &&
		KPI_DEFINITIONS.some((def) => def.getMetric(metric)?.value != null);

	if (!metric || !hasAnyData) {
		return (
			<ClayEmptyState
				description="There are no page KPIs available for the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	return (
		<div
			style={{
				display: 'grid',
				gap: 12,
				gridTemplateColumns:
					'repeat(auto-fit, minmax(180px, 1fr))',
			}}
		>
			{KPI_DEFINITIONS.map((definition, index) => {
				const submetric = definition.getMetric(metric);
				const histogram = submetric?.histogram?.metrics ?? [];
				const color = palette[index % palette.length];

				return (
					<KpiCard
						color={color}
						format={definition.format}
						formatValue={(value) =>
							formatValue(value, definition.format)
						}
						histogram={histogram}
						key={definition.label}
						label={definition.label}
						trendClassification={
							submetric?.trend?.trendClassification
						}
						trendPercentage={submetric?.trend?.percentage}
						value={submetric?.value}
					/>
				);
			})}
		</div>
	);
};

export default PageOverviewCardContent;
