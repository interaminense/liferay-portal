/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {render} from '@testing-library/react';
import React from 'react';

import AnalyticsReports from '../../src/main/resources/META-INF/resources/js/AnalyticsReports';

describe('AnalyticsReports', () => {
	it('renders AnalyticsReports component', () => {
		const {getByText} = render(
			<AnalyticsReports
				contentPerformance={{
					analyticsSettingsPortletURL: '',
					connectedToAnalyticsCloud: true,
					connectedToAssetLibrary: true,
					depotAdminPortletURL: '',
					siteSyncedToAnalyticsCloud: true,
				}}
			/>
		);

		expect(getByText('Hello, world!')).toBeInTheDocument();
	});

	it('renders AnalyticsReports connected to Analytics Cloud empty state', () => {
		const {getByText} = render(
			<AnalyticsReports
				contentPerformance={{
					analyticsSettingsPortletURL: '',
					connectedToAnalyticsCloud: false,
					connectedToAssetLibrary: false,
					depotAdminPortletURL: '',
					siteSyncedToAnalyticsCloud: false,
				}}
			/>
		);

		expect(
			getByText('connect-to-liferay-analytics-cloud')
		).toBeInTheDocument();

		expect(
			getByText(
				'in-order-to-view-asset-performance,-your-liferay-dxp-instance-has-to-be-connected-with-liferay-analytics-cloud'
			)
		).toBeInTheDocument();

		expect(getByText('connect')).toBeInTheDocument();
	});

	it('renders AnalyticsReports sites Synced to Analytics Cloud empty state', () => {
		const {getByText} = render(
			<AnalyticsReports
				contentPerformance={{
					analyticsSettingsPortletURL: '',
					connectedToAnalyticsCloud: true,
					connectedToAssetLibrary: false,
					depotAdminPortletURL: '',
					siteSyncedToAnalyticsCloud: false,
				}}
			/>
		);

		expect(getByText('sync-to-analytics-cloud')).toBeInTheDocument();

		expect(
			getByText(
				'in-order-to-view-asset-performance,-your-sites-have-to-be-synced-to-liferay-analytics-cloud'
			)
		).toBeInTheDocument();

		expect(getByText('sync')).toBeInTheDocument();
	});

	it('renders AnalyticsReports connected to Asset Library empty state', () => {
		const {getByText} = render(
			<AnalyticsReports
				contentPerformance={{
					analyticsSettingsPortletURL: '',
					connectedToAnalyticsCloud: true,
					connectedToAssetLibrary: false,
					depotAdminPortletURL: '',
					siteSyncedToAnalyticsCloud: true,
				}}
			/>
		);

		expect(
			getByText('there-are-no-sites-connected-to-this-asset-library')
		).toBeInTheDocument();

		expect(
			getByText(
				'in-order-to-view-asset-performance,-connect-sites-that-are-synced-to-analytics-cloud-to-your-asset-library'
			)
		).toBeInTheDocument();

		expect(getByText('connect')).toBeInTheDocument();
	});
});
