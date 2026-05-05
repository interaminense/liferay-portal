/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useEffect, useState} from 'react';

import {RestErrorLike, restFetch} from '../lib/analytics';

interface ChannelDataSource {
	siteIds?: number[] | null;
}

interface ChannelEntry {
	channelId: string;
	dataSources?: ChannelDataSource[] | null;
}

interface ChannelsPage {
	items?: ChannelEntry[];
}

export interface UseChannelIdResult {
	data?: string;
	error: Error | null;
	loading: boolean;
}

export function useChannelId(): UseChannelIdResult {
	const [data, setData] = useState<string>();
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();

		(async () => {
			try {
				const groupIdRaw =
					window.themeDisplay?.getScopeGroupId?.() ?? '';

				const groupId = parseInt(groupIdRaw, 10);

				if (!groupId) {
					throw new Error(
						'themeDisplay.getScopeGroupId is unavailable'
					);
				}

				const json = await restFetch<ChannelsPage>(
					'/o/analytics-settings-rest/v1.0/channels?pageSize=200',
					{signal: controller.signal}
				);

				const channel = json?.items?.find((entry) =>
					entry.dataSources?.some((dataSource) =>
						dataSource.siteIds?.includes(groupId)
					)
				);

				if (!channel) {
					throw new Error(
						`No analytics channel found for site ${groupId}. Configure the site in Control Panel → Analytics Cloud.`
					);
				}

				setData(channel.channelId);
			}
			catch (caught) {
				if (caught instanceof Error && caught.name === 'AbortError') {
					return;
				}

				if (
					caught instanceof Error &&
					(caught as RestErrorLike).status === 403
				) {
					setError(
						new Error(
							'HTTP 403 — current user lacks permission to read /analytics-settings-rest/channels (admin role required)'
						)
					);
				}
				else {
					setError(
						caught instanceof Error
							? caught
							: new Error(String(caught))
					);
				}
			}
			finally {
				setLoading(false);
			}
		})();

		return () => controller.abort();
	}, []);

	return {data, error, loading};
}
