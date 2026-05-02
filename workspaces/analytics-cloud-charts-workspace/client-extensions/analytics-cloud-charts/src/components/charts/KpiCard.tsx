/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import classNames from 'classnames';
import React, {useId, useMemo} from 'react';
import {Area, AreaChart, ResponsiveContainer} from 'recharts';

import {HistogramMetric} from '../../lib/analytics';

export type KpiCardFormat = 'duration' | 'number' | 'percentage';

export interface KpiCardIProps {
	color: string;
	format: KpiCardFormat;
	formatValue: (value: number | null | undefined) => string;
	histogram?: HistogramMetric[] | null;
	label: string;
	trendClassification?: string | null;
	trendPercentage?: number | null;
	value: number | null | undefined;
}

const trendColor = (classification: string | null | undefined) => {
	if (classification === 'positive') {
		return 'text-success';
	}

	if (classification === 'negative') {
		return 'text-danger';
	}

	return 'text-secondary';
};

interface SparklineDatum {
	previousValue: number | null;
	value: number;
}

const PREVIOUS_COLOR = '#9CA0B0';

export const KpiCard: React.FC<KpiCardIProps> = ({
	color,
	formatValue,
	histogram,
	label,
	trendClassification,
	trendPercentage,
	value,
}) => {
	const reactId = useId();
	const gradientId = `kpi-gradient-${reactId.replace(/:/g, '')}`;

	const sparklineData = useMemo<SparklineDatum[]>(() => {
		const items = histogram ?? [];

		return items.map((entry) => ({
			previousValue: entry.previousValue ?? null,
			value: entry.value ?? 0,
		}));
	}, [histogram]);

	const hasPrevious = sparklineData.some(
		(entry) => entry.previousValue != null
	);

	const trendArrow =
		trendPercentage == null ? null : trendPercentage >= 0 ? '↑' : '↓';

	return (
		<div
			style={{
				background: '#fff',
				border: '1px solid #e7e7ed',
				borderRadius: 6,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				minHeight: 132,
				padding: '12px 14px',
			}}
		>
			<div>
				<div
					className="text-secondary"
					style={{
						fontSize: 12,
						letterSpacing: '0.02em',
						textTransform: 'uppercase',
					}}
				>
					{label}
				</div>

				<div
					className="font-weight-semi-bold mt-1"
					style={{fontSize: 22, lineHeight: 1.1}}
				>
					{formatValue(value)}
				</div>

				{trendPercentage != null && (
					<div
						className={classNames(
							trendColor(trendClassification),
							'mt-1'
						)}
						style={{fontSize: 12}}
					>
						{trendArrow}{' '}
						{Math.abs(trendPercentage).toFixed(1)}% vs previous
					</div>
				)}
			</div>

			<div style={{height: 40, marginTop: 8}}>
				{sparklineData.length > 1 ? (
					<ResponsiveContainer height="100%" width="100%">
						<AreaChart data={sparklineData}>
							<defs>
								<linearGradient
									id={gradientId}
									x1="0"
									x2="0"
									y1="0"
									y2="1"
								>
									<stop
										offset="0%"
										stopColor={color}
										stopOpacity={0.4}
									/>

									<stop
										offset="100%"
										stopColor={color}
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>

							{hasPrevious && (
								<Area
									dataKey="previousValue"
									fill="transparent"
									isAnimationActive={false}
									stroke={PREVIOUS_COLOR}
									strokeDasharray="3 3"
									strokeWidth={1}
									type="monotone"
								/>
							)}

							<Area
								dataKey="value"
								fill={`url(#${gradientId})`}
								isAnimationActive={false}
								stroke={color}
								strokeWidth={1.5}
								type="monotone"
							/>
						</AreaChart>
					</ResponsiveContainer>
				) : null}
			</div>
		</div>
	);
};

export default KpiCard;
