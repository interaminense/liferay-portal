/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import getCN from 'classnames';
import {isArray} from 'lodash';
import React, {Fragment} from 'react';
import {
	ConnectDragPreview,
	ConnectDragSource,
	DragSource as dragSource,
} from 'react-dnd';

import {CatalogRegistry} from '../registry/CatalogRegistry';
import {CatalogRegistryContext} from '../registry/context';
import {Conjunctions, SUPPORTED_CONJUNCTION_OPTIONS} from '../utils/constants';
import {DragTypes} from '../utils/drag-types';
import {Criterion, CriterionGroup, OnMove} from '../utils/types';
import {
	generateGroupId,
	generateRowId,
	getChildGroupIds,
	isCriterionGroup,
	isValid,
} from '../utils/utils';
import {
	insertAtIndex,
	replaceAtIndex,
	replaceWithMultipleAtIndex,
} from '../vendored/array';
import {SegmentTypes} from '../vendored/segment-types';
import Conjunction from './Conjunction';
import CriteriaRow from './CriteriaRow';
import DropZone from './DropZone';
import EmptyDropZone from './EmptyDropZone';

/**
 * Passes the required values to the drop target.
 * This method must be called `beginDrag`.
 */
const beginDrag = ({
	criteria,
	index,
	parentGroupId,
}: {
	criteria: CriterionGroup;
	index: number;
	parentGroupId: string;
}): object => {
	const childGroupIds = getChildGroupIds(criteria);

	return {
		childGroupIds,
		criteriaGroupId: parentGroupId,
		criterion: criteria,
		index,
	};
};

/**
 * A function that decorates the passed in component with the drag source HOC.
 * This was separated out since this function needed to be called again for the
 * nested groups.
 * @param {React.Component} component The component to decorate.
 */
const withDragSource = dragSource(
	DragTypes.CriteriaGroup,
	{
		beginDrag,
	},
	(connect, monitor) => ({
		connectDragPreview: connect.dragPreview(),
		connectDragSource: connect.dragSource(),
		dragging: monitor.isDragging(),
	})
);

interface ICriteriaGroupProps {
	channelId: string;
	connectDragPreview: ConnectDragPreview;
	connectDragSource: ConnectDragSource;
	criteria: CriterionGroup;
	criteriaGroupId: string;
	dragging?: boolean;
	groupId: string;
	id?: string;
	index?: number;
	onChange: (newCriterionGroup: CriterionGroup) => void;
	onMove: OnMove;
	onPropertyDrop?: (item: {criterion: any; property?: any}) => void;
	parentGroupId?: string;
	root?: boolean;
	segmentType: SegmentTypes;
	sequential: boolean;
}

class CriteriaGroup extends React.Component<ICriteriaGroupProps> {
	static contextType = CatalogRegistryContext;

	declare context: CatalogRegistry | null;

	static defaultProps = {
		root: false,
	};

	private NestedCriteriaGroupWithDrag: React.ComponentType<any>;

	constructor(props: ICriteriaGroupProps) {
		super(props);

		this.NestedCriteriaGroupWithDrag = withDragSource(
			CriteriaGroup
		) as React.ComponentType<any>;
	}

	handleConjunctionClick = (event: React.MouseEvent) => {
		event.preventDefault();

		const {criteria, onChange} = this.props;

		const index = SUPPORTED_CONJUNCTION_OPTIONS.findIndex(
			({name}) => name === criteria.conjunctionName
		);

		const conjunctionSelected =
			index === SUPPORTED_CONJUNCTION_OPTIONS.length - 1
				? SUPPORTED_CONJUNCTION_OPTIONS[0].name
				: SUPPORTED_CONJUNCTION_OPTIONS[index + 1].name;

		onChange({
			...criteria,
			conjunctionName: conjunctionSelected,
		});
	};

	/**
	 * Adds a new criterion in a group at the specified index. If the criteria
	 * was previously empty and is being added to the root group, a new group
	 * will be added as well. If the criteria is being duplicated, it will
	 * use the previous values as the default values.
	 * @param {number} index The position the criterion will be inserted in.
	 * @param {object} criterion The criterion that will be added.
	 * @memberof CriteriaGroup
	 */
	handleCriterionAdd = (index: number, criterion: Criterion) => {
		const {criteria, onChange, root} = this.props;

		const {
			defaultValue,
			operatorName,
			propertyName,
			touched,
			type,
			valid,
			value,
		} = criterion;

		const operators = this.context?.getOperators(type ?? '') ?? [];

		const newCriterion = {
			operatorName: operatorName || operators[0]?.name,
			propertyName,
			rowId: generateRowId(),
			touched,
			type,
			valid,
			value: isValid(value) ? value : defaultValue,
		};

		if (root && !criteria) {
			onChange({
				conjunctionName: Conjunctions.And,
				criteriaGroupId: generateGroupId(),
				items: [newCriterion],
			} as unknown as CriterionGroup);
		}
		else {
			onChange({
				...criteria,
				items: insertAtIndex(
					criteria.items,
					index,
					newCriterion as unknown as Criterion
				),
			});
		}
	};

