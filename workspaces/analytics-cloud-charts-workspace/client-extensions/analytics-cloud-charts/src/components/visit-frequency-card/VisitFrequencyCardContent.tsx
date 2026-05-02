/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import React from 'react';

import {VisitFrequencyBag} from '../../lib/analytics';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {VisitFrequencyHistogram} from '../charts/VisitFrequencyHistogram';

export interface VisitFrequencyCardContentIProps {
	bag: VisitFrequencyBag | null;
}

export const VisitFrequencyCardContent: React.FC<
	VisitFrequencyCardContentIProps
> = ({bag}) => {
	const buckets = bag?.visitFrequency ?? [];
	const total = bag?.total ?? 0;

	if (
		!buckets.length ||
		buckets.every((entry) => (entry.count ?? 0) === 0)
	) {
		return (
			<ClayEmptyState
				description="There is no visit frequency data for the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	return <VisitFrequencyHistogram buckets={buckets} total={total} />;
};

export default VisitFrequencyCardContent;
