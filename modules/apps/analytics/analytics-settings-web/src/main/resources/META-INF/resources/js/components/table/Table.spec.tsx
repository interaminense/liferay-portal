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

import fetch from 'jest-fetch-mock';

import '@testing-library/jest-dom/extend-expect';
import {act, fireEvent, render, screen, within} from '@testing-library/react';
import React from 'react';

import {loadingElement} from '../../utils/tests/helpers';
import {fetchTableData, fetchTableDataResponse} from '../../utils/tests/mocks';
import Table, {ITableProps} from './Table';
import {TColumn} from './types';

type TRawItem = {
	id: string;
	name: string;
};

const HEADER: TColumn[] = [
	{
		expanded: true,
		id: 'firstName',
		label: 'First Name',
	},
	{
		expanded: true,
		id: 'lastName',
		label: 'Last Name',
	},
	{
		expanded: true,
		id: 'age',
		label: 'Age',
	},
];

const COLUMNS = HEADER.map(({id}) => id) as Array<keyof TRawItem>;

const EMPTY_STATE = {
	noResultsTitle: 'no items were found',
	title: 'there are no items',
};

const WrappedTable: React.FC<Partial<ITableProps<TRawItem>>> = (props) => {
	return (
		<Table<TRawItem>
			columns={HEADER}
			emptyState={EMPTY_STATE}
			mapperItems={(items: TRawItem[]) => {
				return items.map((item) => {
					return {
						checked: false,
						columns: COLUMNS.map((column) => ({
							id: column,
							value: item[column],
						})),
						disabled: false,
						id: item.id,
					};
				});
			}}
			requestFn={fetchTableData}
			{...props}
		/>
	);
};

