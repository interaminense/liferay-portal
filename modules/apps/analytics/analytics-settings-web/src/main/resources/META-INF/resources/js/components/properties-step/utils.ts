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

export function useSelectedAllItems(items: any) {
	const [selectedAllItems, setSelectedAllItems] = useState(false);

	useEffect(() => {
		setSelectedAllItems(items.every((item: any) => item.channelName));
	}, [items]);

	return selectedAllItems;
}

export function updateItems(items: any, index: number, propertyName: string) {
	const newItems = items;
	newItems[index].channelName
		? delete newItems[index].channelName
		: (newItems[index].channelName = propertyName);

	return [...newItems];
}

// TODO: Find better name for this FN

export function updateAvailableCheckboxesItem(
	checked: boolean,
	items: any,
	propertyName: string,
	displayChannels: boolean = false
) {
	const newItems = items.map((item: any) => {
		const disabled =
			(item.channelName && item.channelName !== propertyName) ||
			!displayChannels;

		if (disabled) {
			return item;
		} else {
			if (
				(checked && !item.channelName) ||
				(checked && item.channelName)
			) {
				return {...item, channelName: propertyName};
			} else {
				delete item.channelName;

				return item;
			}
		}
	});

	return newItems;
}
