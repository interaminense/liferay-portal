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

import {TTableRequestParams} from '../../components/table/types';
import {serializeTableRequestParams} from '../../components/table/utils';
import request from '../request';

export const fetchPropertiesResponse = {
	actions: {},
	facets: [],
	items: [
		{
			channelId: '591043793166298694',
			commerceSyncEnabled: false,
			dataSources: [
				{
					commerceChannelIds: [],
					dataSourceId: '591043793057281573',
					siteIds: [],
				},
			],
			name: 'Liferay DXP',
		},
		{
			channelId: '507692450375472147',
			commerceSyncEnabled: false,
			dataSources: [
				{
					commerceChannelIds: [],
					dataSourceId: '507692450032087801',
					siteIds: [43811416, 82272606, 54804552, 10693199, 57390646],
				},
			],
			name: 'Beryl Commerce',
		},
	],
	lastPage: 1,
	page: 1,
	pageSize: 20,
	totalCount: 2,
};

export function fetchTableData(params: TTableRequestParams) {
	const queryString = serializeTableRequestParams(params);

	return request(`/table-data?${queryString}`, {method: 'GET'});
}

export const fetchTableDataResponse = {
	actions: {},
	facets: [],
	items: [
		{
			age: 19,
			firstName: 'Andre',
			id: '8189001028599808',
			lastName: 'Patton',
		},
		{
			age: 76,
			firstName: 'Jayden',
			id: '6317360201859072',
			lastName: 'Holloway',
		},
		{
			age: 63,
			firstName: 'Etta',
			id: '7304891437416448',
			lastName: 'Garrett',
		},
		{
			age: 21,
			firstName: 'Eugenia',
			id: '6979819478712320',
			lastName: 'Rios',
		},
		{
			age: 33,
			firstName: 'Earl',
			id: '8324407053254656',
			lastName: 'Medina',
		},
	],
	lastPage: 1,
	page: 1,
	pageSize: 20,
	totalCount: 5,
};
