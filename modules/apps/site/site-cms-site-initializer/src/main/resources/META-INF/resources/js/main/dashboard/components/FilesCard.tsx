/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {sub} from 'frontend-js-web';
import React, {useState} from 'react';

import {ActionsDropdown} from './ActionsDropdown';
import {BaseCard} from './BaseCard';
import {ContentAndFilesCard, TrendClassification} from './ContentAndFilesCard';
import {RangeSelectors, RangeSelectorsDropdown} from './RangeSelectorsDropdown';

export function FilesCard() {
	const [rangeSelector, setRangeSelector] = useState(
		RangeSelectors.Last7Days
	);
	const [action, setAction] = useState('');
	
	// eslint-disable-next-line no-console
	console.log({action, rangeSelector});
	

	return (
		<BaseCard
			Preferences={
				<>
					<RangeSelectorsDropdown
						activeRangeSelector={rangeSelector}
						className="mr-3"
						onChange={setRangeSelector}
					/>

					<ActionsDropdown
						items={[
							{
								icon: 'catalog',
								label: Liferay.Language.get('view-new-files'),
								value: 'viewNewFiles',
							},
						]}
						onChange={setAction}
					/>
				</>
			}
			description={Liferay.Language.get(
				'total-number-of-files-created-in-your-spaces'
			)}
			title={Liferay.Language.get('files')}
		>
			<ContentAndFilesCard
				categories={12}
				tags={32}
				title={sub(Liferay.Language.get('x-new-files'), [6])}
				trend={{
					classification: TrendClassification.Positive,
					percentage: 22.8,
				}}
				vocabularies={23}
			/>
		</BaseCard>
	);
}
