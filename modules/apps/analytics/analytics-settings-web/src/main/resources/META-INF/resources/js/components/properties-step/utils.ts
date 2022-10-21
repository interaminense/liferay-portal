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

import {useEffect, useState} from 'react';

interface Item {
	channelName?: string;
}

export function useCheckSelectedAllItems<T extends Item>(items: T[]) {
	const [selectedAllItems, setSelectedAllItems] = useState(false);

	useEffect(() => {
		setSelectedAllItems(items.every((item: T) => item.channelName));
	}, [items]);

	return selectedAllItems;
}

export function updateItemsWithChannelName<T extends Item>({
	index,
	items,
	propertyName,
}: {
	index: number;
	items: T[];
	propertyName: string;
}) {
	const newItems = items;

	if (newItems[index]?.channelName) {
		delete newItems[index].channelName;
	} else {
		newItems[index].channelName = propertyName;
	}

	return [...newItems];
}

export function syncItemsWithDisabledProperty<T extends Item>({
	checked,
	displayChannels,
	items,
	propertyName,
}: {
	checked: boolean;
	displayChannels?: boolean;
	items: T[];
	propertyName: string;
}) {
	const newItems = items.map((item: T) => {
		const disabled = item?.channelName !== propertyName || !displayChannels;

		if (disabled) {
			return item;
		} else {
			if (checked) {
				return {...item, channelName: propertyName};
			} else {
				delete item?.channelName;

				return item;
			}
		}
	});

	return newItems;
}
