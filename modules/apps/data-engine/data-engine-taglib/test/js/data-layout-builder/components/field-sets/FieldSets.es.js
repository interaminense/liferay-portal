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

import {ClayModalProvider} from '@clayui/modal';
import {act, cleanup, fireEvent, render} from '@testing-library/react';
import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import AppContext from '../../../../../src/main/resources/META-INF/resources/data_layout_builder/js/AppContext.es';
import FieldSets from '../../../../../src/main/resources/META-INF/resources/data_layout_builder/js/components/field-sets/FieldSets.es';
import DataLayoutBuilderContextProviderEs from '../../../../../src/main/resources/META-INF/resources/data_layout_builder/js/data-layout-builder/DataLayoutBuilderContextProvider.es';
import * as toast from '../../../../../src/main/resources/META-INF/resources/data_layout_builder/js/utils/toast.es';
import {
	DATA_DEFINITION_RESPONSES,
	ENTRY,
	FORM_VIEW,
	dataDefinitionFieldSet,
} from '../../../../utils/constants.es';

const {getDataLayoutBuilderProps} = FORM_VIEW;

const defaultState = {
	appProps: {
		dataDefinitionId: 1,
		dataLayoutId: 1,
		fieldTypesModules: '',
		groupId: 1,
		sidebarPanels: {},
	},
	dataDefinition: DATA_DEFINITION_RESPONSES.ONE_ITEM,
	dataLayout: ENTRY.DATA_LAYOUT,
	fieldSets: [],
};

let dataLayoutBuilderProps;
let dispatch;
let spySuccessToast;
let spyErrorToast;

export const FieldSetWrapper = ({
	children,
	dataLayoutBuilder = dataLayoutBuilderProps,
	dispatch = jest.fn(),
	state = defaultState,
}) => (
	<DndProvider backend={HTML5Backend}>
		<ClayModalProvider>
			<AppContext.Provider value={[state, dispatch]}>
				<DataLayoutBuilderContextProviderEs
					dataLayoutBuilder={dataLayoutBuilder}
				>
					{children}
				</DataLayoutBuilderContextProviderEs>
			</AppContext.Provider>
		</ClayModalProvider>
	</DndProvider>
);

