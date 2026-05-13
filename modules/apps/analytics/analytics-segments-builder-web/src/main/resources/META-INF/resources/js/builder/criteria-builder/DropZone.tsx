/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import classNames from 'classnames';
import React from 'react';
import {useDrop} from 'react-dnd';

import {DragTypes} from '../utils/drag-types';
import {Property} from '../utils/types';

interface IDropZoneProps {
	onDropProperty: (property: Property) => void;
}

export const DropZone = ({onDropProperty}: IDropZoneProps) => {
	const [{canDrop, isOver}, dropRef] = useDrop({
		accept: DragTypes.Property,
		collect: (monitor) => ({
			canDrop: monitor.canDrop(),
			isOver: monitor.isOver({shallow: true}),
		}),
		drop: (item: {property: Property}, monitor) => {
			if (monitor.didDrop()) {
				return;
			}

			onDropProperty(item.property);
		},
	});

	return (
		<div
			className={classNames('criteria-drop-zone', {
				'can-drop': canDrop,
				'is-over': isOver,
			})}
			ref={dropRef as any}
		/>
	);
};
