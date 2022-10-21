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

import {fetchChannels} from '../../utils/api';
import ComposedTable from '../ComposedTable';
import {TProperty} from './PropertiesTable';
import {
	syncItemsWithDisabledProperty,
	updateItemsWithChannelName,
	useCheckSelectedAllItems,
} from './utils';

export type TData = {
	channelName?: string;
	id: string;
	name: string;
	siteName: string;
};

interface IChannelTabProps {
	description?: string;
	displayChannels?: boolean;
	property: TProperty;
}

const ChannelTab: React.FC<IChannelTabProps> = ({
	displayChannels,
	property,
}) => {
	const [items, setItems] = useState<TData[]>([]);

	useEffect(() => {
		const request = async () => {
			const response = await fetchChannels();
			setItems(response.items);
		};
		request();
	}, []);

	const selectedAllItems = useCheckSelectedAllItems<TData>(items);

	return (
		<ComposedTable
			allItemsChecked={selectedAllItems}
			headerColumns={[
				{
					expanded: true,
					label: Liferay.Language.get('channel-name'),
				},
				{
					expanded: true,
					label: Liferay.Language.get('related-site'),
				},
				{
					expanded: true,
					label: Liferay.Language.get('assigned-property'),
				},
			]}
			items={items.map(({channelName, id, name, siteName}) => ({
				checked: !!channelName,
				columns: [name, siteName, channelName || ''],
				disabled: !!channelName && channelName !== property.name,
				id,
			}))}
			onChangeFilterOrder={(selectedFilter) => {
				// eslint-disable-next-line no-console
				console.log('filter clicked', selectedFilter);
			}}
			onCheckboxItemChange={(index: number) => {
				setItems(
					updateItemsWithChannelName({
						index,
						items,
						propertyName: property.name,
					})
				);
			}}
			onSelectAllItems={(checked: boolean) => {
				setItems(
					syncItemsWithDisabledProperty<TData>({
						checked,
						displayChannels,
						items,
						propertyName: property.name,
					})
				);
			}}
			tableDisabled={!displayChannels}
		/>
	);
};

export default ChannelTab;
