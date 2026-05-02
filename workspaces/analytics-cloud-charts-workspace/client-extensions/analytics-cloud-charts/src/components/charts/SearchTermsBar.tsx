/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useMemo} from 'react';

import {Composition} from '../../lib/analytics';
import {useChartPalette} from '../../lib/chart-palette';
import {toThousands} from '../../lib/charts';

export interface SearchTermsBarIProps {
	compositions: Composition[];
	maxCount?: number;
	topN?: number;
}

interface NormalizedRow {
	count: number;
	name: string;
}

const CLASSNAME = 'analytics-search-terms-bar';
const ROW_HEIGHT = 28;
const DEFAULT_TOP_N = 10;

export const SearchTermsBar: React.FC<SearchTermsBarIProps> = ({
	compositions,
	maxCount,
	topN = DEFAULT_TOP_N,
}) => {
	const rows = useMemo<NormalizedRow[]>(
		() =>
			compositions
				.slice(0, topN)
				.map((entry) => ({
					count: entry.count ?? 0,
					name: entry.name?.trim() || '—',
				})),
		[compositions, topN]
	);

	const scaleMax = useMemo(() => {
		if (maxCount && maxCount > 0) {
			return maxCount;
		}

		return rows.reduce((max, row) => Math.max(max, row.count), 0);
	}, [maxCount, rows]);

	const palette = useChartPalette();
	const barColor = palette[0];

	return (
		<div className={CLASSNAME}>
			<div
				style={{
					display: 'grid',
					gap: 6,
				}}
			>
				{rows.map((row, index) => {
					const percentage = scaleMax
						? Math.max(2, (row.count / scaleMax) * 100)
						: 0;

					return (
						<div
							key={`${index}-${row.name}`}
							style={{
								alignItems: 'center',
								display: 'grid',
								gap: 12,
								gridTemplateColumns: 'minmax(80px, 30%) 1fr 60px',
								height: ROW_HEIGHT,
							}}
							title={`${row.name} — ${toThousands(row.count)}`}
						>
							<div
								className="text-truncate"
								style={{fontSize: 13}}
							>
								{row.name}
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
								{toThousands(row.count)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SearchTermsBar;
