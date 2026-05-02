/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import React from 'react';

import {IndividualMetric} from '../../lib/analytics';
import {formatNumber} from '../../lib/charts';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';

export interface AudienceCompositionCardContentIProps {
	metric: IndividualMetric | null;
}

const computeDelta = (
	current: number | null | undefined,
	previous: number | null | undefined
): number | null => {
	if (current == null || previous == null || previous === 0) {
		return null;
	}

	return ((current - previous) / previous) * 100;
};

export const AudienceCompositionCardContent: React.FC<
	AudienceCompositionCardContentIProps
> = ({metric}) => {
	const totalValue = metric?.totalIndividualsMetric?.value ?? null;
	const totalPrevious =
		metric?.totalIndividualsMetric?.previousValue ?? null;
	const knownValue = metric?.knownIndividualsMetric?.value ?? 0;
	const anonymousValue =
		totalValue != null ? Math.max(0, totalValue - knownValue) : 0;

	const totalDelta = computeDelta(totalValue, totalPrevious);

	if (totalValue == null) {
		return (
			<ClayEmptyState
				description="There are no individuals to count for the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	const trendArrow =
		totalDelta == null ? null : totalDelta >= 0 ? '↑' : '↓';
	const trendClass =
		totalDelta == null
			? 'text-secondary'
			: totalDelta >= 0
				? 'text-success'
				: 'text-danger';

	return (
		<div
			className="d-flex flex-column align-items-center justify-content-center"
			style={{flex: 1, gap: 8, padding: '24px 0'}}
		>
			<span
				style={{
					color: '#272833',
					fontSize: 56,
					fontWeight: 700,
					lineHeight: 1,
				}}
			>
				{formatNumber(totalValue)}
			</span>

			<span className="text-secondary" style={{fontSize: 14}}>
				total individuals
			</span>

			{totalDelta != null && (
				<span className={trendClass} style={{fontSize: 13}}>
					{trendArrow} {Math.abs(totalDelta).toFixed(1)}% vs previous
					period
				</span>
			)}

			<div
				className="text-secondary"
				style={{fontSize: 14, marginTop: 12}}
			>
				<span style={{color: '#272833', fontWeight: 600}}>
					{formatNumber(knownValue)}
				</span>{' '}
				Known{' '}
				<span style={{color: '#cdd1d8', margin: '0 6px'}}>/</span>
				<span style={{color: '#272833', fontWeight: 600}}>
					{formatNumber(anonymousValue)}
				</span>{' '}
				Anonymous
			</div>
		</div>
	);
};

export default AudienceCompositionCardContent;
