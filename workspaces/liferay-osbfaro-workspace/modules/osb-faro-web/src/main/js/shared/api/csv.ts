/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {CSVType} from 'shared/components/download-report/utils';
import sendRequest from 'shared/util/request';

export const fetchCSV = (url: string) => fetch(url);

export const fetchCount = ({
	groupId,
	type,
	...data
}: {
	assetId?: string;
	assetType?: string;
	channelId: string;
	fromDate?: string;
	groupId: string;
	individualId?: string;
	segmentId?: string;
	rangeKey?: string;
	toDate?: string;
	type: CSVType;
}) =>
	sendRequest({
		data,
		method: 'GET',
		path: `main/${groupId}/reports/export/csv/${type}/count`,
	});
