/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import ClayTabs from '@clayui/tabs';
import React, {useMemo, useState} from 'react';

import {Metric} from '../../lib/analytics';
import {getPercentage} from '../../lib/charts';
import {EMPTY_STATE_IMG_SRC} from '../../lib/liferay';
import {
	OperatingSystem,
	OperatingSystemEntry,
} from '../charts/OperatingSystem';
import {WebBrowser, WebBrowserEntry} from '../charts/WebBrowser';

export interface DevicesCardContentIProps {
	viewsMetric: Metric | null;
}

const TAB_OS = 0;
const TAB_BROWSER = 1;

export const DevicesCardContent: React.FC<DevicesCardContentIProps> = ({
	viewsMetric,
}) => {
	const [activeTab, setActiveTab] = useState<number>(TAB_OS);

	const totalViews = viewsMetric?.value ?? 0;

	const devices = useMemo<OperatingSystemEntry[]>(() => {
		const list = viewsMetric?.device ?? [];

		const grandTotal = list.reduce(
			(sum, entry) => sum + (entry.value ?? 0),
			0
		);

		return list.map((entry) => {
			const totalForDevice = entry.value ?? 0;
			const subMetrics = entry.metrics ?? [];

			return {
				data: subMetrics.map((submetric) => ({
					percentage: getPercentage(
						submetric.value,
						totalForDevice
					),
					type: submetric.valueKey ?? '—',
					views: submetric.value ?? 0,
				})),
				label: entry.valueKey ?? '—',
				percentageOfTotal: getPercentage(
					totalForDevice,
					grandTotal
				),
				totalViews: totalForDevice,
			};
		});
	}, [viewsMetric]);

	const browsers = useMemo<WebBrowserEntry[]>(() => {
		const list = viewsMetric?.browser ?? [];

		return list.map((entry) => ({
			value: entry.value ?? 0,
			valueKey: entry.valueKey ?? '—',
		}));
	}, [viewsMetric]);

	const hasDevices = devices.length > 0;
	const hasBrowsers = browsers.length > 0;

	if (!viewsMetric || (!hasDevices && !hasBrowsers)) {
		return (
			<ClayEmptyState
				description="There are no views on the selected period."
				imgSrc={EMPTY_STATE_IMG_SRC}
				small
				title="No data"
			/>
		);
	}

	return (
		<>
			<ClayTabs active={activeTab} onActiveChange={setActiveTab}>
				<ClayTabs.Item
					innerProps={{
						'aria-controls': 'analytics-tabpanel-os',
					}}
				>
					Operating System
				</ClayTabs.Item>

				<ClayTabs.Item
					innerProps={{
						'aria-controls': 'analytics-tabpanel-browser',
					}}
				>
					Web Browser
				</ClayTabs.Item>
			</ClayTabs>

			<ClayTabs.Content active={activeTab} fade>
				<ClayTabs.TabPane
					aria-labelledby="analytics-tab-os"
					id="analytics-tabpanel-os"
				>
					{hasDevices ? (
						<OperatingSystem
							devices={devices}
							height={300}
							metricLabel="views"
						/>
					) : (
						<ClayEmptyState
							description="No operating system data for the selected period."
							imgSrc={EMPTY_STATE_IMG_SRC}
							small
							title="No data"
						/>
					)}
				</ClayTabs.TabPane>

				<ClayTabs.TabPane
					aria-labelledby="analytics-tab-browser"
					id="analytics-tabpanel-browser"
				>
					{hasBrowsers ? (
						<WebBrowser
							browsers={browsers}
							height={300}
							metricLabel="views"
							total={totalViews}
						/>
					) : (
						<ClayEmptyState
							description="No browser data for the selected period."
							imgSrc={EMPTY_STATE_IMG_SRC}
							small
							title="No data"
						/>
					)}
				</ClayTabs.TabPane>
			</ClayTabs.Content>
		</>
	);
};

export default DevicesCardContent;
