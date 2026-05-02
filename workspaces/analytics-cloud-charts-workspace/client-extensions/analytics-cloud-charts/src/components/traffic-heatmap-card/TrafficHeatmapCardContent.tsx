/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import React, {useMemo} from 'react';

import {HeatMapMetric} from '../../lib/analytics';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {TrafficHeatmap} from '../charts/TrafficHeatmap';

export interface TrafficHeatmapCardContentIProps {
	cells: HeatMapMetric[];
}

export const TrafficHeatmapCardContent: React.FC<
	TrafficHeatmapCardContentIProps
> = ({cells}) => {
	const total = useMemo(
		() => cells.reduce((sum, item) => sum + (item.value ?? 0), 0),
		[cells]
	);

	if (!cells.length || total === 0) {
		return (
			<ClayEmptyState
				description="There are no visitors to plot for the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	return <TrafficHeatmap cells={cells} metricLabel="visitors" />;
};

export default TrafficHeatmapCardContent;
