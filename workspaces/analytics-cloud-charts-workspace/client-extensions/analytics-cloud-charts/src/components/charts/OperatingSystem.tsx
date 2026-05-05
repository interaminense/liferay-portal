/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from 'recharts';

import {useChartPalette} from '../../lib/chart-palette';
import {toRounded, toThousands} from '../../lib/charts';

export interface OperatingSystemDatum {
	percentage: number;
	type: string;
	views: number;
}

export interface OperatingSystemEntry {
	data: OperatingSystemDatum[];
	label: string;
	percentageOfTotal: number;
	totalViews: number;
}

export interface OperatingSystemIProps {
	devices?: OperatingSystemEntry[];
	height?: number;
	metricLabel?: string;
}

const MIN_VALUE = '< 0.1%';

const getItemPercentage = (percentage: number) => {
	if (percentage < 0.1) {
		return MIN_VALUE;
	}

	return `${toRounded(percentage)}%`;
};

const renderTooltip = (
	props: TooltipProps<number, string>,
	metricLabel: string
) => {
	if (!props.active || !props.payload?.length) {
		return null;
	}

	const root = props.payload[0]
		.payload as OperatingSystemEntry;

	return (
		<div
			className="bg-white border rounded shadow-sm"
			style={{padding: '0.5rem 0.75rem', minWidth: 220}}
		>
			<div className="align-items-baseline d-flex font-weight-semi-bold justify-content-between mb-2">
				<span>{root.label}</span>

				<span className="text-secondary">
					{toThousands(root.totalViews)} {metricLabel}
				</span>

				<span>{toRounded(root.percentageOfTotal)}%</span>
			</div>

			{props.payload.map((entry, index) => {
				const datum = root.data[index];

				if (!datum) {
					return null;
				}

				return (
					<div
						className="align-items-baseline d-flex justify-content-between"
						key={index}
					>
						<span style={{color: entry.color}}>
							● {datum.type}
						</span>

						<span className="text-secondary">
							{toThousands(datum.views)}
						</span>

						{datum.type !== 'Other' && (
							<span className="font-weight-semi-bold">
								{getItemPercentage(datum.percentage)}
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
};

const CLASSNAME = 'analytics-operating-system-chart';

export const OperatingSystem: React.FC<OperatingSystemIProps> = ({
	devices = [],
	height = 370,
	metricLabel = 'views',
}) => {
	const palette = useChartPalette();

	const barCount = devices.reduce(
		(acc, entry) => Math.max(acc, entry.data.length),
		0
	);

	return (
		<div className={CLASSNAME}>
			<ResponsiveContainer height={height} width="100%">
				<ComposedChart data={devices}>
					<CartesianGrid
						stroke="#e7e7ed"
						strokeDasharray="3 3"
						vertical={false}
					/>

					<XAxis
						axisLine={{stroke: '#cdced9'}}
						dataKey="label"
						interval="preserveStart"
						padding={{left: 20, right: 20}}
						tickLine={false}
						tickMargin={12}
					/>

					<YAxis
						allowDecimals={false}
						axisLine={{stroke: '#cdced9'}}
						tickCount={6}
						tickFormatter={(value) => toThousands(value)}
						tickLine={false}
						type="number"
						width={40}
					/>

					<Tooltip
						content={(props) => renderTooltip(props, metricLabel)}
					/>

					{Array.from({length: barCount}).map((_, index) => (
						<Bar
							dataKey={`data[${index}].views`}
							fill={palette[index % palette.length]}
							isAnimationActive={false}
							key={index}
							stackId="devices"
						/>
					))}
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

export default OperatingSystem;
