/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {useEffect, useMemo} from 'react';

import {TimeRange} from '../../lib/analytics';
import {RangeKeyTimeRanges} from '../../lib/constants';
import {formatKey} from '../../lib/format';
import {RangeSelectors} from '../../lib/types';
import {Data} from './DropdownRangeKey';

export interface DropdownRangeKeyContentIProps {
	alignmentPosition?: number;
	data: Data;
	legacy: boolean;
	onRangeSelectorChange: (rangeSelectors: RangeSelectors) => void;
	rangeKeys?: Array<RangeKeyTimeRanges>;
	rangeSelectors?: RangeSelectors;
}

const toRangeSelectors = (timeRange: TimeRange): RangeSelectors => ({
	rangeEnd: timeRange.endLocalDateTime,
	rangeKey: timeRange.rangeKey ?? -1,
	rangeStart: timeRange.startLocalDateTime,
});

export const DropdownRangeKeyContent: React.FC<
	DropdownRangeKeyContentIProps
> = ({data, onRangeSelectorChange, rangeKeys, rangeSelectors}) => {
	const filteredRanges = useMemo(() => {
		if (!rangeKeys?.length) {
			return data.timeRange;
		}

		const allowed = new Set<string>(rangeKeys);

		return data.timeRange.filter(
			(timeRange) => timeRange.key && allowed.has(timeRange.key)
		);
	}, [data.timeRange, rangeKeys]);

	const initialRange = useMemo(() => {
		if (rangeSelectors) {
			return (
				data.timeRange.find(
					(timeRange) =>
						timeRange.rangeKey === rangeSelectors.rangeKey
				) ?? null
			);
		}

		return (
			filteredRanges.find((timeRange) => timeRange.default) ??
			filteredRanges[0] ??
			null
		);
	}, [data.timeRange, filteredRanges, rangeSelectors]);

	useEffect(() => {
		if (rangeSelectors || !initialRange) {
			return;
		}

		onRangeSelectorChange(toRangeSelectors(initialRange));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const selectedKey = useMemo(() => {
		if (rangeSelectors) {
			const match = data.timeRange.find(
				(timeRange) => timeRange.rangeKey === rangeSelectors.rangeKey
			);

			return match?.key ?? '';
		}

		return initialRange?.key ?? '';
	}, [data.timeRange, initialRange, rangeSelectors]);

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const next = data.timeRange.find(
			(timeRange) => timeRange.key === event.target.value
		);

		if (next) {
			onRangeSelectorChange(toRangeSelectors(next));
		}
	};

	return (
		<select
			className="form-control form-control-sm w-auto"
			onChange={handleChange}
			value={selectedKey}
		>
			{filteredRanges.map((timeRange) => (
				<option
					key={timeRange.key ?? ''}
					value={timeRange.key ?? ''}
				>
					{formatKey(timeRange.key)}
				</option>
			))}
		</select>
	);
};

export default DropdownRangeKeyContent;
