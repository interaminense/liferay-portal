/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import React from 'react';

import {BaseCard} from './BaseCard';

export function ActivityStreamCard() {
	return (
		<BaseCard
			Preferences={
				<ClayButtonWithIcon
					aria-label={Liferay.Language.get('settings')}
					borderless
					displayType="secondary"
					size="sm"
					symbol="cog"
				/>
			}
			title={Liferay.Language.get('activity-stream')}
		>
			<div>content</div>
		</BaseCard>
	);
}
