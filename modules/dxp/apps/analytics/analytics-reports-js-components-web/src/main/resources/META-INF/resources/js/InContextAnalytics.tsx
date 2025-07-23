/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {ContextProvider} from './Context';
import {CheckPermissions} from './components/cms/CheckPermissions';
import {Metrics} from './components/cms/Metrics';
import {CurrentVsPrevious} from './components/cms/current-vs-previous/CurrentVsPrevious';

import '../css/in-context-analytics.scss';
import {AssetTypes} from './types/global';

export interface IInContextAnalyticsProps
	extends React.HTMLAttributes<HTMLElement> {
	assetId?: number | null;
	spaceId?: number | null;
}

const InContextAnalytics: React.FC<IInContextAnalyticsProps> = ({assetId}) => {
	return (
		<div className="in-context-analytics">
			<CheckPermissions>
				<ContextProvider
					assetId={String(assetId ?? 0)}
					assetType={AssetTypes.Undefined}
					groupId="0"
				>
					<Metrics />

					<CurrentVsPrevious />
				</ContextProvider>
			</CheckPermissions>
		</div>
	);
};

export default InContextAnalytics;
