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
import {ClayToggle} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import {useModal} from '@clayui/modal';
import React, {useContext, useState} from 'react';

import Panel from '../Panel/Panel';
import DropdownWithDeleteButton from './DropdownWithDeleteButton';
import ModalAddNewBlock from './ModalAddNewBlock';
import ModalAddNewField from './ModalAddNewField';
import ModalAddNewTab from './ModalAddNewTab';
import LayoutContext, {TYPES} from './context';

import './LayoutTab.scss';

type TFields = {
	label: string;
	readOnly: boolean;
	type: string;
}[];

type TColumns = {
	fields?: TFields;
}[];

type TRows = {
	columns?: TColumns;
}[];

interface ILayoutFieldsProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	columnIndex: number;
	fields: TFields;
	rowIndex: number;
	tabIndex: number;
}

const LayoutFields: React.FC<ILayoutFieldsProps> = ({boxIndex, columnIndex, fields, rowIndex, tabIndex}) => {
	const [, dispatch] = useContext(LayoutContext);

	return (
		<>
			{fields.map(({label, readOnly, type}, fieldIndex) => {
				return (
					<Panel key={`field_${fieldIndex}`}>
						<Panel.SimpleBody
							contentRight={
								<DropdownWithDeleteButton
									onClick={() => {
										dispatch({
											payload: {
												boxIndex,
												columnIndex,
												fieldIndex,
												rowIndex,
												tabIndex,
											},
											type:
												TYPES.DELETE_FIELD,
										});
									}}
								/>
							}
							title={label}
						>
							<small className="text-secondary">
								{type} |{' '}
							</small>

							{readOnly && (
								<ClayLabel>
									{Liferay.Language.get(
										'read-only'
									)}
								</ClayLabel>
							)}
						</Panel.SimpleBody>
					</Panel>
				);
			})}
		</>
	);
}

interface ILayoutColumnsProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	columns?: TColumns;
	rowIndex: number;
	tabIndex: number;
}

const LayoutColumns: React.FC<ILayoutColumnsProps> = ({boxIndex, columns, rowIndex, tabIndex}) => {
	return (
		<>
			{columns?.map(({fields}, columnIndex) => {
				return (
					<div
						className="layout-tab__columns"
						key={`column_${columnIndex}`}
						style={{width: `${100 / columns.length}%`}}
					>
						{!!fields?.length && (
							<LayoutFields
								boxIndex={boxIndex}
								columnIndex={columnIndex}
								fields={fields}
								rowIndex={rowIndex}
								tabIndex={tabIndex}
							/>
						)}
					</div>
				);
			})}
		</>
	);
}

interface ILayoutRowsProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	rows?: TRows;
	tabIndex: number;
}

const LayoutRows: React.FC<ILayoutRowsProps> = ({boxIndex, rows, tabIndex}) => {
	return (
		<>
			{rows?.map(({columns}, rowIndex) => {
				return (
					<div className="layout-tab__rows" key={`row_${rowIndex}`}>
						{!!columns?.length && (
							<LayoutColumns
								boxIndex={boxIndex}
								columns={columns}
								rowIndex={rowIndex}
								tabIndex={tabIndex}
							/>
						)}
					</div>
				);
			})}
		</>
	);
};

interface ILayoutBoxProps extends React.HTMLAttributes<HTMLElement> {
	boxIndex: number;
	tabIndex: number;
	collapsible: boolean;
	label: string;
	rows?: TRows;
}

