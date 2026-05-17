/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import getCN from 'classnames';
import React from 'react';
import {ConnectDragSource, DragSource as dragSource} from 'react-dnd';

import {CatalogItem} from '../types';
import {DragTypes} from '../utils/drag-types';
import {generateRowId} from '../utils/utils';

/**
 * Builds the drag payload from a `CatalogItem`. The consumer pre-populates
 * the item with `defaultValue`, `touched`, and `valid` so this `beginDrag`
 * stays type-agnostic — for analytics-cloud that pre-population happens
 * inside `createAcCatalog`; for primitive consumers the defaults are static.
 */
const beginDrag = ({item}: {item: CatalogItem}) => ({
	criterion: {
		defaultValue: item.defaultValue,
		propertyName: item.name,
		rowId: generateRowId(),
		touched: item.touched ?? false,
		type: item.type,
		valid: item.valid ?? true,
	},
	property: item.metadata?.property,
});

interface ICriteriaSidebarItemProps {
	className?: string;
	connectDragSource: ConnectDragSource;
	dragging: boolean;
	item: CatalogItem;
}

class CriteriaSidebarItem extends React.Component<ICriteriaSidebarItemProps> {
	render() {
		const {className, connectDragSource, dragging, item} = this.props;

		const classes = getCN(
			'ac-segment-builder-web__sidebar-item',
			{'ac-segment-builder-web__sidebar-item--dragging': dragging},
			className
		);

		return connectDragSource(
			<li className={classes} data-testid={`criteria-item-${item.label}`}>
				<span className="inline-item">
					<ClayIcon className="icon-root" symbol="drag" />
				</span>

				<span className="ac-segment-builder-web__sidebar-item-type sticker">
					<span className="inline-item">
						<ClayIcon
							className="icon-root"
							symbol={item.icon ?? 'text'}
						/>
					</span>
				</span>

				{item.label}
			</li>
		);
	}
}

export default dragSource(
	DragTypes.Property,
	{
		beginDrag,
	},
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		dragging: monitor.isDragging(),
	})
)(CriteriaSidebarItem);
