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

import React, {createContext, useContext, useReducer} from 'react';

import {DEFAULT_FILTER, TFilter} from '../../utils/filter';
import {DEFAULT_PAGINATION, TPagination} from '../../utils/pagination';
import {TItem, TStorageItems} from './Table';

export enum Events {
	ChangeFilter = 'CHANGE_FILTER',
	ChangeItems = 'CHANGE_ITEMS',
	ChangeKeywords = 'CHANGE_KEYWORDS',
	ChangePagination = 'CHANGE_PAGINATION',
	FormatData = 'FORMAT_DATA',
	ToggleCheckbox = 'TOGGLE_CHECKBOX',
}

const initialState = {
	filter: DEFAULT_FILTER,
	globalChecked: false,
	internalKeywords: '',
	keywords: '',
	pagination: DEFAULT_PAGINATION,
	rows: [],
	storageItems: {},
};

type TState = {
	filter: TFilter;
	globalChecked: boolean;
	internalKeywords: string;
	keywords: string;
	pagination: TPagination;
	rows: string[];
	storageItems: TStorageItems;
};

const TableContextData = createContext<TState>(initialState);
const TableContextDispatch = createContext<any>(null);

const useData = () => useContext(TableContextData);
const useDispatch = () => useContext(TableContextDispatch);

const checkGlobalChecked = (storageItems: TStorageItems) =>
	!!Object.values(storageItems).every(({checked}) => checked);

function reducer(state: TState, action: {payload: any; type: Events}) {
	switch (action.type) {
		case Events.ChangeFilter: {
			return {
				...state,
				filter: {
					...state.filter,
					...action.payload,
				},
			};
		}
		case Events.ChangeItems: {
			const storageItems = {
				...state.storageItems,
				[action.payload]: {
					...state.storageItems[action.payload],
					checked: !state.storageItems[action.payload].checked,
				},
			};

			return {
				...state,
				globalChecked: checkGlobalChecked(storageItems),
				storageItems,
			};
		}
		case Events.ChangeKeywords: {
			return {
				...state,
				keywords: action.payload,
			};
		}
		case Events.FormatData: {
			const {items, page, pageSize, totalCount} = action.payload;

			const storageItems: TStorageItems = {
				...items.reduce((accumulator: {}, value: TItem) => {
					return {
						...accumulator,
						[value.id]: {
							...value,
							checked: state.globalChecked || value.checked,
						},
					};
				}, {}),
				...state.storageItems,
			};

			return {
				...state,
				globalChecked: checkGlobalChecked(storageItems),
				pagination: {
					page,
					pageSize,
					totalCount,
				},
				rows: items.map(({id}: TItem) => id),
				storageItems,
			};
		}
		case Events.ChangePagination: {
			return {
				...state,
				pagination: {
					...state.pagination,
					...action.payload,
				},
			};
		}
		case Events.ToggleCheckbox: {
			return {
				...state,
				globalChecked: action.payload,
				storageItems: Object.values(state.storageItems).reduce(
					(acc, item) => {
						// If the item is disabled, we must
						// not change the checked value.

						if (item.disabled) {
							return {
								...acc,
								[item.id]: item,
							};
						}

						return {
							...acc,
							[item.id]: {
								...item,
								checked: action.payload,
							},
						};
					},
					{}
				),
			};
		}

		default:
			throw new Error();
	}
}

const TableContext: React.FC = ({children}) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<TableContextData.Provider value={state}>
			<TableContextDispatch.Provider value={dispatch}>
				{children}
			</TableContextDispatch.Provider>
		</TableContextData.Provider>
	);
};

export {useData, useDispatch};
export default TableContext;
