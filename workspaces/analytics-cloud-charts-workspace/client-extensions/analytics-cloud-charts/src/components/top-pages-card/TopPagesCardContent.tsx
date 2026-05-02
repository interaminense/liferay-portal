/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import React from 'react';

import {AssetMetricBag, PageAssetMetric} from '../../lib/analytics';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {
	TopPagesList,
	TopPagesValueFormat,
} from '../charts/TopPagesList';

export interface TopPagesCardContentIProps {
	bag: AssetMetricBag | null;
	format: TopPagesValueFormat;
	getValue: (entry: PageAssetMetric) => number;
	tabLabel: string;
}

export const TopPagesCardContent: React.FC<TopPagesCardContentIProps> = ({
	bag,
	format,
	getValue,
	tabLabel,
}) => {
	const pages = bag?.assetMetrics ?? [];

	if (!pages.length) {
		return (
			<ClayEmptyState
				description={`No ${tabLabel.toLowerCase()} pages for the selected period.`}
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	return <TopPagesList format={format} getValue={getValue} pages={pages} />;
};

export default TopPagesCardContent;
