/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Text} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import getCN from 'classnames';
import React, {Component} from 'react';
import {
	ConnectDropTarget,
	DropTarget as dropTarget,
	DropTargetMonitor,
} from 'react-dnd';

import {compose} from '../utils/compose';
import {DragTypes} from '../utils/drag-types';
import {OnCriterionAdd} from '../utils/types';

const canDrop = (): boolean => true;

const drop = (
	{
		onCriterionAdd,
		onPropertyDrop,
	}: {
		onCriterionAdd: OnCriterionAdd;
		onPropertyDrop?: (item: {criterion: any; property?: any}) => void;
	},
	monitor: DropTargetMonitor
): void => {
	const item = monitor.getItem();

	if (item.property && onPropertyDrop) {
		onPropertyDrop(item);
	}

	onCriterionAdd(0, item.criterion);
};

interface IEmptyDropZone extends React.HTMLAttributes<HTMLDivElement> {
	canDrop: boolean;
	connectDropTarget: ConnectDropTarget;
	hover?: boolean;
	onCriterionAdd: OnCriterionAdd;
	onPropertyDrop?: (item: {criterion: any; property?: any}) => void;
	sequential: boolean;
}

class EmptyDropZone extends Component<IEmptyDropZone> {
	render() {
		const {canDrop, connectDropTarget, hover, sequential} = this.props;

		const targetClasses = getCN(
			'ac-segment-builder-web__empty-drop-zone-target',
			{
				'ac-segment-builder-web__empty-drop-zone-target--hover':
					canDrop && hover,
				'ac-segment-builder-web__empty-drop-zone-target--sequential':
					sequential,
			}
		);

		return (
			<div className="ac-segment-builder-web__empty-drop-zone">
				{connectDropTarget(
					<div className={targetClasses}>
						<div className="ac-segment-builder-web__empty-drop-zone-indicator" />

						<div className="ac-segment-builder-web__empty-drop-zone-message">
							<div>
								<ClayIcon
									className="icon-root icon-size-md mr-3"
									symbol="ac_rule"
								/>

								<Text size={4}>
									{Liferay.Language.get(
										'drag-and-drop-criterion-from-the-right-to-add-rules'
									)}
								</Text>
							</div>

							{!sequential && (
								<div>
									<ClayIcon
										className="icon-root icon-size-md mr-3"
										symbol="ac_group"
									/>

									<Text size={4}>
										{Liferay.Language.get(
											'drag-and-drop-over-an-existing-criteria-to-form-groups'
										)}
									</Text>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default compose<React.ComponentType<any>>(
	dropTarget(
		DragTypes.Property,
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
)(EmptyDropZone);
