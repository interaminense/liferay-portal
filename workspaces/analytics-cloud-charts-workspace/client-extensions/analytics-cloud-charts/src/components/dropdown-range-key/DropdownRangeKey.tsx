/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {useQuery} from '../../hooks/useQuery';
import {TIME_RANGE_QUERY, TimeRange} from '../../lib/analytics';
import {RangeKeyTimeRanges} from '../../lib/constants';
import {RangeSelectors} from '../../lib/types';
import ErrorDisplay from '../ErrorDisplay';
import StatesRenderer from '../states-renderer/StatesRenderer';
import {DropdownRangeKeyContent} from './DropdownRangeKeyContent';

export interface DropdownRangeKeyIProps
	extends React.HTMLAttributes<HTMLElement> {
	alignmentPosition?: number;
	legacy?: boolean;
	onRangeSelectorChange: (rangeSelectors: RangeSelectors) => void;
	rangeKeys?: Array<RangeKeyTimeRanges>;
	rangeSelectors?: RangeSelectors;
}

export type Data = {
	timeRange: TimeRange[];
};

export const DropdownRangeKey: React.FC<DropdownRangeKeyIProps> = ({
	alignmentPosition,
	legacy = false,
	onRangeSelectorChange,
	rangeKeys,
	rangeSelectors,
}) => {
	const {data, error, loading} = useQuery<Data>(TIME_RANGE_QUERY);

	return (
		<StatesRenderer error={!!error} loading={loading}>
			<StatesRenderer.Error apolloError={error}>
				<ErrorDisplay message={error?.message} />
			</StatesRenderer.Error>

			<StatesRenderer.Loading center={false} />

			<StatesRenderer.Success>
				{data && (
					<DropdownRangeKeyContent
						alignmentPosition={alignmentPosition}
						data={data}
						legacy={legacy}
						onRangeSelectorChange={onRangeSelectorChange}
						rangeKeys={rangeKeys}
						rangeSelectors={rangeSelectors}
					/>
				)}
			</StatesRenderer.Success>
		</StatesRenderer>
	);
};

export default DropdownRangeKey;
