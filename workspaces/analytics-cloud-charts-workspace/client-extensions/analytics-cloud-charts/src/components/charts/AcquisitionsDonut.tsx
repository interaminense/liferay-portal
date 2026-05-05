/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo, useState} from 'react';
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Sector,
	Tooltip,
	TooltipProps,
} from 'recharts';

import {Composition} from '../../lib/analytics';
import {useChartPalette} from '../../lib/chart-palette';
import {getPercentage, toRounded, toThousands} from '../../lib/charts';

export interface AcquisitionsDonutIProps {
	compositions: Composition[];
	height?: number;
	metricLabel?: string;
	total: number;
}

interface DonutDatum {
	count: number;
	name: string;
}

const TOP_N = 6;
const OTHER_LABEL = 'Other';
const CLASSNAME = 'analytics-acquisitions-donut';

interface ActiveShapeProps {
	cx: number;
	cy: number;
	endAngle: number;
	fill: string;
	innerRadius: number;
	outerRadius: number;
	startAngle: number;
}

const renderActiveShape = (rawProps: unknown) => {
	const {
		cx,
		cy,
		endAngle,
		fill,
		innerRadius,
		outerRadius,
		startAngle,
	} = rawProps as ActiveShapeProps;

	return (
		<g>
			<Sector
				cx={cx}
				cy={cy}
				endAngle={endAngle}
				fill={fill}
				innerRadius={innerRadius}
				outerRadius={outerRadius + 4}
				startAngle={startAngle}
			/>
		</g>
	);
};

const formatChartPercentage = (count: number, total: number) =>
	`${toRounded(getPercentage(count, total))}%`;

const renderTooltip = (
	props: TooltipProps<number, string>,
	total: number,
	metricLabel: string
) => {
	if (!props.active || !props.payload?.length) {
		return null;
	}

	const {count, name} = props.payload[0].payload as DonutDatum;

	return (
		<div
			className="bg-white border rounded shadow-sm"
			style={{minWidth: 200, padding: '0.5rem 0.75rem'}}
		>
			<div className="font-weight-semi-bold mb-1">{name}</div>

			<div className="align-items-baseline d-flex justify-content-between">
				<span className="text-secondary">
					{toThousands(count)} {metricLabel}
				</span>

				<span className="font-weight-semi-bold">
					{formatChartPercentage(count, total)}
				</span>
			</div>
		</div>
	);
};

export const AcquisitionsDonut: React.FC<AcquisitionsDonutIProps> = ({
	compositions,
	height = 300,
	metricLabel = 'sessions',
	total,
}) => {
	const [hoverIndex, setHoverIndex] = useState(-1);
	const palette = useChartPalette();

	const data = useMemo<DonutDatum[]>(() => {
		if (!compositions.length) {
			return [];
		}

		const top = compositions.slice(0, TOP_N).map((entry) => ({
			count: entry.count ?? 0,
			name: entry.name?.trim() || '—',
		}));

		const topSum = top.reduce((sum, entry) => sum + entry.count, 0);
		const remaining = Math.max(0, total - topSum);

		if (remaining > 0) {
			top.push({count: remaining, name: OTHER_LABEL});
		}

		return top;
	}, [compositions, total]);

	const handleEnter = (_: unknown, index: number) => setHoverIndex(index);
	const handleLeave = () => setHoverIndex(-1);

	return (
		<div className={CLASSNAME}>
			<ResponsiveContainer height={height} width="100%">
				<PieChart>
					<Tooltip
						content={(props) =>
							renderTooltip(
								props as TooltipProps<number, string>,
								total,
								metricLabel
							)
						}
					/>

					<Legend
						align="right"
						formatter={(_, entry) => {
							const {count, name} = (entry?.payload ??
								{}) as DonutDatum;

							return (
								<>
									<span title={name}>{name}</span>{' '}
									<span className="text-secondary">
										{formatChartPercentage(count, total)}
									</span>
								</>
							);
						}}
						iconSize={14}
						layout="vertical"
						onMouseMove={handleEnter}
						onMouseOut={handleLeave}
						verticalAlign="middle"
					/>

					<Pie
						activeIndex={hoverIndex}
						activeShape={renderActiveShape}
						blendStroke
						data={data}
						dataKey="count"
						endAngle={-270}
						innerRadius="50%"
						isAnimationActive={false}
						legendType="circle"
						onMouseMove={handleEnter}
						onMouseOut={handleLeave}
						startAngle={90}
					>
						{data.map((_, index) => (
							<Cell
								fill={palette[index % palette.length]}
								fillOpacity={
									hoverIndex >= 0 && hoverIndex !== index
										? 0.2
										: 1
								}
								key={`cell-${index}`}
								strokeOpacity={
									hoverIndex >= 0 && hoverIndex !== index
										? 0
										: 1
								}
							/>
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
};

export default AcquisitionsDonut;
