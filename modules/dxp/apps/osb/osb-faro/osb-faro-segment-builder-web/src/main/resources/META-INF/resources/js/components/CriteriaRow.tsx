/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Option, Picker} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import getCN from 'classnames';
import {get} from 'lodash';
import React, {useContext} from 'react';
import {
	ConnectDragPreview,
	ConnectDragSource,
	ConnectDropTarget,
	DragSource as dragSource,
	DropTarget as dropTarget,
	DropTargetMonitor,
} from 'react-dnd';

import {CatalogRegistry} from '../registry/CatalogRegistry';
import {
	CatalogRegistryContext,
	FindRowProperty,
	FindRowPropertyContext,
	FindRowPropertyMeta,
	RowContext,
} from '../registry/context';
import {compose} from '../utils/compose';
import {DragTypes} from '../utils/drag-types';
import {Criterion, CriterionGroup, OnMove, Operator} from '../utils/types';
import {createNewGroup, generateRowId, isValid} from '../utils/utils';
import RowActions from '../vendored/RowActions';
import Form from '../vendored/form';

const acceptedDragTypes = [DragTypes.CriteriaRow, DragTypes.Property];

const KNOWN_OPERATOR_KEYS = ['is-known', 'is-unknown'];
const VALUE_NULL_OPERATOR_KEYS: Record<string, string> = {
	eq: 'is-unknown',
	ne: 'is-known',
};

const isOfKnownType = (key: string | undefined): boolean =>
	!!key && KNOWN_OPERATOR_KEYS.includes(key);

/**
 * Prevents rows from dropping onto themselves.
 */
const canDrop = (
	{
		criteriaGroupId: destGroupId,
		index: destIndex,
	}: {
		criteriaGroupId: string;
		index: number;
	},
	monitor: DropTargetMonitor
): boolean => {
	const {criteriaGroupId: startGroupId, index: startIndex} =
		monitor.getItem();

	return destGroupId !== startGroupId || destIndex !== startIndex;
};

/**
 * Items dropped on a row create a new grouping. Property drops also fire the
 * `onPropertyDrop` callback so adapters can record referenced properties.
 */
const drop = (
	{
		criteriaGroupId: destGroupId,
		criterion,
		index: destIndex,
		onChange,
		onMove,
		onPropertyDrop,
		registry,
	}: {
		criteriaGroupId: string;
		criterion: Criterion;
		index: number;
		onChange: (newGroup: CriterionGroup) => void;
		onMove: OnMove;
		onPropertyDrop?: (item: {criterion: any; property?: any}) => void;
		registry: CatalogRegistry | null;
	},
	monitor: DropTargetMonitor
): void => {
	const item = monitor.getItem();
	const {
		criteriaGroupId: startGroupId,
		criterion: droppedCriterion,
		index: startIndex,
		property,
	} = item;

	const {
		defaultValue,
		operatorName,
		propertyName,
		rowId,
		touched,
		type,
		valid,
		value,
	} = droppedCriterion;

	if (property && onPropertyDrop) {
		onPropertyDrop(item);
	}

	const droppedCriterionValue = isValid(value) ? value : defaultValue;

	// Sidebar drags carry no operatorName; resolve the default for the
	// criterion's `type` through the registry so `findPropertyByCriterion`
	// can route the freshly-grouped row to the right branch (events,
	// vocabulary, tag, account, etc.) instead of falling back to the
	// individual-properties branch and rendering "Attribute no longer
	// exists".

	const operators = registry?.getOperators(type ?? '') ?? [];

	const newCriterion = {
		operatorName: operatorName || operators[0]?.name,
		propertyName,
		rowId: rowId || generateRowId(),
		touched,
		type,
		valid,
		value: droppedCriterionValue,
	} as Criterion;

	const itemType = monitor.getItemType();

	const newGroup = createNewGroup([criterion, newCriterion]);

	if (itemType === DragTypes.Property) {
		onChange(newGroup);
	}
	else if (itemType === DragTypes.CriteriaRow) {
		onMove(
			startGroupId,
			startIndex,
			destGroupId,
			destIndex,
			newGroup,
			true
		);
	}
};

