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
import {TObjectField} from './LayoutScreen/types';
import {TLayoutData} from './data';
declare type TState = {
	layoutData: TLayoutData;
	objectDefinitionId: string;
	objectFields: TObjectField[];
};
declare type TAction = {
	payload: {
		[key: string]: any;
	};
	type: keyof typeof TYPES;
};
interface ILayoutContextProps extends Array<TState | Function> {
	0: typeof initialState;
	1: React.Dispatch<React.ReducerAction<React.Reducer<TState, TAction>>>;
}
declare const LayoutContext: React.Context<ILayoutContextProps>;
export declare const TYPES: {
	readonly ADD_LAYOUT_DATA: 'ADD_LAYOUT_DATA';
	readonly ADD_NEW_BLOCK: 'ADD_NEW_BLOCK';
	readonly ADD_NEW_FIELD: 'ADD_NEW_FIELD';
	readonly ADD_NEW_TAB: 'ADD_NEW_TAB';
	readonly ADD_OBJECT_FIELDS: 'ADD_OBJECT_FIELDS';
	readonly CHANGE_TOGGLE_COLLAPSIBLE: 'CHANGE_TOGGLE_COLLAPSIBLE';
	readonly DELETE_BOX: 'DELETE_BOX';
	readonly DELETE_FIELD: 'DELETE_FIELD';
	readonly DELETE_TAB: 'DELETE_TAB';
};
declare const initialState: TState;
interface ILayoutContextProviderProps
	extends React.HTMLAttributes<HTMLElement> {
	value: {
		objectDefinitionId: string;
	};
}
export declare const LayoutContextProvider: React.FC<ILayoutContextProviderProps>;
export default LayoutContext;
