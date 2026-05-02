/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import ClayTabs from '@clayui/tabs';
import React, {useState} from 'react';

import {Acquisitions, CompositionBag} from '../../lib/analytics';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {AcquisitionsDonut} from '../charts/AcquisitionsDonut';

export interface AcquisitionsCardContentIProps {
	acquisitions: Acquisitions | null;
}

interface AcquisitionTabDefinition {
	bag: (data: Acquisitions) => CompositionBag | null;
	label: string;
}

const TAB_DEFINITIONS: AcquisitionTabDefinition[] = [
	{bag: (data) => data.channel, label: 'Channel'},
	{bag: (data) => data.referrer, label: 'Referrer'},
	{bag: (data) => data.sourceMedium, label: 'Source/Medium'},
];

const hasBagData = (bag: CompositionBag | null | undefined) =>
	(bag?.compositions?.length ?? 0) > 0;

export const AcquisitionsCardContent: React.FC<
	AcquisitionsCardContentIProps
> = ({acquisitions}) => {
	const [activeIndex, setActiveIndex] = useState(0);

	const hasAnyData =
		!!acquisitions &&
		TAB_DEFINITIONS.some((definition) =>
			hasBagData(definition.bag(acquisitions))
		);

	if (!acquisitions || !hasAnyData) {
		return (
			<ClayEmptyState
				description="There are no acquisitions for the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	const activeDefinition = TAB_DEFINITIONS[activeIndex];
	const activeBag = activeDefinition.bag(acquisitions);
	const compositions = activeBag?.compositions ?? [];
	const total = activeBag?.total ?? 0;

	return (
		<>
			<ClayTabs active={activeIndex} onActiveChange={setActiveIndex}>
				{TAB_DEFINITIONS.map((definition, index) => (
					<ClayTabs.Item
						innerProps={{
							'aria-controls': `analytics-acquisitions-tab-${index}`,
						}}
						key={definition.label}
					>
						{definition.label}
					</ClayTabs.Item>
				))}
			</ClayTabs>

			<div className="flex-grow-1 mt-2">
				{hasBagData(activeBag) ? (
					<AcquisitionsDonut
						compositions={compositions}
						height={300}
						metricLabel="sessions"
						total={total}
					/>
				) : (
					<ClayEmptyState
						description={`No ${activeDefinition.label.toLowerCase()} data for the selected period.`}
						imgSrc={EMPTY_STATE_IMG_SRC}
						small
						title="No data"
					/>
				)}
			</div>
		</>
	);
};

export default AcquisitionsCardContent;
