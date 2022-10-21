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
import {ClayCheckbox, ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayManagementToolbar from '@clayui/management-toolbar';

// import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';

import ClayTable from '@clayui/table';
import classNames from 'classnames';
import React, {useState} from 'react';

enum FilterOrder {
	Asc = 'ASC',
	Desc = 'DESC',
}

interface IComposedTableProps {
	allItemsChecked?: boolean;
	filters?: {label: string}[];
	headerColumns: Column[];
	items: Item[];
	onChangeFilterOrder: (order: 'ASC' | 'DESC') => void;
	onCheckboxItemChange: (itemIndex: number) => void;
	onSelectAllItems: (checked: boolean) => void;
	selectedAllDisabled?: boolean;
	tableDisabled?: boolean;
}

type Column = {
	expanded: boolean;
	label: string;
};

type Item = {
	checked: boolean;
	columns: string[];
	disabled: boolean;
	id: string;
};

const ComposedTable: React.FC<IComposedTableProps> = ({
	allItemsChecked: initialAllItemsChecked = false,
	filters = [],
	headerColumns = [],
	items = [],
	onChangeFilterOrder,
	onCheckboxItemChange,
	onSelectAllItems,
	selectedAllDisabled = false,
	tableDisabled = false,
}) => {
	const [allItemsChecked, setChecked] = useState(initialAllItemsChecked);
	const [filterOrder, setFilterOrder] = useState<FilterOrder>(
		FilterOrder.Asc
	);
	const [searchMobile, setSearchMobile] = useState(false);

	return (
		<div>
			<ClayManagementToolbar>
				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item>
						<ClayCheckbox
							checked={allItemsChecked}
							disabled={selectedAllDisabled}
							onChange={() => {
								onSelectAllItems(!allItemsChecked);
								setChecked(!allItemsChecked);
							}}
						/>
					</ClayManagementToolbar.Item>

					<ClayDropDownWithItems
						items={filters}
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
								const currentFilterOrder =
									filterOrder === FilterOrder.Asc
										? FilterOrder.Desc
										: FilterOrder.Asc;

								setFilterOrder(currentFilterOrder);
								onChangeFilterOrder(currentFilterOrder);
							}}
						>
							<ClayIcon
								symbol={
									filterOrder === FilterOrder.Asc
										? 'order-list-up'
										: 'order-list-down'
								}
							/>
						</ClayButton>
					</ClayManagementToolbar.Item>
				</ClayManagementToolbar.ItemList>

				{/* // TODO: update this component with function to handle the search component (filter results). 
				// The function will be created on another story (LRAC-12019) */}

				<ClayManagementToolbar.Search showMobile={searchMobile}>
					<ClayInput.Group>
						<ClayInput.GroupItem>
							<ClayInput
								aria-label="Search"
								className="form-control input-group-inset input-group-inset-after"
								placeholder="Search"
								type="text"
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

			<ClayTable hover={!tableDisabled}>
				<ClayTable.Head>
					<ClayTable.Row>
						<ClayTable.Cell></ClayTable.Cell>

						{headerColumns.map(({expanded, label}) => (
							<ClayTable.Cell
								expanded={expanded}
								headingCell
								key={label}
							>
								{label}
							</ClayTable.Cell>
						))}
					</ClayTable.Row>
				</ClayTable.Head>

				<ClayTable.Body>
					{items.map(
						({checked, columns, disabled = false, id}, index) => {
							return (
								<ClayTable.Row
									className={classNames({
										'text-muted': disabled,
									})}
									key={id}
								>
									<ClayTable.Cell>
										<ClayCheckbox
											checked={checked}
											disabled={tableDisabled || disabled}
											id={id}
											onChange={() =>
												onCheckboxItemChange(index)
											}
										/>
									</ClayTable.Cell>

									{columns.map((label, index: number) => (
										<ClayTable.Cell key={index}>
											{label}
										</ClayTable.Cell>
									))}
								</ClayTable.Row>
							);
						}
					)}
				</ClayTable.Body>
			</ClayTable>

			{/* // TODO: update this component with function to handle the pagination component. 
			// The function will be created on another story (LRAC-12019) */}

			{/* <ClayPaginationBarWithBasicItems
				activeDelta={delta}
				defaultActive={1}
				deltas={[4, 8, 20, 40, 60].map((size) => ({
					label: size,
				}))}
				onDeltaChange={setDelta}
				totalItems={10}
			/> */}
		</div>
	);
};

export default ComposedTable;