function beginDrag({
	criteriaGroupId,
	criterion,
	index,
}: {
	criteriaGroupId: string;
	criterion: Criterion;
	index: number;
}) {
	return {criteriaGroupId, criterion, index};
}

interface ICriteriaRowProps {
	canDrop: boolean;
	connectDragPreview: ConnectDragPreview;
	connectDragSource: ConnectDragSource;
	connectDropTarget: ConnectDropTarget;
	criteriaGroupId: string;
	criterion: Criterion;
	dragging?: boolean;
	findProperty: FindRowProperty | null;
	groupId: string;
	hover?: boolean;
	id?: string;
	index: number;
	onAdd: (index: number, criterion: Criterion) => void;
	onChange: (criterion: Criterion | Criterion[]) => void;
	onDelete: (index: number) => void;
	onMove: OnMove;
	onPropertyDrop?: (item: {criterion: any; property?: any}) => void;
	registry: CatalogRegistry | null;
	rowContext: Record<string, any>;
}

class CriteriaRow extends React.Component<ICriteriaRowProps> {
	static defaultProps = {
		criterion: {},
	};

	getSelectedProperty(): FindRowPropertyMeta | undefined {
		const {criterion, findProperty} = this.props;

		return findProperty ? findProperty(criterion) : undefined;
	}

	getSupportedOperators(
		selectedProperty: FindRowPropertyMeta | undefined
	): ReadonlyArray<Operator> {
		const {registry} = this.props;

		const type = selectedProperty?.type
			? String(selectedProperty.type)
			: this.props.criterion.type;

		return registry?.getOperators(type) ?? [];
	}

	getSelectedOperator(supportedOperators: ReadonlyArray<Operator>) {
		const {criterion} = this.props;
		const {operatorName, value} = criterion;

		let operatorKey: string | undefined = operatorName;

		const valueNull = value === null;

		if (valueNull && operatorName) {
			operatorKey =
				VALUE_NULL_OPERATOR_KEYS[operatorName] ?? operatorName;
		}

		const selectedOperator = supportedOperators.find(
			({key}) => key === operatorKey
		);

		return (
			selectedOperator || {
				key: operatorKey ?? '',
				label: operatorKey ?? '',
				name: operatorName ?? '',
			}
		);
	}

	getValue(value: any, key: string) {
		if (isOfKnownType(key)) {
			return null;
		}
		else if (value === null) {
			return '';
		}

		return value;
	}

	handleDelete = (event: React.MouseEvent) => {
		event.preventDefault();

		const {index, onDelete} = this.props;

		onDelete(index);
	};

	handleDuplicate = (event: React.MouseEvent) => {
		event.preventDefault();

		const {criterion, index, onAdd} = this.props;

		onAdd(index + 1, {...criterion, rowId: generateRowId()});
	};

	handleOperatorChange = (value: string) => {
		const {criterion, onChange} = this.props;

		const supportedOperators = this.getSupportedOperators(
			this.getSelectedProperty()
		);

		const newVal = this.getValue(criterion.value, value);

		let params = {};

		if (isOfKnownType(value) || criterion.value === null) {
			params = {valid: isValid(newVal)};
		}

		onChange({
			...criterion,
			operatorName: supportedOperators.find(({key}) => key === value)
				?.name,
			value: newVal,
			...params,
		} as unknown as Criterion);
	};

	handleTypedInputChange = (value: any) => {
		const {criterion, onChange} = this.props;

		if (Array.isArray(value)) {
			const items = value.map((item, i) => ({
				...criterion,
				...item,
				rowId: i === 0 ? criterion.rowId : generateRowId(),
			}));

			onChange(items);
		}
		else {
			onChange({
				...criterion,
				...value,
			});
		}
	};

	renderOperator = () => {
		const supportedOperators = this.getSupportedOperators(
			this.getSelectedProperty()
		);

		const {key: selectedOperatorKey} =
			this.getSelectedOperator(supportedOperators);

		const singleOption = supportedOperators.length === 1;

		return (
			<Form.GroupItem
				className="ac-segment-builder-web__operator"
				label={singleOption}
				shrink
			>
				{singleOption ? (
					supportedOperators[0].label
				) : (
					<Picker
						className="ac-segment-builder-web__criterion-input ac-segment-builder-web__operator-input"
						items={supportedOperators.map(({key, label}) => ({
							label,
							value: key,
						}))}
						onSelectionChange={
							this.handleOperatorChange as (
								value: React.Key
							) => void
						}
						selectedKey={selectedOperatorKey}
					>
						{({label, value}) => (
							<Option key={value}>{label}</Option>
						)}
					</Picker>
				)}
			</Form.GroupItem>
		);
	};

