/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import React from 'react';

import {CompositionBag} from '../../lib/analytics';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {SearchTermsBar} from '../charts/SearchTermsBar';

export interface SearchTermsCardContentIProps {
	bag: CompositionBag | null;
}

export const SearchTermsCardContent: React.FC<SearchTermsCardContentIProps> = ({
	bag,
}) => {
	const compositions = bag?.compositions ?? [];

	if (!compositions.length) {
		return (
			<ClayEmptyState
				description="There are no search terms recorded for the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	return (
		<SearchTermsBar
			compositions={compositions}
			maxCount={bag?.maxCount ?? undefined}
		/>
	);
};

export default SearchTermsCardContent;
