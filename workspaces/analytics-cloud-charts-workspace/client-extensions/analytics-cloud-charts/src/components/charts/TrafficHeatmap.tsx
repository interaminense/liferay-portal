/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {HeatMapMetric} from '../../lib/analytics';
import {useChartPalette} from '../../lib/chart-palette';
import {hexToRgb, toThousands} from '../../lib/charts';

export interface TrafficHeatmapIProps {
	cells: HeatMapMetric[];
	metricLabel?: string;
}

const TOTAL_DAYS = 7;
const TOTAL_HOURS = 24;
const CELL_HEIGHT = 28;
const HOUR_LABEL_INTERVAL = 3;
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_SHORT_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_FULL_LABELS = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
];
const HOURS = Array.from({length: TOTAL_HOURS}, (_, hour) => hour);
const CLASSNAME = 'analytics-traffic-heatmap';

const formatHour = (hour: number) => {
	const period = hour < 12 ? 'AM' : 'PM';
	const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

	return `${display} ${period}`;
};

interface GridResult {
	grid: number[][];
	max: number;
}

const buildGrid = (cells: HeatMapMetric[]): GridResult => {
	const grid: number[][] = Array.from({length: TOTAL_DAYS}, () =>
		Array(TOTAL_HOURS).fill(0)
	);

	let max = 0;

	for (const item of cells) {
		const day = parseInt(item.colDimension ?? '', 10);
		const hour = parseInt(item.rowDimension ?? '', 10);
		const value = item.value ?? 0;

		if (
			Number.isFinite(day) &&
			Number.isFinite(hour) &&
			day >= 0 &&
			day < TOTAL_DAYS &&
			hour >= 0 &&
			hour < TOTAL_HOURS
		) {
			grid[day][hour] = value;

			if (value > max) {
				max = value;
			}
		}
	}

	return {grid, max};
};

export const TrafficHeatmap: React.FC<TrafficHeatmapIProps> = ({
	cells,
	metricLabel = 'visitors',
}) => {
	const palette = useChartPalette();
	const baseColorRgb = useMemo(() => hexToRgb(palette[0]), [palette]);

	const {grid, max} = useMemo(() => buildGrid(cells), [cells]);

	return (
		<div className={CLASSNAME}>
			<div style={{overflowX: 'auto'}}>
				<div
					style={{
						display: 'grid',
						fontSize: 11,
						gap: 2,
						gridTemplateColumns: `48px repeat(${TOTAL_HOURS}, minmax(20px, 1fr))`,
						minWidth: 480,
					}}
				>
					<div />

					{HOURS.map((hour) => (
						<div
							className="text-center text-secondary"
							key={`h-${hour}`}
							style={{paddingBottom: 4}}
						>
							{hour % HOUR_LABEL_INTERVAL === 0 ? hour : ''}
						</div>
					))}

					{DAY_ORDER.map((dayIdx) => (
						<React.Fragment key={`d-${dayIdx}`}>
							<div
								className="text-secondary"
								style={{
									alignItems: 'center',
									display: 'flex',
									paddingRight: 8,
								}}
							>
								{DAY_SHORT_LABELS[dayIdx]}
							</div>

							{HOURS.map((hour) => {
								const value = grid[dayIdx][hour];
								const intensity = max ? value / max : 0;
								const background =
									value === 0
										? 'rgba(0, 0, 0, 0.04)'
										: `rgba(${baseColorRgb}, ${Math.max(
												0.08,
												intensity
										  )})`;
								const tooltip = `${DAY_FULL_LABELS[dayIdx]} · ${formatHour(
									hour
								)} — ${toThousands(value)} ${metricLabel}`;

								return (
									<div
										key={`c-${dayIdx}-${hour}`}
										style={{
											background,
											borderRadius: 2,
											height: CELL_HEIGHT,
										}}
										title={tooltip}
									/>
								);
							})}
						</React.Fragment>
					))}
				</div>
			</div>
		</div>
	);
};

export default TrafficHeatmap;
