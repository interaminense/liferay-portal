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
export declare function useFormatItems<T extends Item>(
	items: T[],
	propertyName: string,
	columns: Array<keyof T>
): TFormattedItem[];

/**
 * Hook to check if all items are selected
 */
export declare function useCheckAllSelectedItems<T extends Item>(
	items: T[]
): boolean;

/**
 * Function to toggle channelName in a specific item
 */
export declare function toggleChannelName<T extends Item>({
	index,
	items,
	propertyName,
}: {
	index: number;
	items: T[];
	propertyName: string;
}): T[];

/**
 * Function to enable/disable items based on allChecked property
 */
export declare function changeItemsBasedOnAllChecked<T extends Item>({
	allChecked,
	enableCheckboxs,
	items,
	propertyName,
}: {
	allChecked: boolean;
	enableCheckboxs?: boolean;
	items: T[];
	propertyName: string;
}): T[];
export {};
