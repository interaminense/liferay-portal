/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openModal} from 'frontend-js-components-web';
import {sub} from 'frontend-js-web';

import AssetBatchService from '../../../common/services/AssetBatchService';
import SpaceService from '../../../common/services/SpaceService';
import {
	displayDeletionRequestAcceptedToast,
	displayErrorToast,
} from '../../../common/utils/toastUtil';
import {isFromRecycleBin} from '../utils/isFromRecycleBin';

/**
 * Executes the bulk delete action.
 */
export async function executeBulkDeleteAction({
	selectedData,
}: {
	selectedData: {
		items: ItemData[];
		selectAll: boolean;
	};
}) {
	const bulkActionItems = selectedData.items.map((item: any) => ({
		classExternalReferenceCode: item.embedded.externalReferenceCode,
		className: item.entryClassName,
		classPK: item.embedded.id,
		name: item.embedded.title,
	}));

	const {error} = await AssetBatchService.deleteAssetEntries({
		items: bulkActionItems,
		selectAll: selectedData.selectAll,
	});

	if (error) {
		displayErrorToast();
	}
	else {
		displayDeletionRequestAcceptedToast();
	}
}

/**
 * Returns the confirmation message and title for bulk delete modal.
 */
function getBulkDeleteMessage(selectedData: {
	items: ItemData[];
	selectAll: boolean;
}): {
	confirmationMessage: string;
	title: string;
} {
	if (selectedData.selectAll) {
		return {
			confirmationMessage: Liferay.Language.get(
				'delete-all-entries-confirmation'
			),
			title: Liferay.Language.get('delete-all-entries'),
		};
	}
	else if (selectedData.items.length > 1) {
		return {
			confirmationMessage: sub(
				Liferay.Language.get('delete-entries-confirmation'),
				[selectedData.items.length]
			),
			title: Liferay.Language.get('delete-entries'),
		};
	}

	return {
		confirmationMessage: Liferay.Language.get('delete-entry-confirmation'),
		title: Liferay.Language.get('delete-entry'),
	};
}

/**
 * Fetches asset library spaces for the given items.
 */
async function getEntriesSpaces(items: ItemData[]): Promise<any[]> {
	const promises = items
		.filter((item) => item.embedded.externalReferenceCode)
		.map((item) =>
			SpaceService.getSpace({
				spaceId: item.embedded.scopeId,
			})
		);

	return (await Promise.all(promises)).filter(Boolean);
}

/**
 * Shows the bulk delete confirmation modal.
 */
async function showModal({
	confirmationMessage,
	selectedData,
	title,
}: {
	confirmationMessage: string;
	selectedData: {items: ItemData[]; selectAll: boolean};
	title: string;
}): Promise<void> {
	openModal({
		bodyHTML: `
			<div>
				<p>
					${confirmationMessage}
				</p>
			</div>
		`,
		buttons: [
			{
				displayType: 'secondary',
				label: Liferay.Language.get('cancel'),
				onClick: ({processClose}: {processClose: () => void}) => {
					processClose();
				},
				type: 'cancel',
			},
			{
				displayType: 'danger',
				label: Liferay.Language.get('delete'),
				onClick: async ({processClose}: {processClose: () => void}) => {
					await executeBulkDeleteAction({
						selectedData,
					});

					processClose();
				},
			},
		],
		center: true,
		status: 'danger',
		title,
	});
}

/**
 * Entry point for bulk delete action.
 */
export async function deleteAssetEntriesBulkAction({
	selectedData,
}: {
	selectedData: {items: ItemData[]; selectAll: boolean};
}): Promise<void> {
	const spaces = await getEntriesSpaces(selectedData.items);

	// Trash status checks

	const allEntriesHaveTrashEnabled = spaces.every(
		(space) => space.settings.trashEnabled
	);
	const noEntriesHaveTrashEnabled = spaces.every(
		(space) => !space.settings.trashEnabled
	);
	const someEntriesHaveTrashEnabled = spaces.some(
		(space) => space.settings.trashEnabled
	);

	const {confirmationMessage, title} = getBulkDeleteMessage(selectedData);

	// Scenario 1: All spaces have trash disabled

	if (noEntriesHaveTrashEnabled) {
		showModal({
			confirmationMessage,
			selectedData,
			title,
		});
	}

	// Scenario 2: Some spaces have trash enabled, but not all

	else if (someEntriesHaveTrashEnabled && !allEntriesHaveTrashEnabled) {
		showModal({
			confirmationMessage: Liferay.Language.get(
				'bulk-delete-cms-entries-confirmation'
			),
			selectedData,
			title: Liferay.Language.get('delete-entries'),
		});
	}

	// Scenario 3: All spaces have trash enabled

	else if (allEntriesHaveTrashEnabled) {
		if (!isFromRecycleBin(selectedData)) {
			await executeBulkDeleteAction({selectedData});
		}
		else {
			showModal({
				confirmationMessage,
				selectedData,
				title,
			});
		}
	}
}
