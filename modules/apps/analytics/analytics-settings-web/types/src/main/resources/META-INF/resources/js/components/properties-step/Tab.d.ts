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

/// <reference types="react" />

import {TProperty} from '../../pages/wizard/PropertyStep';
import {TColumn} from '../ComposedTable';
export declare type TItem = {
	channelName?: string;
	friendlyURL?: string;
	id: string;
	name: string;
	siteName: string;
};
interface ITabProps {
	columns: Array<keyof TItem>;
	description?: string;
	emptyStateDescription: string;
	enableCheckboxs?: boolean;
	fetchFn: () => Promise<any>;
	header: TColumn[];
	onItemsChange: (items: TItem[]) => void;
	property: TProperty;
}
declare function Tab({
	columns,
	description,
	emptyStateDescription,
	enableCheckboxs,
	fetchFn,
	header,
	onItemsChange,
	property,
}: ITabProps): JSX.Element;
export default Tab;
