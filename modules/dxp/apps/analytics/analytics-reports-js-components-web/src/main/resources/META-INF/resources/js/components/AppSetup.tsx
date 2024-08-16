/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayLink from '@clayui/link';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {fetch} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import EmptyState from './EmptyState';

interface IAppSetupProps extends React.HTMLAttributes<HTMLElement> {
	contentPerformanceDataFetchURL: string;
}

type Data = {
	analyticsSettingsPortletURL: string;
	connectedToAnalyticsCloud: boolean;
	connectedToAssetLibrary: boolean;
	depotAdminPortletURL: string;
	siteSyncedToAnalyticsCloud: boolean;
};

const AppSetup: React.FC<IAppSetupProps> = ({
	children,
	contentPerformanceDataFetchURL,
}) => {
	const [data, setData] = useState<Data | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			const response = await fetch(contentPerformanceDataFetchURL, {
				method: 'GET',
			});

			const data = await response.json();

			setLoading(false);
			setData(data);
		}

		fetchData();
	}, [contentPerformanceDataFetchURL]);

	if (loading) {
		return (
			<ClayLoadingIndicator
				displayType="primary"
				shape="squares"
				size="md"
			/>
		);
	}

	if (data && !data.connectedToAnalyticsCloud) {
		return (
			<EmptyState
				description={Liferay.Language.get(
					'in-order-to-view-asset-performance,-your-liferay-dxp-instance-has-to-be-connected-with-liferay-analytics-cloud'
				)}
				title={Liferay.Language.get(
					'connect-to-liferay-analytics-cloud'
				)}
			>
				<ClayLink
					button
					displayType="secondary"
					href={data.analyticsSettingsPortletURL}
				>
					{Liferay.Language.get('connect')}
				</ClayLink>
			</EmptyState>
		);
	}

	if (data && !data.siteSyncedToAnalyticsCloud) {
		return (
			<EmptyState
				description={Liferay.Language.get(
					'in-order-to-view-asset-performance,-your-sites-have-to-be-synced-to-liferay-analytics-cloud'
				)}
				title={Liferay.Language.get('sync-to-analytics-cloud')}
			>
				<ClayLink
					button
					displayType="secondary"
					href={`${data.analyticsSettingsPortletURL}&currentPage=PROPERTIES`}
				>
					{Liferay.Language.get('sync')}
				</ClayLink>
			</EmptyState>
		);
	}

	if (
		data &&
		!data.siteSyncedToAnalyticsCloud &&
		!data.connectedToAssetLibrary
	) {
		return (
			<EmptyState
				description={Liferay.Language.get(
					'in-order-to-view-asset-performance,-connect-sites-that-are-synced-to-analytics-cloud-to-your-asset-library'
				)}
				title={Liferay.Language.get(
					'there-are-no-sites-connected-to-this-asset-library'
				)}
			>
				<ClayButton displayType="secondary">
					{Liferay.Language.get('connect')}
				</ClayButton>
			</EmptyState>
		);
	}

	return <>{children}</>;
};

export default AppSetup;
