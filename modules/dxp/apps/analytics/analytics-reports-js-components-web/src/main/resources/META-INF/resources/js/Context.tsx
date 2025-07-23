/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React, {createContext, useReducer} from 'react';

import {
	AssetTypes,
	Individuals,
	MetricType,
	RangeSelectors,
	Version,
} from './types/global';

export type State = {
	assetId: string;
	assetType: AssetTypes | null;
	changeIndividualFilter: (value: any) => void;
	changeMetricFilter: (value: any) => void;
	changeRangeSelectorFilter: (value: any) => void;
	filters: {
		individual: Individuals;
		metric: MetricType;
		rangeSelector: RangeSelectors;
	};
	groupId: string;
	versions?: Version[] | null;
};

enum Types {
	ChangeIndividualFilter = 'CHANGE_INDIVIDUAL_FILTER',
	ChangeMetricFilter = 'CHANGE_METRIC_FILTER',
	ChangeRangeSelectorFilter = 'CHANGE_RANGE_SELECTOR_FILTER',
}

type Action = {
	payload: any;
	type: Types;
};

const initialState: State = {
	assetId: '0',
	assetType: AssetTypes.Undefined,
	changeIndividualFilter: () => {},
	changeMetricFilter: () => {},
	changeRangeSelectorFilter: () => {},
	filters: {
		individual: Individuals.AllIndividuals,
		metric: MetricType.Undefined,
		rangeSelector: RangeSelectors.Last30Days,
	},
	groupId: '0',
	versions: null,
};

export const Context = createContext(initialState);

Context.displayName = 'Context';

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case Types.ChangeIndividualFilter: {
			return {
				...state,
				filters: {
					...state.filters,
					individual: action.payload,
				},
			};
		}

		case Types.ChangeMetricFilter: {
			return {
				...state,
				filters: {
					...state.filters,
					metric: action.payload,
				},
			};
		}

		case Types.ChangeRangeSelectorFilter: {
			return {
				...state,
				filters: {
					...state.filters,
					rangeSelector: action.payload,
				},
			};
		}

		default: {
			throw new Error('Unknown Action');
		}
	}
};

interface IContextProviderProps extends React.HTMLAttributes<HTMLElement> {
	assetId: string;
	assetType: AssetTypes | null;
	groupId: string;
	versions?: Version[] | null;
}

const ContextProvider: React.FC<IContextProviderProps> = ({
	assetId,
	assetType,
	children,
	groupId,
	versions,
}) => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const changeIndividualFilter = (payload: any) => {
		dispatch({
			payload,
			type: Types.ChangeIndividualFilter,
		});
	};

	const changeMetricFilter = (payload: any) => {
		dispatch({
			payload,
			type: Types.ChangeMetricFilter,
		});
	};

	const changeRangeSelectorFilter = (payload: any) => {
		dispatch({
			payload,
			type: Types.ChangeRangeSelectorFilter,
		});
	};

	return (
		<Context.Provider
			value={{
				...state,
				assetId,
				assetType,
				changeIndividualFilter,
				changeMetricFilter,
				changeRangeSelectorFilter,
				groupId,
				versions,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export {ContextProvider};
