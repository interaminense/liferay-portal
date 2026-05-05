/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {PageAssetMetric} from '../../lib/analytics';
import {useChartPalette} from '../../lib/chart-palette';
import {formatNumber, formatPercentage} from '../../lib/charts';

export type TopPagesValueFormat = 'number' | 'percentage';

export interface TopPagesListIProps {
	format: TopPagesValueFormat;
	getValue: (entry: PageAssetMetric) => number;
	pages: PageAssetMetric[];
}

interface NormalizedRow {
	href: string | null;
	subtitle: string;
	title: string;
	value: number;
}

const ROW_HEIGHT = 48;
const CLASSNAME = 'analytics-top-pages-list';

const formatValue = (value: number, format: TopPagesValueFormat) => {
	if (format === 'percentage') {
		return formatPercentage(value);
	}

	return formatNumber(value);
};

const firstUrl = (urls: PageAssetMetric['urls']): string | null => {
	if (!urls?.length) {
		return null;
	}

	const found = urls.find(
		(value): value is string => typeof value === 'string' && value.length > 0
	);

	return found ?? null;
};

export const TopPagesList: React.FC<TopPagesListIProps> = ({
	format,
	getValue,
	pages,
}) => {
	const palette = useChartPalette();
	const barColor = palette[0];

	const rows = useMemo<NormalizedRow[]>(
		() =>
			pages.map((entry) => {
				const url = firstUrl(entry.urls);
				const title = entry.assetTitle?.trim() || url || '—';
				const subtitle = url && url !== title ? url : '';

				return {
					href: url,
					subtitle,
					title,
					value: getValue(entry),
				};
			}),
		[getValue, pages]
	);

	const scaleMax = useMemo(
		() => rows.reduce((max, row) => Math.max(max, row.value), 0),
		[rows]
	);

	return (
		<div className={CLASSNAME}>
			<div style={{display: 'grid', gap: 6}}>
				{rows.map((row, index) => {
					const percentage = scaleMax
						? Math.max(2, (row.value / scaleMax) * 100)
						: 0;

					const Wrapper = row.href ? 'a' : 'div';
					const wrapperProps = row.href
						? {
								href: row.href,
								rel: 'noopener noreferrer',
								target: '_blank',
								title: row.href,
							}
						: {title: row.title};

					return (
						<Wrapper
							key={`${index}-${row.title}`}
							{...wrapperProps}
							style={{
								alignItems: 'center',
								color: 'inherit',
								display: 'grid',
								gap: 12,
								gridTemplateColumns:
									'minmax(140px, 35%) 1fr 70px',
								height: ROW_HEIGHT,
								textDecoration: 'none',
							}}
						>
							<div style={{minWidth: 0}}>
								<div
									className="text-truncate"
									style={{
										color: row.href
											? barColor
											: '#272833',
										fontSize: 13,
										fontWeight: 600,
									}}
								>
									{row.title}
								</div>

								{row.subtitle && (
									<div
										className="text-secondary text-truncate"
										style={{fontSize: 11}}
									>
										{row.subtitle}
									</div>
								)}
							</div>

							<div
								style={{
									background: 'rgba(0, 0, 0, 0.04)',
									borderRadius: 4,
									height: 12,
									overflow: 'hidden',
									position: 'relative',
								}}
							>
								<div
									style={{
										background: barColor,
										borderRadius: 4,
										height: '100%',
										width: `${percentage}%`,
									}}
								/>
							</div>

							<div
								className="font-weight-semi-bold text-right"
								style={{fontSize: 13}}
							>
								{formatValue(row.value, format)}
							</div>
						</Wrapper>
					);
				})}
			</div>
		</div>
	);
};

export default TopPagesList;
