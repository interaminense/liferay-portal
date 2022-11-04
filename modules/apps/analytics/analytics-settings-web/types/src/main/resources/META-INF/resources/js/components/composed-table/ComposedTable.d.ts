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

import React from 'react';
export declare type TColumn = {
	expanded: boolean;
	label: string;
	sortable?: boolean;
	value: string;
};
export declare type TItem = {
	checked: boolean;
	columns: string[];
	disabled: boolean;
	id: string;
};
interface IComposedTableProps {
	columns: TColumn[];
	disabled?: boolean;
	emptyStateTitle: string;
	fetchFn: (queryString: string) => Promise<any>;
	mapperItems: (items: any) => TItem[];
	onItemsChange?: (items: TItem[]) => void;
}
declare const ComposedTableWrapper: React.FC<IComposedTableProps>;
export default ComposedTableWrapper;