	handleCriterionChange(index: number) {
		return (newCriterion: Criterion | Criterion[]) => {
			const {
				criteria: {conjunctionName, criteriaGroupId, items},
				onChange,
			} = this.props;

			onChange({
				conjunctionName,
				criteriaGroupId,
				items: isArray(newCriterion)
					? replaceWithMultipleAtIndex(
							newCriterion,
							[...items],
							index
						)
					: replaceAtIndex([...items], index, newCriterion),
			});
		};
	}

	handleCriterionDelete = (index: number) => {
		const {criteria, onChange} = this.props;

		onChange({
			...criteria,
			items: criteria.items.filter(
				(_fItem: unknown, fIndex: number) => fIndex !== index
			),
		});
	};

	isCriteriaEmpty() {
		const {criteria} = this.props;

		return criteria ? !criteria.items.length : true;
	}

	renderConjunction(index: number) {
		const {criteria, criteriaGroupId, id, onMove, onPropertyDrop} =
			this.props;

		return (
			<>
				<DropZone
					before
					criteriaGroupId={criteriaGroupId}
					dropIndex={index}
					id={id}
					onCriterionAdd={this.handleCriterionAdd}
					onMove={onMove}
					onPropertyDrop={onPropertyDrop}
				/>

				<Conjunction
					conjunctionName={criteria.conjunctionName}
					onClick={this.handleConjunctionClick}
				/>

				<DropZone
					criteriaGroupId={criteriaGroupId}
					dropIndex={index}
					id={id}
					onCriterionAdd={this.handleCriterionAdd}
					onMove={onMove}
					onPropertyDrop={onPropertyDrop}
				/>
			</>
		);
	}

	renderCriterion(criterion: Criterion | CriterionGroup, index: number) {
		const {
			channelId,
			criteriaGroupId,
			groupId,
			id,
			onMove,
			onPropertyDrop,
			segmentType,
		} = this.props;

		const criterionGroup = isCriterionGroup(criterion);

		const classes = getCN('ac-segment-builder-web__criterion', {
			'ac-segment-builder-web__criterion--group': criterionGroup,
		});

		const NestedCriteriaGroupWithDrag = this.NestedCriteriaGroupWithDrag;

		return (
			<div className={classes}>
				{criterionGroup ? (
					<NestedCriteriaGroupWithDrag
						channelId={channelId}
						criteria={criterion}
						criteriaGroupId={criterion.criteriaGroupId}
						groupId={groupId}
						id={id}
						index={index}
						onChange={this.handleCriterionChange(index)}
						onMove={onMove}
						onPropertyDrop={onPropertyDrop}
						parentGroupId={criteriaGroupId}
					/>
				) : (
					<CriteriaRow
						channelId={channelId}
						criteriaGroupId={criteriaGroupId}
						criterion={criterion}
						groupId={groupId}
						id={id}
						index={index}
						onAdd={this.handleCriterionAdd}
						onChange={this.handleCriterionChange(index)}
						onDelete={this.handleCriterionDelete}
						onMove={onMove}
						segmentType={segmentType}
					/>
				)}

				<DropZone
					criteriaGroupId={criteriaGroupId}
					dropIndex={index + 1}
					id={id}
					onCriterionAdd={this.handleCriterionAdd}
					onMove={onMove}
					onPropertyDrop={onPropertyDrop}
				/>
			</div>
		);
	}

	render() {
		const {
			connectDragPreview,
			connectDragSource,
			criteria,
			criteriaGroupId,
			dragging,
			id,
			onMove,
			onPropertyDrop,
			root,
			sequential,
		} = this.props;

		const classes = getCN(
			'sheet',
			{'ac-segment-builder-web__criteria-group': criteria},
			root
				? 'ac-segment-builder-web__criteria-group--item-root'
				: 'ac-segment-builder-web__criteria-group--item',
			{'ac-segment-builder-web__criteria-group--dragging': dragging}
		);
		const singleRow =
			criteria && criteria.items && criteria.items.length === 1;

		if (this.isCriteriaEmpty()) {
			return (
				<EmptyDropZone
					id={id}
					onCriterionAdd={this.handleCriterionAdd}
					onPropertyDrop={onPropertyDrop}
					sequential={sequential}
				/>
			);
		}

		return connectDragPreview(
			<div className={classes}>
				<>
					<DropZone
						criteriaGroupId={criteriaGroupId}
						dropIndex={0}
						id={id}
						onCriterionAdd={this.handleCriterionAdd}
						onMove={onMove}
						onPropertyDrop={onPropertyDrop}
					/>

					{singleRow &&
						!root &&
						connectDragSource(
							<div className="ac-segment-builder-web__criteria-group-drag-icon ac-segment-builder-web__drag-icon">
								<ClayIcon className="icon-root" symbol="drag" />
							</div>
						)}

					{isCriterionGroup(criteria) &&
						criteria.items.map((criterion, index) => (
							<Fragment
								key={`${criteriaGroupId}-${
									isCriterionGroup(criterion)
										? criterion.criteriaGroupId
										: criterion.rowId
								}`}
							>
								{index !== 0 && this.renderConjunction(index)}

								{this.renderCriterion(criterion, index)}
							</Fragment>
						))}
				</>
			</div>
		);
	}
}

export default withDragSource(CriteriaGroup);
