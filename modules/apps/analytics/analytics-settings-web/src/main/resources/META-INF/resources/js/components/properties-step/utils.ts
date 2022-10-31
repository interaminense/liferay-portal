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

import {useEffect, useMemo, useState} from 'react';

interface Item {
	channelName?: string;
	id: string;
}

interface TFormattedItem {
	checked: boolean;
	columns: any[];
	disabled: boolean;
	id: string;
}

/**
 * Hook to format items
 */
export function useFormatItems<T extends Item>(
	items: T[],
	propertyName: string,
	columns: Array<keyof T>
): TFormattedItem[] {
	const formattedItems: TFormattedItem[] = useMemo(
		() =>
			items.map((item) => ({
				checked: !!item.channelName,
				columns: columns.map((column) => item?.[column] ?? ''),
				disabled: !!(
					item.channelName && item.channelName !== propertyName
				),
				id: item.id,
			})),
		[columns, items, propertyName]
	);

	return formattedItems;
}

/**
 * Hook to check if all items are selected
 */
export function useCheckAllSelectedItems<T extends Item>(items: T[]): boolean {
	const [allSelectedItems, setAllSelectedItems] = useState(false);

	useEffect(() => {
		setAllSelectedItems(
			!!items.length && items.every((item: T) => item.channelName)
		);
	}, [items]);

	return allSelectedItems;
}

/**
 * Function to toggle channelName in a specific item
 */
export function toggleChannelName<T extends Item>({
	index,
	items,
	propertyName,
}: {
	index: number;
	items: T[];
	propertyName: string;
}): T[] {
	const newItems = items;

	if (newItems[index].channelName) {
		delete newItems[index].channelName;
	} else {
		newItems[index].channelName = propertyName;
	}

	return [...newItems];
}

/**
 * Function to enable/disable items based on allChecked property
 */
export function changeItemsBasedOnAllChecked<T extends Item>({
	allChecked,
	enableCheckboxs = true,
	items,
	propertyName,
}: {
	allChecked: boolean;
	enableCheckboxs?: boolean;
	items: T[];
	propertyName: string;
}): T[] {
	const newItems = items.map((item: T) => {
		// Checks if the item is associated with a channel name
		// that does not belong to the current property

		const belongsTotheCurrentProperty = !!(
			item.channelName && item.channelName === propertyName
		);

		if (
			(belongsTotheCurrentProperty || !item.channelName) &&
			enableCheckboxs
		) {
			if (allChecked) {
				return {...item, channelName: propertyName};
			} else {
				if (item.channelName) {
					delete item.channelName;
				}

				return item;
			}
		}

		return item;
	});

	return newItems;
}