describe('FieldSets', () => {
	beforeEach(() => {
		window.Liferay = {
			...window.Liferay,
			Loader: {
				require: () => jest.fn(),
			},
		};

		jest.useFakeTimers();
		dispatch = jest.fn();
		dataLayoutBuilderProps = getDataLayoutBuilderProps();
		spySuccessToast = jest
			.spyOn(toast, 'successToast')
			.mockImplementation(() => {});
		spyErrorToast = jest
			.spyOn(toast, 'errorToast')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.restoreAllMocks();
		cleanup();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	it('renders', () => {
		const {asFragment} = render(
			<FieldSetWrapper dispatch={dispatch}>
				<FieldSets />
			</FieldSetWrapper>
		);

		expect(asFragment).toMatchSnapshot();
	});

	it('renders without fieldset and shows empty state', () => {
		const {queryByText} = render(
			<FieldSetWrapper dispatch={dispatch}>
				<FieldSets />
			</FieldSetWrapper>
		);

		expect(queryByText('there-are-no-fieldsets')).toBeTruthy();
		expect(queryByText('there-are-no-fieldsets-description')).toBeTruthy();
	});

	it('renders without fieldset and open create modal', async () => {
		const {queryByText} = render(
			<FieldSetWrapper dispatch={dispatch}>
				<FieldSets />
			</FieldSetWrapper>
		);

		await act(async () => {
			await fireEvent.click(queryByText('create-new-fieldset'));
		});

		await act(async () => {
			jest.runAllTimers();
		});

		expect(document.querySelector('.modal-title').textContent).toBe('create-new-fieldset');
		expect(document.querySelector('.localizable-dropdown')).toBeTruthy();
	});

	it('renders with 1 fieldset and add on layout', () => {
		const {label, nestedDataDefinitionFields} = dataDefinitionFieldSet;
		const state = {
			...defaultState,
			fieldSets: [
				{
					...dataDefinitionFieldSet,
					dataDefinitionFields: nestedDataDefinitionFields,
					name: label,
				},
			],
		};

		const {container, queryByText} = render(
			<DndProvider backend={HTML5Backend}>
				<FieldSetWrapper dispatch={dispatch} state={state}>
					<FieldSets />
				</FieldSetWrapper>
			</DndProvider>
		);

		expect(container.querySelectorAll('.field-type').length).toBe(
			state.fieldSets.length
		);
		expect(queryByText(label.en_US)).toBeTruthy();
		expect(
			queryByText(`${nestedDataDefinitionFields.length} fields`)
		).toBeTruthy();

		fireEvent.doubleClick(container.querySelector('.field-type'));
		const [action, payload] = dataLayoutBuilderProps.dispatch.mock.calls[0]
		const {defaultLanguageId, fieldName, indexes} = payload

		expect(action).toBe('fieldSetAdded');
		expect(defaultLanguageId).toBe('en_US');
		expect(fieldName).toStrictEqual(state.fieldSets[0].label)
		expect(indexes).toStrictEqual({columnIndex:0, pageIndex: 0, rowIndex: 1})
	});

	it('renders with more than 1 fieldsets and filter', () => {
		const {label, nestedDataDefinitionFields} = dataDefinitionFieldSet;
		const state = {
			...defaultState,
			fieldSets: [
				{
					...dataDefinitionFieldSet,
					dataDefinitionFields: nestedDataDefinitionFields,
					name: label,
				},
				{
					...dataDefinitionFieldSet,
					dataDefinitionFields: [
						...nestedDataDefinitionFields,
						nestedDataDefinitionFields,
					],
					dataDefinitionKey: '2201',
					defaultLanguageId: 'pt_BR',
					name: {
						en_US: 'House',
						pt_BR: 'Casa'
					},
				},
			],
		};

		const {container, queryByText, rerender} = render(
			<FieldSetWrapper state={state}>
				<FieldSets />
			</FieldSetWrapper>
		);

		expect(container.querySelectorAll('.field-type').length).toBe(
			state.fieldSets.length
		);

		const [addressFS, houseFS] = state.fieldSets;

		expect(queryByText(addressFS.name.en_US)).toBeTruthy();
		expect(
			queryByText(`${addressFS.dataDefinitionFields.length} fields`)
		).toBeTruthy();

		expect(queryByText(houseFS.name.pt_BR)).toBeTruthy();

		expect(
			queryByText(`${houseFS.dataDefinitionFields.length} fields`)
		).toBeTruthy();

		rerender(
			<FieldSetWrapper state={state}>
				<FieldSets keywords="Add" />
			</FieldSetWrapper>
		);

		expect(container.querySelectorAll('.field-type').length).toBe(1);

		expect(queryByText(houseFS.name.pt_BR)).toBeFalsy();

		expect(
			queryByText(`${houseFS.dataDefinitionFields.length} fields`)
		).toBeFalsy();
	});

	it('renders with 1 fieldset and update', async () => {
		const {label, nestedDataDefinitionFields} = dataDefinitionFieldSet;
		const state = {
			...defaultState,
			fieldSets: [
				{
					...dataDefinitionFieldSet,
					dataDefinitionFields: nestedDataDefinitionFields,
					defaultDataLayout: {id: 1},
					name: label,
				},
			],
		};

		const {queryByText} = render(
			<DndProvider backend={HTML5Backend}>
				<FieldSetWrapper dispatch={dispatch} state={state}>
					<FieldSets />
				</FieldSetWrapper>
			</DndProvider>
		);

		expect(document.querySelector('.modal-dialog')).toBeFalsy();
		
		await act(async () => {
			await fireEvent.click(queryByText('edit'));
		});
		
		await act(async () => {
			jest.runAllTimers();
		});

		expect(document.querySelector('.modal-title').textContent).toBe('edit-fieldset')
		expect(document.querySelector('.localizable-dropdown')).toBeTruthy();
	});

	it('renders with 1 fieldset and delete', async () => {
		fetch.mockResponseOnce(
			JSON.stringify({
				actions: {},
				facets: [],
				items: [],
				lastPage: 1,
				page: 1,
				pageSize: 0,
				totalCount: 0,
			})
		);
		fetch.mockResponseOnce(JSON.stringify({}));

		const {label, nestedDataDefinitionFields} = dataDefinitionFieldSet;
		const state = {
			...defaultState,
			fieldSets: [
				{
					...dataDefinitionFieldSet,
					dataDefinitionFields: nestedDataDefinitionFields,
					name: label,
				},
			],
		};

		const {queryByText} = render(
			<DndProvider backend={HTML5Backend}>
				<FieldSetWrapper dispatch={dispatch} state={state}>
					<FieldSets />
				</FieldSetWrapper>
			</DndProvider>
		);

		expect(document.querySelector('.modal-dialog')).toBeFalsy();

		await act(async () => {
			await fireEvent.click(queryByText('delete'));
		});

		await act(async () => {
			jest.runAllTimers();
		});

		expect(document.querySelector('.modal-dialog')).toBeTruthy();

		const [, deleteButton] = document.querySelectorAll(
			'.modal-footer button'
		);

		await act(async () => {
			await fireEvent.click(deleteButton);
		});

		const {
			dispatch: {
				mock: {calls: dispatchCalls},
			},
		} = dataLayoutBuilderProps;
		const [action, payload] = dispatchCalls[0];

		expect(spyErrorToast.mock.calls.length).toBe(0);
		expect(spySuccessToast.mock.calls.length).toBe(1);
		expect(dispatchCalls.length).toBe(1);
		expect(action).toEqual('fieldDeleted');
		expect(payload).toStrictEqual({activePage: 0, fieldName: 'Text'});
	});
});
