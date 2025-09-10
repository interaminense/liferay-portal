/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';
import {Text} from '@clayui/core';
import ClayModal from '@clayui/modal';
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import React, {useEffect, useState} from 'react';

import {
	AssetDeletionOverviewResponse,
	IDeleteProps,
} from './DeleteAssetUsageList';
import {ItemField} from './ItemField';

interface IDeleteMultipleAssets extends IDeleteProps {
	data: AssetDeletionOverviewResponse;
}

const DeleteMultipleAssets: React.FC<IDeleteMultipleAssets> = ({
	data,
	onClose,
	onDelete,
	onSelectItem,
}) => {
	const [selectedIds, setSelectedIds] = useState<number[]>(
		data.items.map((item) => item.id)
	);

	const [alert, setAlert] = useState<{
		displayType: string;
		title: string;
	} | null>(null);

	useEffect(() => {
		if (!selectedIds.length) {
			setAlert({
				displayType: 'warning',
				title: Liferay.Language.get(
					'to-perform-this-action,-please-select-an-item-to-delete'
				),
			});
		}
		else {
			setAlert(null);
		}
	}, [selectedIds]);

	return (
		<>
			<ClayModal.Body>
				<div className="mb-3">
					<Text>
						{Liferay.Language.get(
							'some-items-are-being-used-in-other-assets-or-pages.-deleting-them-will-break-those-references-and-cause-broken-links-or-missing-content.-this-action-cannot-be-undone.-are-you-sure-you-want-to-continue'
						)}
					</Text>
				</div>

				{alert && (
					<ClayAlert
						displayType={alert.displayType as any}
						title={alert.title}
					/>
				)}

				<FrontendDataSet
					bulkActions={[{}]}
					id="delete-assets-list"
					items={data.items}
					onDeltaChange={(delta) => {
						console.log('delta change', delta);
					}}
					onPageChange={(page) => {
						console.log('page changed', page);
					}}
					onSelectedItemsChange={setSelectedIds}
					pagination={{initialDelta: 20}}
					selectedItems={selectedIds}
					selectedItemsKey="id"
					selectionType="multiple"
					showPagination
					views={[
						{
							contentRenderer: 'list',
							label: Liferay.Language.get('list'),
							name: 'list',
							schema: {
								description: 'asset-description',
								symbol: 'document',
								title: 'name',
								titleRenderer: {
									component: ({itemData}) => (
										<div
											className="d-flex"
											key={itemData.id}
										>
											<ItemField
												itemData={itemData}
												onClose={() =>
													onSelectItem(itemData.id)
												}
											/>
										</div>
									),
								},
							},

							thumbnail: 'list',
						},
					]}
				/>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton displayType="secondary" onClick={onClose}>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							displayType="danger"
							onClick={() => {
								if (!selectedIds.length) {
									setAlert({
										displayType: 'danger',
										title: Liferay.Language.get(
											'unable-to-perform-this-action,-please-select-an-item-to-delete'
										),
									});
								}
								else {
									setAlert(null);

									onDelete();
								}
							}}
						>
							{Liferay.Language.get('delete')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</>
	);
};

export {DeleteMultipleAssets};
