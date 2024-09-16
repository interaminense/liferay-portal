/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useState} from 'react';
import {
	CartesianGrid,
	ComposedChart,
	Dot,
	Legend,
	Line,
	ResponsiveContainer,
	Text,
	TextProps,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

import {RangeSelectors} from '../types/global';
import {
	DataKey,
	FormattedData,
	formatXAxisDate,
	getFillOpacity,
} from '../utils/visitorsBehaviorChart';
import VisitorsBehaviorLegend from './VisitorsBehaviorLegend';
import VisitorsBehaviorTooltip from './VisitorsBehaviorTooltip';

interface IVisitorsBehaviorChartProps {
	data: FormattedData;
	rangeSelector: RangeSelectors;
}

function getAxisTickText(
	axis: DataKey,
	formatter?: (value: number) => string | number
) {
	return ({
		payload: {offset, value},
		textAnchor,
		x,
		y,
	}: {
		payload: {
			offset: number;
			value: number;
		};
		textAnchor: TextProps['textAnchor'];
		x: number;
		y: number;
	}) => (
		<Text
			style={{
				fill: '#6B6C7E',
				fontSize: '0.75rem',
			}}
			textAnchor={textAnchor}
			x={x}
			y={axis === 'y' ? y + offset : y}
		>
			{formatter ? formatter(value) : value}
		</Text>
	);
}

const VisitorsBehaviorChart: React.FC<IVisitorsBehaviorChartProps> = ({
	data,
	rangeSelector,
}) => {
	const [activeLegendItem, setActiveLegendItem] = useState<DataKey | null>(
		null
	);

	return (
		<div className="visitors-behavior-chart">
			<ResponsiveContainer height={275}>
				<ComposedChart data={data.combinedData}>
					<CartesianGrid
						stroke="#E7E7ED"
						strokeDasharray="3 3"
						vertical={false}
					/>

					<XAxis
						axisLine={{
							stroke: '#E7E7ED',
						}}
						dataKey={DataKey.AxisX}
						interval="preserveStart"
						stroke="#E7E7ED"
						tick={getAxisTickText(DataKey.AxisX, (value) =>
							formatXAxisDate(value, rangeSelector)
						)}
						tickLine={false}
						tickMargin={12}
						ticks={data.intervals as number[]}
					/>

					<YAxis
						axisLine={{
							stroke: '#E7E7ED',
						}}
						stroke="#E7E7ED"
						tick={getAxisTickText(
							DataKey.AxisY,
							data.data[DataKey.AxisY]?.format
						)}
						tickLine={false}
						width={40}
					/>

					<Line
						animationDuration={100}
						dataKey={DataKey.Metric}
						fill="#4B9BFF"
						fillOpacity={getFillOpacity(
							DataKey.Metric,
							activeLegendItem
						)}
						legendType="plainline"
						r={2}
						stroke="#4B9BFF"
						strokeOpacity={getFillOpacity(
							DataKey.Metric,
							activeLegendItem
						)}
						strokeWidth={2}
						type="linear"
					/>

					<Line
						animationDuration={100}
						dataKey={DataKey.PublishedVersionData}
						dot={<Dot fill="white" r={3} stroke="black" />}
						stroke="#000"
						strokeOpacity={getFillOpacity(
							DataKey.PublishedVersionData,
							activeLegendItem
						)}
						strokeWidth={2}
						type="monotone"
					/>

					<Tooltip
						content={({active = false, payload}) => {
							if (active && payload?.length) {
								return (
									<VisitorsBehaviorTooltip
										data={data}
										payload={payload}
										rangeSeletor={rangeSelector}
									/>
								);
							}

							return null;
						}}
						cursor={!!data.intervals.length}
					/>

					<Legend
						align="left"
						content={({payload}) => {
							if (payload?.length) {
								return (
									<VisitorsBehaviorLegend
										data={data}
										onMouseChange={setActiveLegendItem}
										payload={payload as any}
									/>
								);
							}

							return null;
						}}
					/>
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};

export default VisitorsBehaviorChart;
