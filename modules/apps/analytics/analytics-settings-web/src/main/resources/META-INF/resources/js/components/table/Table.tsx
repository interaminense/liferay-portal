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

import React, {useEffect} from 'react';

import {TQueries} from '../../utils/request';
import useFetchData from '../../utils/useFecthData';
import useLazyFetchData from '../../utils/useLazyFetchData';
import Content from './Content';
import TableContext, {Events, useData, useDispatch} from './Context';
import ManagementToolbar from './ManagementToolbar';
import PaginationBar from './PaginationBar';
import StateRenderer from './StateRenderer';

export type TColumn = {
	expanded: boolean;
	label: string;
	show?: boolean;
	sortable?: boolean;
	value: string;
};

export type TItem = {
	checked: boolean;
	columns: {label: string; show?: boolean}[];
	disabled: boolean;
	id: string;
};

export type TFormattedItems = {[key: string]: TItem};

interface ITableProps {
	columns: TColumn[];
	disabled?: boolean;
	emptyStateTitle: string;
	fetchFn: (params: TQueries) => Promise<any>;
	mapperItems: (items: any[]) => TItem[];
	noResultsTitle: string;
	onItemsChange?: (items: TFormattedItems) => void;
}

const Table: React.FC<ITableProps> = ({
	columns,
	disabled = false,
	emptyStateTitle,
	fetchFn,
	mapperItems,
	noResultsTitle,
	onItemsChange,
}) => {
	const {
		filter,
		formattedItems,
		globalChecked,
		keywords,
		pagination,
	} = useData();
	const dispatch = useDispatch();

	const {data, error, loading, refetch, refetching} = useFetchData(fetchFn, {
		filter,
		keywords,
		pagination,
	});

	const [lazyRequest, lazyResult] = useLazyFetchData(fetchFn, {
		filter,
		keywords,
		pagination: {
			...pagination,
			pageSize: pagination.totalCount,
		},
	});

	const empty = !data?.items.length;

	useEffect(() => {
		if (lazyResult.data) {
			dispatch({
				payload: {
					globalChecked: !globalChecked,
					items: mapperItems(lazyResult.data.items),
				},
				type: Events.ToggleGlobalCheckbox,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lazyResult.data]);

	useEffect(() => {
		if (data) {
			const {items, page, pageSize, totalCount} = data;
			const mappedItems = mapperItems(items);

			dispatch({
				payload: {
					items: mappedItems,
					pagination: {
						page,
						pageSize,
						totalCount,
					},
					rows: mappedItems.map(({id}: TItem) => id),
				},
				type: Events.FormatData,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	useEffect(() => {
		onItemsChange && onItemsChange(formattedItems);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formattedItems]);

	return (
		<>
			<ManagementToolbar
				columns={columns}
				disabled={
					disabled || (empty && !keywords) || lazyResult.loading
				}
				lazyRequest={lazyRequest}
			/>

			<StateRenderer
				data={data}
				empty={empty}
				emptyStateTitle={emptyStateTitle}
				error={error || lazyResult.error}
				loading={loading || lazyResult.loading}
				noResultsTitle={noResultsTitle}
				refetch={refetch}
				refetching={refetching}
			>
				<Content columns={columns} disabled={disabled} />
			</StateRenderer>

			<PaginationBar disabled={empty} />
		</>
	);
};

const TableWrapper: React.FC<ITableProps> = (props) => (
	<TableContext>
		<Table {...props} />
	</TableContext>
);

export default TableWrapper;