describe('Table', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('renders table without crashing', async () => {
		fetch.mockResponseOnce(JSON.stringify(fetchTableDataResponse));

		render(<WrappedTable />);

		await loadingElement();

		const column1 = screen.getByTestId(/Andre/i);

		expect(within(column1).getByText(/Andre/i)).toBeInTheDocument();
		expect(within(column1).getByText(/Patton/i)).toBeInTheDocument();
		expect(within(column1).getByText(/19/i)).toBeInTheDocument();

		const column2 = screen.getByTestId(/Jayden/i);

		expect(within(column2).getByText(/Jayden/i)).toBeInTheDocument();
		expect(within(column2).getByText(/Holloway/i)).toBeInTheDocument();
		expect(within(column2).getByText(/76/i)).toBeInTheDocument();

		const column3 = screen.getByTestId(/Etta/i);

		expect(within(column3).getByText(/Etta/i)).toBeInTheDocument();
		expect(within(column3).getByText(/Garrett/i)).toBeInTheDocument();
		expect(within(column3).getByText(/63/i)).toBeInTheDocument();

		const column4 = screen.getByTestId(/Eugenia/i);

		expect(within(column4).getByText(/Eugenia/i)).toBeInTheDocument();
		expect(within(column4).getByText(/Rios/i)).toBeInTheDocument();
		expect(within(column4).getByText(/21/i)).toBeInTheDocument();

		const column5 = screen.getByTestId(/Earl/i);

		expect(within(column5).getByText(/Earl/i)).toBeInTheDocument();
		expect(within(column5).getByText(/Medina/i)).toBeInTheDocument();
		expect(within(column5).getByText(/33/i)).toBeInTheDocument();
	});

	it('renders a button with a title "Add item", and that clicking the button calls the onAddItem callback prop', async () => {
		fetch.mockResponseOnce(JSON.stringify(fetchTableDataResponse));
		const onAddItem = jest.fn();

		const {rerender} = render(<WrappedTable />);

		await loadingElement();

		expect(screen.queryByTitle(/add-item/i)).toBeNull();

		rerender(<WrappedTable onAddItem={onAddItem} />);

		expect(screen.getByTitle(/add-item/i)).toBeInTheDocument();
		expect(onAddItem).not.toHaveBeenCalled();

		fireEvent.click(screen.getByTitle(/add-item/i));

		expect(onAddItem).toHaveBeenCalled();
	});

	it('renders a button with a custom title "Add New User", and that clicking the button calls the onAddItem callback prop', async () => {
		fetch.mockResponseOnce(JSON.stringify(fetchTableDataResponse));

		const onAddItem = jest.fn();

		render(
			<WrappedTable addItemTitle="Add New User" onAddItem={onAddItem} />
		);

		await loadingElement();

		const button = screen.getByTitle(/Add New User/i);

		expect(button).toBeInTheDocument();
		expect(onAddItem).not.toHaveBeenCalled();

		fireEvent.click(button);

		expect(onAddItem).toHaveBeenCalled();
	});

	it('renders table with specific parts disabled', async () => {
		fetch.mockResponseOnce(JSON.stringify(fetchTableDataResponse));

		const {rerender} = render(<WrappedTable />);

		await loadingElement();

		const column1 = screen.getByTestId(/Andre/i);
		const column2 = screen.getByTestId(/Jayden/i);
		const column3 = screen.getByTestId(/Etta/i);
		const column4 = screen.getByTestId(/Eugenia/i);
		const column5 = screen.getByTestId(/Earl/i);

		expect(screen.getByTestId(/globalCheckbox/i)).toBeEnabled();
		expect(
			screen.getByRole('button', {name: /filter-and-order/i})
		).toBeEnabled();
		expect(screen.getByRole('button', {name: /sort/i})).toBeEnabled();
		expect(screen.getByRole('textbox', {name: /search/i})).toBeEnabled();
		expect(screen.getByRole('button', {name: /search/i})).toBeEnabled();
		expect(screen.getByRole('table').getAttribute('class')).toMatch(
			/table-hover/gi
		);

		expect(column1).not.toHaveClass('text-muted');
		expect(within(column1).getByRole(/checkbox/i)).toBeEnabled();

		expect(column2).not.toHaveClass('text-muted');
		expect(within(column2).getByRole(/checkbox/i)).toBeEnabled();

		expect(column3).not.toHaveClass('text-muted');
		expect(within(column3).getByRole(/checkbox/i)).toBeEnabled();

		expect(column4).not.toHaveClass('text-muted');
		expect(within(column4).getByRole(/checkbox/i)).toBeEnabled();

		expect(column5).not.toHaveClass('text-muted');
		expect(within(column5).getByRole(/checkbox/i)).toBeEnabled();

		rerender(<WrappedTable disabled />);

		expect(screen.getByTestId(/globalCheckbox/i)).toBeDisabled();
		expect(
			screen.getByRole('button', {name: /filter-and-order/i})
		).toBeDisabled();
		expect(screen.getByRole('button', {name: /sort/i})).toBeDisabled();
		expect(screen.getByRole('textbox', {name: /search/i})).toBeDisabled();
		expect(screen.getByRole('button', {name: /search/i})).toBeDisabled();
		expect(screen.getByRole('table').getAttribute('class')).not.toMatch(
			/table-hover/gi
		);

		expect(column1).toHaveClass('text-muted');
		expect(within(column1).getByRole(/checkbox/i)).toBeDisabled();

		expect(column2).toHaveClass('text-muted');
		expect(within(column2).getByRole(/checkbox/i)).toBeDisabled();

		expect(column3).toHaveClass('text-muted');
		expect(within(column3).getByRole(/checkbox/i)).toBeDisabled();

		expect(column4).toHaveClass('text-muted');
		expect(within(column4).getByRole(/checkbox/i)).toBeDisabled();

		expect(column5).toHaveClass('text-muted');
		expect(within(column5).getByRole(/checkbox/i)).toBeDisabled();
	});

	it.only('renders table with onItemsChange callback every time that items changed', async () => {
		fetch.mockResponseOnce(JSON.stringify(fetchTableDataResponse));

		const onItemsChange = jest.fn();

		const {container} = render(
			<WrappedTable onItemsChange={onItemsChange} />
		);

		await loadingElement();

		// Change pagination

		// Type keyword

		act(() => {
			fireEvent.change(
				screen.getByRole('textbox', {
					name: /search/i,
				}),
				{
					target: {value: 'Andre'},
				}
			);
		});

		expect(container.querySelectorAll('tbody tr')).toHaveLength(1);

		// Sort by firstName

		expect(onItemsChange).toHaveBeenCalled();
	});
});
