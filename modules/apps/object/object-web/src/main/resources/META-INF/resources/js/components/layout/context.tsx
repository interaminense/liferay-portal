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

import React, {createContext, useReducer} from 'react';

import {TObjectField} from './LayoutScreen/types';
import {TLayoutData} from './data';

type TState = {
	layoutData: TLayoutData;
	objectDefinitionId: string;
	objectFields: TObjectField[];
};

type TAction = {
	payload: {[key: string]: any};
	type: keyof typeof TYPES;
};

interface ILayoutContextProps extends Array<TState | Function> {
	0: typeof initialState;
	1: React.Dispatch<React.ReducerAction<React.Reducer<TState, TAction>>>;
}

const LayoutContext = createContext({} as ILayoutContextProps);

export const TYPES = {
	ADD_LAYOUT_DATA: 'ADD_LAYOUT_DATA',
	ADD_NEW_BLOCK: 'ADD_NEW_BLOCK',
	ADD_NEW_FIELD: 'ADD_NEW_FIELD',
	ADD_NEW_TAB: 'ADD_NEW_TAB',
	ADD_OBJECT_FIELDS: 'ADD_OBJECT_FIELDS',
	CHANGE_TOGGLE_COLLAPSIBLE: 'CHANGE_TOGGLE_COLLAPSIBLE',
	DELETE_BOX: 'DELETE_BOX',
	DELETE_FIELD: 'DELETE_FIELD',
	DELETE_TAB: 'DELETE_TAB',
} as const;

const initialState = {
	layoutData: {},
	objectDefinitionId: '',
	objectFields: [] as TObjectField[],
} as TState;

const layoutReducer = (state: TState, action: TAction) => {
	switch (action.type) {
		case TYPES.ADD_LAYOUT_DATA: {
			const {layoutData} = action.payload;

			return {
				...state,
				layoutData,
			};
		}
		case TYPES.ADD_NEW_TAB: {
			const {label, type} = action.payload;

			const newState = {...state};

			newState?.layoutData?.tabs?.push({
				boxs: [],
				label,
				type,
			});

			return newState;
		}
		case TYPES.ADD_NEW_BLOCK: {
			const {label, tabIndex} = action.payload;

			const newState = {...state};

			newState.layoutData.tabs[tabIndex].boxs.push({
				collapsible: false,
				label,
				rows: [],
			});

			return newState;
		}
		case TYPES.ADD_NEW_FIELD: {
			const {boxIndex, objectField, tabIndex} = action.payload;

			const newState = {...state};

			newState.layoutData.tabs[tabIndex].boxs[boxIndex].rows.push({
				columns: [
					{
						fields: [objectField],
					},
				],
			});

			return newState;
		}
		case TYPES.ADD_OBJECT_FIELDS: {
			const {objectFields} = action.payload;

			return {
				...state,
				objectFields,
			};
		}
		case TYPES.CHANGE_TOGGLE_COLLAPSIBLE: {
			const {boxIndex, collapsible, tabIndex} = action.payload;

			const newState = {...state};

			newState.layoutData.tabs[tabIndex].boxs[
				boxIndex
			].collapsible = collapsible;

			return newState;
		}
		case TYPES.DELETE_BOX: {
			const {boxIndex, tabIndex} = action.payload;

			const newState = {...state};

			newState.layoutData.tabs[tabIndex].boxs.splice(boxIndex, 1);

			return newState;
		}
		case TYPES.DELETE_FIELD: {
			const {boxIndex, rowIndex, tabIndex} = action.payload;

			const newState = {...state};

			// Delete a line because we only have one field per line.
			// In the future, we'll have drag and drop, so we'll just
			// need to implement field removal

			newState.layoutData.tabs[tabIndex].boxs[boxIndex].rows.splice(
				rowIndex,
				1
			);

			return newState;
		}
		case TYPES.DELETE_TAB: {
			const {tabIndex} = action.payload;

			const newState = {...state};

			newState.layoutData.tabs.splice(tabIndex, 1);

			return newState;
		}
		default:
			return state;
	}
};

interface ILayoutContextProviderProps
	extends React.HTMLAttributes<HTMLElement> {
	value: {
		objectDefinitionId: string;
	};
}

export const LayoutContextProvider: React.FC<ILayoutContextProviderProps> = ({
	children,
	value,
}) => {
	const [state, dispatch] = useReducer(layoutReducer, {
		...initialState,
		...value,
	});

	return (
		<LayoutContext.Provider value={[state, dispatch]}>
			{children}
		</LayoutContext.Provider>
	);
};

export default LayoutContext;
