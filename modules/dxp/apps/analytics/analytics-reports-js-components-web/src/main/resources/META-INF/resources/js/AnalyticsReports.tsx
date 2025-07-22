/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import GlobalFilters from './components/GlobalFilters';
import OverviewMetrics from './components/OverviewMetrics';
import CheckPermissions from './components/content-dashboard/CheckPermissions';
import InteractionsByPage from './components/interactions-by-page/InteractionsByPage';
import Technology from './components/technology/Technology';
import VisitorsBehavior from './components/visitors-behavior/VisitorsBehavior';

import '../css/analytics-reports.scss';

interface AnalyticsReports {
	contentPerformanceDataFetchURL: string;
	getItemVersionsURL: string;
}

const AnalyticsReports: React.FC<AnalyticsReports> = ({
	contentPerformanceDataFetchURL,
	getItemVersionsURL,
}) => {
	return (
		<div className="analytics-reports">
			<CheckPermissions
				contentPerformanceDataFetchURL={contentPerformanceDataFetchURL}
				getItemVersionsURL={getItemVersionsURL}
			>
				<GlobalFilters />

				<OverviewMetrics />

				<VisitorsBehavior />

				<InteractionsByPage />

				<Technology />
			</CheckPermissions>
		</div>
	);
};

export default AnalyticsReports;
