/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import ClayLabel from '@clayui/label';
import ClayList from '@clayui/list';
import {sub} from 'frontend-js-web';
import React from 'react';

import {AssetIcon, MimeTypes} from './AssetIcon';
import {Item} from './DeleteAssetUsageList';

interface IItemFieldProps {
	itemData: Item;
	onClose: () => void;
}

const ItemField: React.FC<IItemFieldProps> = ({itemData, onClose}) => {
	return (
		<>
			<ClayList.ItemField>
				<AssetIcon mimeType={itemData.mimeType as MimeTypes} />
			</ClayList.ItemField>

			<ClayList.ItemField expand>
				<ClayList.ItemTitle>{itemData.title}</ClayList.ItemTitle>

				<ClayList.ItemText>
					{sub(Liferay.Language.get('x-usages'), [itemData.usages])}
				</ClayList.ItemText>

				<ClayList.ItemText>
					<ClayLabel
						displayType={
							itemData.deletionType === 'PERMANENT_DELETION'
								? 'danger'
								: 'secondary'
						}
					>
						{itemData.deletionType === 'PERMANENT_DELETION'
							? Liferay.Language.get('permanent-deletion')
							: Liferay.Language.get('recycle-bin')}
					</ClayLabel>
				</ClayList.ItemText>
			</ClayList.ItemField>

			<ClayList.ItemField>
				<ClayButtonWithIcon
					aria-label={Liferay.Language.get('view-usages')}
					className="border-0"
					data-testid="view-usages-button"
					data-tooltip-align="top"

					// disabled={itemData.usages === 0}

					displayType="secondary"
					onClick={onClose}
					symbol="list-ul"
					title={Liferay.Language.get('view-usages')}
				/>
			</ClayList.ItemField>
		</>
	);
};

export {ItemField};