const LayoutBox: React.FC<ILayoutBoxProps> = ({
	boxIndex,
	collapsible,
	label,
	rows,
	tabIndex,
}) => {
	const [, dispatch] = useContext(LayoutContext);
	const [visibleModal, setVisibleModal] = useState(false);
	const {observer, onClose} = useModal({
		onClose: () => setVisibleModal(false),
	});

	return (
		<>
			<Panel>
				<Panel.Header
					contentRight={
						<>
							<ClayToggle
								aria-label={Liferay.Language.get('collapsible')}
								label={Liferay.Language.get('collapsible')}
								onToggle={(value) => {
									dispatch({
										payload: {
											boxIndex,
											collapsible: value,
											tabIndex,
										},
										type: TYPES.CHANGE_TOGGLE_COLLAPSIBLE,
									});
								}}
								toggled={collapsible}
							/>

							<ClayButton
								className="ml-4"
								displayType="secondary"
								onClick={() => setVisibleModal(true)}
								small
							>
								{Liferay.Language.get('add-field')}
							</ClayButton>

							<DropdownWithDeleteButton
								onClick={() => {
									dispatch({
										payload: {
											boxIndex,
											tabIndex,
										},
										type:
											TYPES.DELETE_BOX,
									});
								}}
							/>
						</>
					}
					title={label}
				/>

				{!!rows?.length && (
					<Panel.Body>
						<LayoutRows
							boxIndex={boxIndex}
							rows={rows}
							tabIndex={tabIndex}
						/>
					</Panel.Body>
				)}
			</Panel>

			{visibleModal && (
				<ModalAddNewField
					boxIndex={boxIndex}
					observer={observer}
					onClose={onClose}
					tabIndex={tabIndex}
				/>
			)}
		</>
	);
};

const AddNewTabButton = () => {
	const [visibleModal, setVisibleModal] = useState(false);
	const {observer, onClose} = useModal({
		onClose: () => setVisibleModal(false),
	});

	return (
		<>
			<div className="layout-tab__add-tab-btn">
				<ClayButton
					displayType="secondary"
					onClick={() => setVisibleModal(true)}
				>
					<ClayIcon symbol="plus" />

					<span className="ml-2">
						{Liferay.Language.get('add-tab')}
					</span>
				</ClayButton>
			</div>

			{visibleModal && (
				<ModalAddNewTab observer={observer} onClose={onClose} />
			)}
		</>
	);
};

const LayoutTabs: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
	const [{layoutData}, dispatch] = useContext(LayoutContext);
	const [visibleModal, setVisibleModal] = useState(false);
	const [selectedTabIndex, setSelectedTabIndex] = useState(0);
	const {observer, onClose} = useModal({
		onClose: () => setVisibleModal(false),
	});

	return (
		<>
			{layoutData?.tabs?.map(({boxs, label, type}, tabIndex) => {
				return (
					<Panel className="layout-tab__tab" key={`layout_${tabIndex}`}>
						<Panel.Header
							contentLeft={
								<ClayLabel displayType="info">{type}</ClayLabel>
							}
							contentRight={
								<>
									<ClayButton
										displayType="secondary"
										onClick={() => {
											setVisibleModal(true);
											setSelectedTabIndex(tabIndex);
										}}
										small
									>
										<ClayIcon symbol="plus" />

										<span className="ml-2">
											{Liferay.Language.get('add-block')}
										</span>
									</ClayButton>

									<DropdownWithDeleteButton
										onClick={() => {
											dispatch({
												payload: {
													tabIndex,
												},
												type:
													TYPES.DELETE_TAB,
											});
										}}
									/>
								</>
							}
							title={label}
						/>

						{!!boxs?.length && (
							<Panel.Body>
								{boxs.map(({collapsible, label, rows}, boxIndex) => (
									<LayoutBox
										collapsible={collapsible}
										label={label}
										boxIndex={boxIndex}
										key={`box_${boxIndex}`}
										rows={rows}
										tabIndex={tabIndex}
									/>
								))}
							</Panel.Body>
						)}
					</Panel>
				);
			})}

			{visibleModal && (
				<ModalAddNewBlock
					observer={observer}
					onClose={onClose}
					tabIndex={selectedTabIndex}
				/>
			)}
		</>
	);
};

const LayoutScreen: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
	return (
		<div className="layout-tab">
			<AddNewTabButton />

			<LayoutTabs />
		</div>
	);
}

export default LayoutScreen;
