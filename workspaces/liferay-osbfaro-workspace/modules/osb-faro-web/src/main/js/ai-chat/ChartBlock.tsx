/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts';

import {ChartSpec} from './types';

const COLORS = ['#0b5fff', '#01c4a8', '#ffb46e', '#ff5f5f', '#7367f0'];

interface Props {
	spec: ChartSpec;
}

const ChartBlock: React.FC<Props> = ({spec}) => {
	const {data, series, title, type, xKey} = spec;

	return (
		<div className='ai-chat-chart'>
			<div className='ai-chat-chart__title'>{title}</div>

			<ResponsiveContainer height={220} width='100%'>
				{type === 'pie' ? (
					<PieChart>
						<Tooltip />

						<Pie
							data={data}
							dataKey={series[0].key}
							label
							nameKey={xKey}
							outerRadius={80}
						>
							{data.map((entry, index) => (
								<Cell
									fill={COLORS[index % COLORS.length]}
									key={`cell-${index}`}
								/>
							))}
						</Pie>
					</PieChart>
				) : type === 'bar' ? (
					<BarChart data={data}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey={xKey} />
						<YAxis />
						<Tooltip />
						<Legend />

						{series.map((serie, index) => (
							<Bar
								dataKey={serie.key}
								fill={COLORS[index % COLORS.length]}
								key={serie.key}
								name={serie.label || serie.key}
							/>
						))}
					</BarChart>
				) : type === 'area' ? (
					<AreaChart data={data}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey={xKey} />
						<YAxis />
						<Tooltip />
						<Legend />

						{series.map((serie, index) => (
							<Area
								dataKey={serie.key}
								fill={COLORS[index % COLORS.length]}
								key={serie.key}
								name={serie.label || serie.key}
								stroke={COLORS[index % COLORS.length]}
							/>
						))}
					</AreaChart>
				) : (
					<LineChart data={data}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey={xKey} />
						<YAxis />
						<Tooltip />
						<Legend />

						{series.map((serie, index) => (
							<Line
								dataKey={serie.key}
								key={serie.key}
								name={serie.label || serie.key}
								stroke={COLORS[index % COLORS.length]}
								type='monotone'
							/>
						))}
					</LineChart>
				)}
			</ResponsiveContainer>
		</div>
	);
};

export default ChartBlock;
