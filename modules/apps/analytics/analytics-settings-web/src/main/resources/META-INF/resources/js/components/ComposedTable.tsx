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

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayEmptyState from '@clayui/empty-state';
import {ClayCheckbox, ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayManagementToolbar, {
	ClayResultsBar,
} from '@clayui/management-toolbar';
import {ClayPaginationWithBasicItems} from '@clayui/pagination';
import ClayPaginationBar from '@clayui/pagination-bar';
import ClayTable from '@clayui/table';
import classNames from 'classnames';
import {sub} from 'frontend-js-web';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {NOT_FOUND_GIF, PAGINATION} from '../utils/constants';

enum OrderBy {
	Asc = 'ASC',
	Desc = 'DESC',
}

export type TColumn = {
	expanded: boolean;
	label: string;
	sortable?: boolean;
	value: string;
};

export type TFilter = {
	type: OrderBy;
	value: TColumn['value'];
};

interface IComposedTableProps {
	allChecked?: boolean;
	columns: TColumn[];
	disabled?: boolean;
	items: TItem[];
	onFilterChange: (filter: TFilter) => void;
	onPaginationChange: (pagination: TPagination) => void;
	onSearchChange: (query: string) => void;
	onSelectAllItemsChange: (checked: boolean) => void;
	onSelectItemChange: (itemIndex: number) => void;
	pagination: TPagination;
}

type TItem = {
	checked: boolean;
	columns: string[];
	disabled: boolean;
	id: string;
};

export type TPagination = {
	delta: number;
	page: number;
	total: number;
};

const ComposedTable: React.FC<IComposedTableProps> = ({
	allChecked: initialallChecked = false,
	columns: initialColumns = [],
	disabled = false,
	items = [],
	onFilterChange,
	onPaginationChange,
	onSearchChange,
	onSelectAllItemsChange,
	onSelectItemChange,
	pagination: initialPagination,
}) => {
	const [allChecked, setAllChecked] = useState(false);
	const [filter, setFilter] = useState<TFilter>({
		type: OrderBy.Desc,
		value: initialColumns[0].value,
	});
	const [searchMobile, setSearchMobile] = useState(false);
	const [keywords, setkeywords] = useState('');
	const [keywordsValue, setkeywordsValue] = useState('');
	const [pagination, setPagination] = useState<TPagination>(PAGINATION);

	useEffect(() => {
		setAllChecked(initialallChecked);
	}, [initialallChecked]);

	useEffect(() => {
		setPagination(initialPagination);
	}, [initialPagination]);

	const handleFilterChange = useCallback(
		(params: Partial<TFilter>) => {
			const newFilter = {...filter, ...params};

			setFilter(newFilter);
			onFilterChange(newFilter);
		},
		[filter, onFilterChange]
	);

	const columns = useMemo(
		() =>
			initialColumns.map((column) => ({
				...column,
				onClick: () =>
					handleFilterChange({
						value: column.value,
					}),
			})),
		[handleFilterChange, initialColumns]
	);

	const handlePaginationChange = useCallback(
		(params: Partial<TPagination>) => {
			const newPagination = {...pagination, ...params};

			setPagination(newPagination);
			onPaginationChange(newPagination);
		},
		[onPaginationChange, pagination]
	);

	return (
		<div>
			<ClayManagementToolbar>
				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item>
						<ClayCheckbox
							checked={allChecked}
							disabled={disabled}
							onChange={() => {
								onSelectAllItemsChange(!allChecked);
								setAllChecked(!allChecked);
							}}
						/>
					</ClayManagementToolbar.Item>

					<ClayDropDownWithItems
						items={columns.filter(({sortable = true}) => sortable)}
						trigger={
							<ClayButton
								className="nav-link"
								displayType="unstyled"
							>
								<span className="navbar-breakpoint-down-d-none">
									<span className="navbar-text-truncate">
										{Liferay.Language.get(
											'filter-and-order'
										)}
									</span>

									<ClayIcon
										className="inline-item inline-item-after"
										symbol="caret-bottom"
									/>
								</span>

								<span className="navbar-breakpoint-d-none">
									<ClayIcon symbol="filter" />
								</span>
							</ClayButton>
						}
					/>

					<ClayManagementToolbar.Item>
						<ClayButton
							className="nav-link nav-link-monospaced"
							displayType="unstyled"
							onClick={() => {
								let type = filter.type;

								if (type === OrderBy.Asc) {
									type = OrderBy.Desc;
								} else {
									type = OrderBy.Asc;
								}

								handleFilterChange({type});
							}}
						>
							<ClayIcon
								symbol={
									filter.type === OrderBy.Asc
										? 'order-list-up'
										: 'order-list-down'
								}
							/>
						</ClayButton>
					</ClayManagementToolbar.Item>
				</ClayManagementToolbar.ItemList>

				<ClayManagementToolbar.Search
					onSubmit={(event) => {
						event.preventDefault();

						setkeywords(keywordsValue);
						onSearchChange(keywordsValue);
					}}
					showMobile={searchMobile}
				>
					<ClayInput.Group>
						<ClayInput.GroupItem>
							<ClayInput
								aria-label={Liferay.Language.get('search')}
								className="form-control input-group-inset input-group-inset-after"
								onChange={({target: {value}}) =>
									setkeywordsValue(value)
								}
								placeholder={Liferay.Language.get('search')}
								type="text"
								value={keywordsValue}
							/>

							<ClayInput.GroupInsetItem after tag="span">
								<ClayButtonWithIcon
									className="navbar-breakpoint-d-none"
									displayType="unstyled"
									onClick={() => setSearchMobile(false)}
									symbol="times"
								/>

								<ClayButtonWithIcon
									displayType="unstyled"
									symbol="search"
									type="submit"
								/>
							</ClayInput.GroupInsetItem>
						</ClayInput.GroupItem>
					</ClayInput.Group>
				</ClayManagementToolbar.Search>

				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item className="navbar-breakpoint-d-none">
						<ClayButton
							className="nav-link nav-link-monospaced"
							displayType="unstyled"
							onClick={() => setSearchMobile(true)}
						>
							<ClayIcon symbol="search" />
						</ClayButton>
					</ClayManagementToolbar.Item>
				</ClayManagementToolbar.ItemList>
			</ClayManagementToolbar>

			{keywords && (
				<ClayResultsBar>
					<ClayResultsBar.Item expand>
						<span className="component-text text-truncate-inline">
							<span className="text-truncate">
								<span>
									{items.length > 1
										? sub(
												Liferay.Language.get(
													'x-results-for'
												).toLowerCase(),
												items.length
										  )
										: sub(
												Liferay.Language.get(
													'x-result-for'
												).toLowerCase(),
												items.length
										  )}
								</span>

								<strong>{` "${keywords}"`}</strong>
							</span>
						</span>
					</ClayResultsBar.Item>

					<ClayResultsBar.Item>
						<ClayButton
							className="component-link tbar-link"
							displayType="unstyled"
							onClick={() => {
								setkeywords('');
								setkeywordsValue('');
								onSearchChange('');
							}}
						>
							{Liferay.Language.get('clear')}
						</ClayButton>
					</ClayResultsBar.Item>
				</ClayResultsBar>
			)}

			{keywords && !items.length && (
				<ClayEmptyState imgSrc={NOT_FOUND_GIF} />
			)}

			<ClayTable hover={!disabled}>
				<ClayTable.Head>
					<ClayTable.Row>
						<ClayTable.Cell></ClayTable.Cell>

						{columns.map(({expanded = false, label, value}) => (
							<ClayTable.Cell
								expanded={expanded}
								headingCell
								key={label}
							>
								<span>{label}</span>

								{filter.value === value && (
									<span>
										<ClayIcon
											symbol={
												filter.type === OrderBy.Asc
													? 'order-arrow-up'
													: 'order-arrow-down'
											}
										/>
									</span>
								)}
							</ClayTable.Cell>
						))}
					</ClayTable.Row>
				</ClayTable.Head>

				<ClayTable.Body>
					{items.map(
						(
							{
								checked,
								columns,
								disabled: disabledItem = false,
								id,
							},
							index
						) => (
							<ClayTable.Row
								className={classNames({
									'text-muted': disabled,
								})}
								key={id}
							>
								<ClayTable.Cell>
									<ClayCheckbox
										checked={checked}
										disabled={disabled || disabledItem}
										id={id}
										onChange={() =>
											onSelectItemChange(index)
										}
									/>
								</ClayTable.Cell>

								{columns.map((label, index: number) => (
									<ClayTable.Cell key={index}>
										{label}
									</ClayTable.Cell>
								))}
							</ClayTable.Row>
						)
					)}
				</ClayTable.Body>
			</ClayTable>

			{!!pagination.total && (
				<ClayPaginationBar>
					<ClayPaginationBar.DropDown
						items={[5, 10, 20, 30, 50].map(
							(delta: TPagination['delta']) => ({
								label: String(delta),
								onClick: () =>
									handlePaginationChange({delta, page: 1}),
							})
						)}
						trigger={
							<ClayButton displayType="unstyled">
								<strong>
									{sub(
										Liferay.Language.get('x-entries'),
										pagination.delta
									)}
								</strong>

								<ClayIcon symbol="caret-double-l" />
							</ClayButton>
						}
					/>

					<ClayPaginationBar.Results>
						{sub(
							Liferay.Language.get('showing-x-to-x-of-x-entries'),
							[
								(pagination.page - 1) * pagination.delta + 1,
								pagination.page * pagination.delta <
								pagination.total
									? pagination.page * pagination.delta
									: pagination.total,
								pagination.total,
							]
						)}
					</ClayPaginationBar.Results>

					<ClayPaginationWithBasicItems
						active={pagination.page}
						defaultActive={1}
						onActiveChange={(page: number) => {
							handlePaginationChange({page});
						}}
						totalPages={Math.ceil(
							pagination.total / pagination.delta
						)}
					/>
				</ClayPaginationBar>
			)}
		</div>
	);
};

export default ComposedTable;
