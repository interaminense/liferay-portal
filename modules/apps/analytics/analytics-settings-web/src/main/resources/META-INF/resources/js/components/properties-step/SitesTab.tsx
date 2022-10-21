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

import React, {useEffect, useState} from 'react';

import {fetchSites} from '../../utils/api';
import ComposedTable from '../ComposedTable';
import {TData} from '../TabsTemplate';
import {TProperty} from './PropertiesTable';
import {
	updateAvailableCheckboxesItem,
	updateItems,
	useSelectedAllItems,
} from './utils';

interface ISiteTabProps {
	description?: string;
	displayChannels: boolean;
	property: TProperty;
}

const SitesTab: React.FC<ISiteTabProps> = ({property}) => {
	const [items, setItems] = useState<TData>([]);

	useEffect(() => {
		const request = async () => {
			const response = await fetchSites();
			setItems(response.items);
		};
		request();
	}, []);

	const selectedAllItems = useSelectedAllItems(items);

	return (
		<ComposedTable
			allItemsChecked={selectedAllItems}
			headerColumns={[
				{
					expanded: true,
					label: Liferay.Language.get('site-name'),
				},
				{
					expanded: true,
					label: Liferay.Language.get('friendly-url'),
				},
				{
					expanded: true,
					label: Liferay.Language.get('assigned-property'),
				},
			]}
			items={items.map(({channelName, friendlyURL, id, name}) => ({
				checked: !!channelName,
				columns: [name, friendlyURL, channelName || ''],
				disabled: !!channelName && channelName !== property.name,
				id,
			}))}
			onChangeFilterOrder={(selectedFilter) => {
				// eslint-disable-next-line no-console
				console.log('filter clicked', selectedFilter);
			}}
			onCheckboxItemChange={(index: number) => {
				setItems(updateItems(items, index, property.name));
			}}
			onSelectAllItems={(checked: boolean) => {
				setItems(
					updateAvailableCheckboxesItem(checked, items, property.name)
				);
			}}
		/>
	);
};

export default SitesTab;
