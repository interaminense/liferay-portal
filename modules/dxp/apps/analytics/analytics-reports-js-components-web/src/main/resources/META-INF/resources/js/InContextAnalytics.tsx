/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import {AnalyticsReportsProvider} from './AnalyticsReportsContext';
import {CheckPermissions} from './components/cms/CheckPermissions';
import {Metrics} from './components/cms/Metrics';
import {MetricsChart} from './components/cms/MetricsChart';
import {ChartsAndTableView} from './components/cms/TableAndChartsView';

import '../css/in-context-analytics.scss';

export interface IInContextAnalyticsProps
	extends React.HTMLAttributes<HTMLElement> {
	asset?: {
		id: number;
		objectEntries?: {
			embedded: {
				scopeId: number;
			};
		}[];
	};
}

const InContextAnalytics: React.FC<IInContextAnalyticsProps> = ({asset}) => {
	return (
		<div className="in-context-analytics">
			<CheckPermissions assetId={asset?.id ?? 0}>
				<AnalyticsReportsProvider>
					<Metrics />

					<ChartsAndTableView
						chartsView={<MetricsChart />}
						tableView={<>Table!</>}
					/>
				</AnalyticsReportsProvider>
			</CheckPermissions>
		</div>
	);
};

export default InContextAnalytics;
