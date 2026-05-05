/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from 'recharts';

import {HistogramMetric} from '../../lib/analytics';
import {useChartPalette} from '../../lib/chart-palette';
import {
	formatDuration,
	formatNumber,
	formatPercentage,
} from '../../lib/charts';

export type MetricFormat = 'duration' | 'number' | 'percentage';

export interface PageEngagementChartIProps {
	data: HistogramMetric[];
	format: MetricFormat;
	height?: number;
	metricLabel: string;
}

interface ChartDatum {
	label: string;
	previousValue: number | null;
	value: number;
}

const X_AXIS_FORMATTER = new Intl.DateTimeFormat(undefined, {
	day: '2-digit',
	month: 'short',
});

const formatBucketLabel = (raw: string | null | undefined) => {
	if (!raw) {
		return '';
	}

	const parsed = new Date(raw);

	return Number.isNaN(parsed.getTime())
		? raw
		: X_AXIS_FORMATTER.format(parsed);
};

const formatValue = (
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

const renderTooltip = (
	props: TooltipProps<number, string>,
	format: MetricFormat,
	metricLabel: string,
	color: string,
	previousColor: string,
	showPrevious: boolean
) => {
	if (!props.active || !props.payload?.length) {
		return null;
	}

	const datum = props.payload[0].payload as ChartDatum;

	return (
		<div
			className="bg-white border rounded shadow-sm"
			style={{minWidth: 200, padding: '0.5rem 0.75rem'}}
		>
			<div className="font-weight-semi-bold mb-1">{datum.label}</div>

			<div className="align-items-baseline d-flex justify-content-between">
				<span style={{color}}>● {metricLabel}</span>

				<span className="font-weight-semi-bold ml-3">
					{formatValue(datum.value, format)}
				</span>
			</div>

			{showPrevious && (
				<div className="align-items-baseline d-flex justify-content-between mt-1">
					<span style={{color: previousColor}}>
						● Previous period
					</span>

					<span className="ml-3 text-secondary">
						{formatValue(datum.previousValue, format)}
					</span>
				</div>
			)}
		</div>
	);
};

const CLASSNAME = 'analytics-page-engagement-chart';
const GRADIENT_ID = 'analytics-page-engagement-gradient';
const PREVIOUS_COLOR = '#9CA0B0';

export const PageEngagementChart: React.FC<PageEngagementChartIProps> = ({
	data,
	format,
	height = 300,
	metricLabel,
}) => {
	const palette = useChartPalette();
	const baseColor = palette[0];

	const chartData = useMemo<ChartDatum[]>(
		() =>
			data.map((entry) => ({
				label: formatBucketLabel(entry.valueKey),
				previousValue: entry.previousValue ?? null,
				value: entry.value ?? 0,
			})),
		[data]
	);

	const hasPrevious = chartData.some(
		(entry) => entry.previousValue != null
	);

	return (
		<div className={CLASSNAME}>
			<ResponsiveContainer height={height} width="100%">
				<AreaChart data={chartData}>
					<defs>
						<linearGradient
							id={GRADIENT_ID}
							x1="0"
							x2="0"
							y1="0"
							y2="1"
						>
							<stop
								offset="0%"
								stopColor={baseColor}
								stopOpacity={0.4}
							/>

							<stop
								offset="100%"
								stopColor={baseColor}
								stopOpacity={0}
							/>
						</linearGradient>
					</defs>

					<CartesianGrid
						stroke="#e7e7ed"
						strokeDasharray="3 3"
						vertical={false}
					/>

					<XAxis
						axisLine={{stroke: '#cdced9'}}
						dataKey="label"
						interval="preserveStartEnd"
						padding={{left: 20, right: 20}}
						tickLine={false}
						tickMargin={12}
					/>

					<YAxis
						axisLine={{stroke: '#cdced9'}}
						tickCount={6}
						tickFormatter={(value) => formatValue(value, format)}
						tickLine={false}
						width={56}
					/>

					<Tooltip
						content={(props) =>
							renderTooltip(
								props as TooltipProps<number, string>,
								format,
								metricLabel,
								baseColor,
								PREVIOUS_COLOR,
								hasPrevious
							)
						}
					/>

					{hasPrevious && (
						<Area
							dataKey="previousValue"
							fill="transparent"
							isAnimationActive={false}
							name="Previous period"
							stroke={PREVIOUS_COLOR}
							strokeDasharray="4 4"
							strokeWidth={1.5}
							type="monotone"
						/>
					)}

					<Area
						dataKey="value"
						fill={`url(#${GRADIENT_ID})`}
						isAnimationActive={false}
						name={metricLabel}
						stroke={baseColor}
						strokeWidth={2}
						type="monotone"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default PageEngagementChart;
