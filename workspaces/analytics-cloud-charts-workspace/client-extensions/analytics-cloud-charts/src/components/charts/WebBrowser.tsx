/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';
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

import {useChartPalette} from '../../lib/chart-palette';
import {getPercentage, toRounded, toThousands} from '../../lib/charts';

export interface WebBrowserEntry {
	value: number;
	valueKey: string;
}

export interface WebBrowserIProps {
	browsers?: WebBrowserEntry[];
	height?: number;
	metricLabel?: string;
	total: number;
}

const CLASSNAME = 'analytics-web-browser-chart';

const getChartPercentage = (value: number, total: number) =>
	`${toRounded(getPercentage(value, total))}%`;

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

const renderTooltip = (
	props: TooltipProps<number, string>,
	total: number,
	metricLabel: string
) => {
	if (!props.active || !props.payload?.length) {
		return null;
	}

	const {value, valueKey} = props.payload[0]
		.payload as WebBrowserEntry;

	return (
		<div
			className="bg-white border rounded shadow-sm"
			style={{padding: '0.5rem 0.75rem', minWidth: 200}}
		>
			<div className="font-weight-semi-bold mb-1">{valueKey}</div>

			<div className="align-items-baseline d-flex justify-content-between">
				<span className="text-secondary">
					{toThousands(value)} {metricLabel}
				</span>

				<span className="font-weight-semi-bold">
					{getChartPercentage(value, total)}
				</span>
			</div>
		</div>
	);
};

export const WebBrowser: React.FC<WebBrowserIProps> = ({
	browsers = [],
	height = 370,
	metricLabel = 'views',
	total,
}) => {
	const [hoverIndex, setHoverIndex] = useState(-1);
	const palette = useChartPalette();

	const handleEnter = (_: unknown, index: number) =>
		setHoverIndex(index);
	const handleLeave = () => setHoverIndex(-1);

	return (
		<div className={CLASSNAME}>
			<ResponsiveContainer height={height} width="100%">
				<PieChart>
					<Tooltip
						content={(props) =>
							renderTooltip(props, total, metricLabel)
						}
					/>

					<Legend
						align="right"
						formatter={(_, entry) => {
							const {value, valueKey} = (entry?.payload ??
								{}) as WebBrowserEntry;

							return (
								<>
									<span title={valueKey}>{valueKey}</span>{' '}
									<span className="text-secondary">
										{getChartPercentage(value, total)}
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
						data={browsers}
						dataKey="value"
						endAngle={-270}
						innerRadius="50%"
						isAnimationActive={false}
						legendType="circle"
						onMouseMove={handleEnter}
						onMouseOut={handleLeave}
						startAngle={90}
					>
						{browsers.map((_, index) => (
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

export default WebBrowser;
