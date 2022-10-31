/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import request from './request';

export function fetchConnection(token: string) {
	return request('/data-sources', {
		body: JSON.stringify({
			token,
		}),
		method: 'POST',
	});
}

export function deleteConnection() {
	return request('/data-sources', {method: 'DELETE'});
}

export function fetchProperties() {
	return request('/channels', {method: 'GET'});
}

export function createProperty(name: string) {
	return request('/channels', {
		body: JSON.stringify({
			name,
		}),
		method: 'POST',
	});
}

export function updateProperty({
	channelId,
	commerceChannelIds,
	dataSourceId,
	siteIds,
}: {
	channelId: string;
	commerceChannelIds: number[];
	dataSourceId: string;
	siteIds: number[];
}) {
	return request('/channels', {
		body: JSON.stringify({
			channelId,
			dataSources: [{commerceChannelIds, dataSourceId, siteIds}],
		}),
		method: 'PATCH',
	});
}

export function fetchChannels() {
	return request('/commerce-channels', {method: 'GET'});
}

export function fetchSites() {
	return request('/sites', {method: 'GET'});
}

// export function fetchMockedSites() {
// 	const items = [
// 		{
// 			id: '7961307173093376',
// 			name: 'Isabella Simpson',
// 		},
// 		{
// 			id: '7832205885702144',
// 			name: 'Shawn Howell',
// 		},
// 		{
// 			id: '7732418901442560',
// 			name: 'Alice Lowe',
// 		},
// 		{
// 			id: '6531634824216576',
// 			name: 'Clara Colon',
// 		},
// 		{
// 			channelName: 'SA',
// 			id: '7989042842959872',
// 			name: 'Jessie Wells',
// 		},
// 	];

// 	return Promise.resolve({
// 		items,
// 		page: 1,
// 		pageSize: 20,
// 		totalCount: items.length,
// 	});
// }

// export function fetchMockedChannels() {
// 	const items = [
// 		{
// 			id: '7961307173093376',
// 			name: 'Isabella Simpson',
// 		},
// 		{
// 			id: '7832205885702144',
// 			name: 'Shawn Howell',
// 		},
// 		{
// 			id: '7732418901442560',
// 			name: 'Alice Lowe',
// 		},
// 		{
// 			id: '6531634824216576',
// 			name: 'Clara Colon',
// 		},
// 		{
// 			id: '7989042842959872',
// 			name: 'Jessie Wells',
// 		},
// 		{
// 			id: '6449278788567040',
// 			name: 'Florence Hale',
// 		},
// 		{
// 			id: '3720906014720000',
// 			name: 'Mamie Lowe',
// 		},
// 		{
// 			id: '4383168540966912',
// 			name: 'Ivan Marshall',
// 			siteName: 'MW',
// 		},
// 		{
// 			id: '2544839214235648',
// 			name: 'Lillie Rose',
// 			siteName: 'NR',
// 		},
// 	];

// 	return Promise.resolve({
// 		items,
// 		page: 1,
// 		pageSize: 20,
// 		totalCount: items.length,
// 	});
// }
