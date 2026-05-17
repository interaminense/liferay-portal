/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import getCN from 'classnames';
import React from 'react';
import {
	ConnectDropTarget,
	DropTarget as dropTarget,
	DropTargetMonitor,
} from 'react-dnd';

import {compose} from '../utils/compose';
import {DragTypes} from '../utils/drag-types';
import {OnCriterionAdd, OnMove} from '../utils/types';

const acceptedDragTypes = [
	DragTypes.CriteriaGroup,
	DragTypes.CriteriaRow,
	DragTypes.Property,
];

/**
 * Prevents groups from dropping within itself and all items from dropping into
 * a position that would not change its current position.
 */
const canDrop = (
	{
		criteriaGroupId: destGroupId,
		dropIndex: destIndex,
	}: {
		criteriaGroupId: string;
		dropIndex: number;
	},
	monitor: DropTargetMonitor
): boolean => {
	const {
		childGroupIds = [],
		criteriaGroupId: startGroupId,
		criterion,
		index: startIndex,
	} = monitor.getItem();

	const disallowedGroupIds = [criterion.criteriaGroupId, ...childGroupIds];

	const sameOrNestedGroup =
		monitor.getItemType() === DragTypes.CriteriaGroup &&
		disallowedGroupIds.includes(destGroupId);

	const sameIndexInSameGroup =
		startGroupId === destGroupId &&
		(startIndex === destIndex || startIndex === destIndex - 1);

	return !(sameOrNestedGroup || sameIndexInSameGroup);
};

/**
 * Implements the behavior of what will occur when an item is dropped. For
 * properties dropped from the sidebar, a new criterion is added and the
 * optional `onPropertyDrop` callback fires with the drag payload so adapters
 * can record the referenced property. For rows and groups, the item moves to
 * the drop position.
 */
const drop = (
	{
		criteriaGroupId: destGroupId,
		dropIndex: destIndex,
		onCriterionAdd,
		onMove,
		onPropertyDrop,
	}: {
		criteriaGroupId: string;
		dropIndex: number;
		onCriterionAdd: OnCriterionAdd;
		onMove: OnMove;
		onPropertyDrop?: (item: {criterion: any; property?: any}) => void;
	},
	monitor: DropTargetMonitor
): void => {
	const item = monitor.getItem();
	const {criteriaGroupId: startGroupId, criterion, index: startIndex} = item;

	const itemType = monitor.getItemType();

	if (itemType === DragTypes.Property) {
		if (onPropertyDrop) {
			onPropertyDrop(item);
		}

		onCriterionAdd(destIndex, criterion);
	}
	else if (
		itemType === DragTypes.CriteriaRow ||
		itemType === DragTypes.CriteriaGroup
	) {
		onMove(startGroupId, startIndex, destGroupId, destIndex, criterion);
	}
};

interface IDropZoneProps {
	before?: boolean;
	canDrop: boolean;
	connectDropTarget: ConnectDropTarget;
	criteriaGroupId: string;
	dropIndex: number;
	hover?: boolean;
	onCriterionAdd: OnCriterionAdd;
	onMove: OnMove;
	onPropertyDrop?: (item: {criterion: any; property?: any}) => void;
}

const DropZone: React.FC<IDropZoneProps> = ({
	before,
	canDrop,
	connectDropTarget,
	hover,
}) => (
	<div className="ac-segment-builder-web__drop-zone">
		{connectDropTarget(
			<div
				className={getCN('ac-segment-builder-web__drop-zone-target', {
					'ac-segment-builder-web__drop-zone-target--before': before,
				})}
			>
				{canDrop && hover && (
					<div className="ac-segment-builder-web__drop-zone-indicator" />
				)}
			</div>
		)}
	</div>
);

export default compose<React.ComponentType<any>>(
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
)(DropZone);
