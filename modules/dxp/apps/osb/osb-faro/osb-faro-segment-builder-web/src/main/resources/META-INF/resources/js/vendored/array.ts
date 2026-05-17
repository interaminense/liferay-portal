/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export function insertAtIndex(items: any[], index: number, item: any): any[] {
	const beg = items.slice(0, index);
	const end = items.slice(index);

	return beg.concat(item, end);
}

export function removeAtIndex(items: any[], index: number): any[] {
	const beg = items.slice(0, index);
	const end = items.slice(index + 1);

	return beg.concat(end);
}

export function replaceAtIndex(list: any[], index: number, item: any): any[] {
	return Object.assign(list, {
		[index]: item,
	});
}

export function replaceWithMultipleAtIndex(
	items: any[],
	list: any[],
	index: number
): any[] {
	return [
		...list.slice(0, index),
		...items,
		...list.slice(index + 1, list.length),
	];
}
