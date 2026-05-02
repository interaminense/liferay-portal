/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from 'recharts';

import {Composition} from '../../lib/analytics';
import {useChartPalette} from '../../lib/chart-palette';
import {getPercentage, toRounded, toThousands} from '../../lib/charts';

export interface VisitFrequencyHistogramIProps {
	buckets: Composition[];
	height?: number;
	total: number;
}

interface BarDatum {
	count: number;
	name: string;
}

const CLASSNAME = 'analytics-visit-frequency-histogram';

const renderTooltip = (
	props: TooltipProps<number, string>,
	total: number,
	color: string
) => {
	if (!props.active || !props.payload?.length) {
		return null;
	}

	const datum = props.payload[0].payload as BarDatum;
	const percentage = getPercentage(datum.count, total);

	return (
		<div
			className="bg-white border rounded shadow-sm"
			style={{minWidth: 200, padding: '0.5rem 0.75rem'}}
		>
			<div className="font-weight-semi-bold mb-1">
				{datum.name} {datum.name === '1' ? 'visit' : 'visits'}
			</div>

			<div className="align-items-baseline d-flex justify-content-between">
				<span style={{color}}>● Visitors</span>

				<span className="font-weight-semi-bold ml-3">
					{toThousands(datum.count)} ({toRounded(percentage)}%)
				</span>
			</div>
		</div>
	);
};

export const VisitFrequencyHistogram: React.FC<
	VisitFrequencyHistogramIProps
> = ({buckets, height = 320, total}) => {
	const palette = useChartPalette();
	const barColor = palette[0];

	const data = useMemo<BarDatum[]>(
		() =>
			buckets.map((entry) => ({
				count: entry.count ?? 0,
				name: entry.name?.trim() || '—',
			})),
		[buckets]
	);

	return (
		<div className={CLASSNAME}>
			<ResponsiveContainer height={height} width="100%">
				<BarChart data={data}>
					<CartesianGrid
						stroke="#e7e7ed"
						strokeDasharray="3 3"
						vertical={false}
					/>

					<XAxis
						axisLine={{stroke: '#cdced9'}}
						dataKey="name"
						interval={0}
						padding={{left: 10, right: 10}}
						tickLine={false}
						tickMargin={8}
					/>

					<YAxis
						allowDecimals={false}
						axisLine={{stroke: '#cdced9'}}
						tickCount={6}
						tickFormatter={(value) => toThousands(value)}
						tickLine={false}
						width={56}
					/>

					<Tooltip
						content={(props) =>
							renderTooltip(
								props as TooltipProps<number, string>,
								total,
								barColor
							)
						}
						cursor={{fill: 'rgba(0, 0, 0, 0.04)'}}
					/>

					<Bar
						dataKey="count"
						fill={barColor}
						isAnimationActive={false}
						radius={[4, 4, 0, 0]}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default VisitFrequencyHistogram;
