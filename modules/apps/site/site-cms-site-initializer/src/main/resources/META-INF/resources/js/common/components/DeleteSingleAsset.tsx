/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {Text} from '@clayui/core';
import ClayList from '@clayui/list';
import ClayModal from '@clayui/modal';
import React from 'react';

import {IDeleteProps, Item} from './DeleteAssetUsageList';
import {ItemField} from './ItemField';

interface IDeleteSingleAsset extends IDeleteProps {
	item: Item;
}

const DeleteSingleItem: React.FC<IDeleteSingleAsset> = ({
	item,
	onClose,
	onDelete,
	onSelectItem,
}) => {
	return (
		<>
			<ClayModal.Body>
				<div className="mb-3">
					<Text>
						{Liferay.Language.get(
							'this-item-is-being-used-in-other-assets-or-pages-deleting-it-will-break-those-references-and-cause-broken-links-or-missing-content-this-action-cannot-be-undone-are-you-sure-you-want-to-continue'
						)}
					</Text>
				</div>

				<ClayList>
					<ClayList.Item flex>
						<ItemField
							itemData={item}
							onClose={() => onSelectItem(item.id)}
						/>
					</ClayList.Item>
				</ClayList>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton displayType="danger" onClick={onDelete}>
							{Liferay.Language.get('delete-asset')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</>
	);
};

export {DeleteSingleItem};