	renderValueInput(selectedProperty: FindRowPropertyMeta | undefined) {
		const {criterion, id, registry, rowContext} = this.props;

		const {label, options, type} = (selectedProperty ?? {}) as {
			label?: string;
			options?: ReadonlyArray<{label: string; value: any}>;
			type?: string;
		};

		const resolvedType = (type as string) || (criterion.type as string);

		const InputComponent = registry?.getInputComponent(resolvedType);

		if (!InputComponent) {
			return null;
		}

		return (
			<InputComponent
				{...rowContext}
				criterion={criterion}
				displayValue={label || ''}
				id={id}
				onChange={this.handleTypedInputChange}
				operatorRenderer={this.renderOperator}
				options={options}
				property={selectedProperty}
				touched={criterion.touched}
				valid={criterion.valid}
				value={criterion.value}
			/>
		);
	}

	render() {
		const {
			canDrop,
			connectDragPreview,
			connectDragSource,
			connectDropTarget,
			dragging,
			hover,
		} = this.props;

		const selectedProperty = this.getSelectedProperty();

		const classes = getCN('ac-segment-builder-web__criterion-row', {
			'ac-segment-builder-web__criterion-row--dragging': dragging,
			'ac-segment-builder-web__criterion-row--hover': hover && canDrop,
		});

		return connectDropTarget(
			connectDragPreview(
				<div className={classes}>
					<div
						className={`ac-segment-builder-web__color-stripe ac-segment-builder-web__color-stripe--color-${get(
							selectedProperty,
							'propertyKey',
							'disabled'
						)}`}
					/>

					<div className="ac-segment-builder-web__edit-container">
						{connectDragSource(
							<div className="ac-segment-builder-web__drag-icon">
								<ClayIcon className="icon-root" symbol="drag" />
							</div>
						)}

						{selectedProperty ? (
							this.renderValueInput(selectedProperty)
						) : (
							<div className="ac-segment-builder-web__non-existent-property-message">
								{Liferay.Language.get(
									'attribute-no-longer-exists'
								)}
							</div>
						)}

						<div className="ac-segment-builder-web__actions">
							<RowActions
								actions={[
									{
										label: Liferay.Language.get(
											'duplicate'
										),
										onClick: this.handleDuplicate,
									},
									{
										label: Liferay.Language.get('delete'),
										onClick: this.handleDelete,
									},
								]}
							/>
						</div>
					</div>
				</div>
			)
		);
	}
}

const CriteriaRowWithDrag = dragSource(
	DragTypes.CriteriaRow,
	{
		beginDrag,
	},
	(connect, monitor) => ({
		connectDragPreview: connect.dragPreview(),
		connectDragSource: connect.dragSource(),
		dragging: monitor.isDragging(),
	})
)(CriteriaRow);

const CriteriaRowWithDrop = compose<React.ComponentType<any>>(
	dropTarget(
		acceptedDragTypes,
		{
			canDrop,
			drop,
		},
		(connect, monitor) => ({
			canDrop: monitor.canDrop(),
			connectDropTarget: connect.dropTarget(),
			hover: monitor.isOver(),
		})
	)
)(CriteriaRowWithDrag);

/**
 * Functional wrapper that pulls the three builder contexts (registry,
 * rowContext, findProperty) and feeds them into the class component as props.
 * Keeping the class makes the diff against the analytics-cloud version small;
 * the wrapper isolates the hooks-only context access.
 */
function CriteriaRowWithContexts(props: any) {
	const registry = useContext(CatalogRegistryContext);
	const rowContext = useContext(RowContext);
	const findProperty = useContext(FindRowPropertyContext);

	return (
		<CriteriaRowWithDrop
			{...props}
			findProperty={findProperty}
			registry={registry}
			rowContext={rowContext}
		/>
	);
}

export default CriteriaRowWithContexts;
