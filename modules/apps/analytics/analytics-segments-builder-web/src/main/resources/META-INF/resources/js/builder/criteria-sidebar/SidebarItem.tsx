/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import React from 'react';
import {useDrag} from 'react-dnd';

import {DragTypes} from '../utils/drag-types';
import {Property} from '../utils/types';

const ICON_FOR_TYPE: Record<string, string> = {
	boolean: 'check-square',
	date: 'calendar',
	number: 'pound',
	text: 'text',
};

export const SidebarItem = ({property}: {property: Property}) => {
	const [{isDragging}, dragRef] = useDrag({
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: {property, type: DragTypes.Property},
	});

	return (
		<div
			className={classNames('sidebar-item', {dragging: isDragging})}
			ref={dragRef as any}
		>
			<ClayIcon
				className="sidebar-item-icon"
				symbol={ICON_FOR_TYPE[property.type] || 'asterisk'}
			/>

			<span className="sidebar-item-label">{property.label}</span>

			<ClayIcon className="sidebar-item-drag" symbol="drag" />
		</div>
	);
};
