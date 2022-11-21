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

import {Text} from '@clayui/core';
import React from 'react';

import {TQueries} from '../../utils/request';
import Table, {TColumn, TFormattedItems} from '../table/Table';
import {TProperty} from './Properties';

export type TRawItem = {
	channelName?: string;
	friendlyURL?: string;
	id: string;
	name: string;
	siteName: string;
};

interface ITabProps {
	columns: Array<keyof TRawItem>;
	description?: string;
	emptyStateTitle: string;
	enableCheckboxs?: boolean;
	fetchFn: (params: TQueries) => Promise<any>;
	header: TColumn[];
	noResultsTitle: string;
	onItemsChange: (items: TFormattedItems) => void;
	property: TProperty;
}

const Tab: React.FC<ITabProps> = ({
	columns,
	description,
	emptyStateTitle,
	enableCheckboxs = true,
	fetchFn,
	header,
	noResultsTitle,
	onItemsChange,
	property,
}) => (
	<>
		{description && (
			<div className="my-3 text-secondary">
				<Text size={3}>{description}</Text>
			</div>
		)}

		<Table
			columns={header}
			disabled={!enableCheckboxs}
			emptyStateTitle={emptyStateTitle}
			fetchFn={fetchFn}
			mapperItems={(items: TRawItem[]) => {
				return items.map((item) => ({
					checked: !!(
						item.channelName && item.channelName === property.name
					),
					columns: columns.map((column) => ({
						label: item?.[column] ?? '',
					})),
					disabled: !!(
						item.channelName && item.channelName !== property.name
					),
					id: item.id,
				}));
			}}
			noResultsTitle={noResultsTitle}
			onItemsChange={onItemsChange}
		/>
	</>
);

export default Tab;
