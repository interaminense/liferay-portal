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

declare type TName = {
	[key: string]: string;
};
export declare type TObjectLayout = {
	id: number;
	name: TName;
	defaultObjectLayout: boolean;
	objectDefinitionId: number;
	objectLayoutTabs: TObjectLayoutTab[];
};
declare type TObjectLayoutTab = {
	id?: number;
	name: TName;
	objectLayoutBoxes: TObjectLayoutBox[];
	priority?: number;
};
declare type TObjectLayoutBox = {
	collapsable: boolean;
	id?: number;
	name: TName;
	objectLayoutRows: TObjectLayoutRow[];
	priority?: number;
};
declare type TObjectLayoutRow = {
	id?: number;
	priority?: number;
	objectLayoutColumns: TObjectLayoutColumn[];
};
declare type TObjectLayoutColumn = {
	id?: number;
	objectFieldId: number;
	priority?: number;
};
declare const objectLayout: TObjectLayout;
export default objectLayout;
