/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openModal} from 'frontend-js-components-web';
import {fetch, sub} from 'frontend-js-web';

import {START_TASK} from '../../../common/utils/events';
import DeleteAssetEntriesBulkModalContent from '../../modal/DeleteAssetEntriesBulkModalContent';

function getBulkDeleteMessage(selectedData: any) {
	if (selectedData.items.length > 1 || selectedData.selectAll) {
		return {
			confirmationMessage: Liferay.Language.get(
				'some-items-are-being-used-in-other-assets-or-pages.-deleting-them-will-break-those-references-and-cause-broken-links-or-missing-content.-this-action-cannot-be-undone.-are-you-sure-you-want-to-continue'
			),

			title: sub(Liferay.Language.get('delete-x-items'), [
				selectedData.items.length,
			]),
		};
	}

	return {
		confirmationMessage: Liferay.Language.get(
			'this-item-is-being-used-in-other-assets-or-pages-deleting-it-will-break-those-references-and-cause-broken-links-or-missing-content-this-action-cannot-be-undone-are-you-sure-you-want-to-continue'
		),
		title: Liferay.Language.get('delete-item'),
	};
}

export default function deleteAssetEntriesBulkAction({
	loadData,
	selectedData,
}: {
	actionId: string;
	loadData?: () => {};
	selectedData: any;
}) {
	const {confirmationMessage, title} = getBulkDeleteMessage(selectedData);

	openModal({
		contentComponent: ({closeModal}: {closeModal: () => void}) =>
			DeleteAssetEntriesBulkModalContent({
				closeModal,
				confirmationMessage,
				title,
				selectedData,
			}),
		buttons: [
			{
				displayType: 'secondary',
				label: Liferay.Language.get('cancel'),
				onClick: ({processClose}) => {
					processClose();
				},
				type: 'cancel',
			},
		],

		size: 'md',

		// buttons: [
		// 	{
		// 		displayType: 'secondary',
		// 		label: Liferay.Language.get('cancel'),
		// 		onClick: ({processClose}) => {
		// 			processClose();
		// 		},
		// 		type: 'cancel',
		// 	},
		// 	{
		// 		displayType: 'danger',
		// 		label: Liferay.Language.get('delete'),
		// 		onClick: ({processClose}) => {
		// 			Liferay.fire(START_TASK, {actionId, selectedData});

		// 			processClose();
		// 		},
		// 	},
		// ],

		center: true,
		status: 'danger',
	});
}
