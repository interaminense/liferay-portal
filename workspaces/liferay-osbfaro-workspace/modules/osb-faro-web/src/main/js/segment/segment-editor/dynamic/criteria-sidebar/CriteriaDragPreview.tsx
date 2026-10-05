import ClayIcon from '@clayui/icon';
import ClaySticker from '@clayui/sticker';
import React from 'react';
import {DragTypes} from '../utils/drag-types';
import {getStickerStyle} from './stickerColors';
import {getTypeIcon} from './CriteriaSidebarItem';
import {Property} from 'shared/util/records';
import {useDragLayer} from 'react-dnd';

export default function CriteriaDragPreview() {
	const {currentOffset, isDragging, item, itemType} = useDragLayer(
		(monitor) => ({
			currentOffset: monitor.getClientOffset(),
			isDragging: monitor.isDragging(),
			item: monitor.getItem(),
			itemType: monitor.getItemType(),
		})
	);

	if (!isDragging || !currentOffset || itemType !== DragTypes.Property) {
		return null;
	}

	const {label, propertyKey, type} = item.property as Property;

	return (
		<div className="criteria-drag-preview position-fixed">
			<div
				className="align-items-center bg-white border c-gap-2 criteria-drag-preview-content d-flex font-weight-semi-bold pl-1 pr-2 py-1 rounded shadow text-3"
				data-testid="criteria-drag-preview"
				style={{
					transform: `translate(${currentOffset.x}px, ${currentOffset.y}px) translate(-16px, -50%)`,
				}}
			>
				<ClaySticker
					className="flex-shrink-0 rounded-lg"
					size="sm"
					style={getStickerStyle(propertyKey)}
				>
					<ClayIcon symbol={getTypeIcon(type)} />
				</ClaySticker>

				<span className="text-truncate">{label}</span>
			</div>
		</div>
	);
}
