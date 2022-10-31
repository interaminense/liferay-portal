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

import {Text} from '@clayui/core';
import ClayEmptyState from '@clayui/empty-state';
import React, {useEffect, useState} from 'react';

import {TProperty} from '../../pages/wizard/PropertyStep';
import {EMPTY_STATE_GIF} from '../../utils/constants';
import {useFetchData} from '../../utils/hooks';
import {
	DEFAULT_PAGINATION,
	TRawPagination,
	TSafePagination,
	getSafePagination,
} from '../../utils/pagination';
import ComposedTable, {TColumn} from '../ComposedTable';
import StateRenderer from '../StateRenderer';
import {
	changeItemsBasedOnAllChecked,
	toggleChannelName,
	useCheckAllSelectedItems,
	useFormatItems,
} from './utils';

export type TItem = {
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

interface TData extends TRawPagination {
	items: TItem[];
}

function Tab({
	columns,
	description,
	emptyStateDescription,
	enableCheckboxs = true,
	fetchFn,
	header,
	onItemsChange,
	property,
}: ITabProps) {
	const {data, error, loading, refetch, refetching} = useFetchData<TData>(
		fetchFn
	);
	const [items, setItems] = useState<TItem[]>([]);
	const [pagination, setPagination] = useState<TSafePagination>(
		DEFAULT_PAGINATION
	);

	const allChecked = useCheckAllSelectedItems<TItem>(items);

	const formattedItems = useFormatItems(items, property.name, columns);

	useEffect(() => {
		if (data?.items) {
			setItems(data.items);
			setPagination(getSafePagination(data));
		}
	}, [data]);

	useEffect(() => {
		onItemsChange(items);
	}, [items, onItemsChange]);

	return (
		<>
			{description && (
				<div className="my-3 text-secondary">
					<Text size={3}>{description}</Text>
				</div>
			)}

			<StateRenderer
				empty={!items.length}
				error={error}
				loading={loading}
			>
				<StateRenderer.Error
					disabled={refetching}
					onClickRefetch={refetch}
				/>

				<StateRenderer.Empty>
					<div className="empty-state-border">
						<ClayEmptyState
							description=""
							imgProps={{
								alt: emptyStateDescription,
								title: emptyStateDescription,
							}}
							imgSrc={EMPTY_STATE_GIF}
							title={emptyStateDescription}
						/>
					</div>
				</StateRenderer.Empty>

				<StateRenderer.Success>
					<ComposedTable
						allChecked={allChecked}
						columns={header}
						disabled={!enableCheckboxs}
						items={formattedItems}
						onFilterChange={(filter) => {
							// eslint-disable-next-line no-console
							console.log('filter clicked', filter);
						}}
						onPaginationChange={(pagination) => {
							// eslint-disable-next-line no-console
							console.log('pagination changed', pagination);
						}}
						onSearchChange={(keywords) => {
							// eslint-disable-next-line no-console
							console.log('search by', keywords);
						}}
						onSelectAllItemsChange={(allChecked: boolean) => {
							setItems(
								changeItemsBasedOnAllChecked<TItem>({
									allChecked,
									enableCheckboxs,
									items,
									propertyName: property.name,
								})
							);
						}}
						onSelectItemChange={(index: number) => {
							setItems(
								toggleChannelName({
									index,
									items,
									propertyName: property.name,
								})
							);
						}}
						pagination={pagination}
					/>
				</StateRenderer.Success>
			</StateRenderer>
		</>
	);
}

export default Tab;
