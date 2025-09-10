/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Alert from '@clayui/alert';
import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import Label from '@clayui/label';
import List from '@clayui/list';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {openModal, openToast} from 'frontend-js-components-web';
import {fetch, sub} from 'frontend-js-web';
import React, {useCallback, useEffect, useReducer, useState} from 'react';

import {openAssetUsageModal} from './DeleteAssetModal';

import '../../../css/components/BulkActionsAssetModal.scss';

interface IAssetDeletionOverview {
	deletionType: 'PERMANENT_DELETION' | 'RECYCLE_BIN';
	id: number;
	title: string;
	usages: number;
}

type AlertStates = {
	deleteAttemptWithoutSelection: string;
	hidden: string;
	noItemsSelected: string;
};

const alertStates: AlertStates = {
	deleteAttemptWithoutSelection: Liferay.Language.get(
		'unable-to-perform-this-action,-please-select-an-item-to-delete'
	),
	hidden: 'HIDDEN',
	noItemsSelected: Liferay.Language.get(
		'to-perform-this-action,-please-select-an-item-to-delete'
	),
};

function alertReducer(state: any, action: {type: string}) {
	switch (action.type) {
		case 'SHOW_NO_ITEMS_SELECTED':
			return {
				...state,
				displayType: 'warning',
				type: alertStates.noItemsSelected,
			};

		case 'SHOW_DELETE_ATTEMPT_WITHOUT_SELECTION':
			return {
				...state,
				displayType: 'danger',
				type: alertStates.deleteAttemptWithoutSelection,
			};

		case 'HIDE':
			return {...state, type: alertStates.hidden};
		default:
			return state;
	}
}

const initialAlertState = {
	type: alertStates.hidden,
};

export default function DeleteAssetEntriesBulkModalContent({
	closeModal,
	confirmationMessage,
	loadData,
	selectedData,
	title,
}: {
	closeModal: () => void;
	confirmationMessage: string;
	loadData?: () => {};
	selectedData: any;
	title: string;
}) {
	const [alert, dispatchAlert] = useReducer(alertReducer, initialAlertState);
	const [assetOverviews, setAssetOverviews] = useState<
		IAssetDeletionOverview[]
	>([]);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);

	const fetchAssetDeletionOverviews = useCallback(async (
		ids: number[]
	): Promise<IAssetDeletionOverview[]> => {
		try {

			// TODO: implement fetch with endpoint below

			const endpoint = `/o/analytics-cms-rest/v1.0/asset-deletion-overviews?assetIds=${ids.join(
				','
			)}`;
		}
		catch (error) {
			console.error(error);
		}

		// mocked response

		return ids.map((id, index) => ({
			deletionType:
				index % 2 === 0 ? 'PERMANENT_DELETION' : 'RECYCLE_BIN',
			id,
			title: selectedData.items[index].title,
			usages: Math.floor(Math.random() * 10),
		}));
	}, [selectedData.items]);

	const handleDelete = async () => {
		try {
			if (!selectedAssetIds.length) {
				dispatchAlert({type: 'SHOW_DELETE_ATTEMPT_WITHOUT_SELECTION'});

				return;
			}

			setIsDeleting(true);
			closeModal();

			const bulkActionItems = selectedData.items.map((item: any) => ({
				classExternalReferenceCode: item.embedded.externalReferenceCode,
				className: item.entryClassName,
				classPK: item.embedded.id,
				name: item.embedded.title,
			}));

			await fetch('/o/headless-cms/v1.0/bulk-action', {
				body: JSON.stringify({
					bulkActionItems,
					selectAll: false,
					type: 'DeleteBulkAction',
				}),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-csrf-token': Liferay.authToken,
				},
				method: 'POST',
			});

			const assetsWithRecycleBinEnabled = assetOverviews.filter(
				({deletionType}) => deletionType === 'RECYCLE_BIN'
			);

			const assetsWithPermanentDeletion = assetOverviews.filter(
				({deletionType}) => deletionType === 'PERMANENT_DELETION'
			);

			// TODO: ver se precisa criar essas langs ou se vao vir no PR de rebeca

			const deletionResults = [
				{
					assets: assetsWithRecycleBinEnabled,
					messageKey: 'x-items-were-moved-to-the-recycle-bin',
				},
				{
					assets: assetsWithPermanentDeletion,
					messageKey: 'x-items-were-permanently-deleted',
				},
			];

			deletionResults.forEach(({assets, messageKey}) => {
				if (assets.length) {
					openToast({
						message: sub(Liferay.Language.get(messageKey), [
							assets.length,
						]),
						type: 'success',
					});
				}
			});

			loadData?.();
		}
		catch (error) {
			openToast({
				message: Liferay.Language.get('an-error-occurred'),
				type: 'danger',
			});
		}
		finally {
			setIsDeleting(false);
		}
	};

	const handleSelectedItemsChange = useCallback(
		(newSelectedItems: IAssetDeletionOverview[]) => {
			const newSelectedIds = newSelectedItems.map(({id}) => id);

			setSelectedAssetIds(newSelectedIds);

			if (!newSelectedIds.length) {
				dispatchAlert({
					type: 'SHOW_NO_ITEMS_SELECTED',
				});
			}
			else {
				dispatchAlert({type: 'HIDE'});
			}
		},
		[dispatchAlert]
	);

	const handleViewUsage = (item: any) => {
		closeModal();

		openAssetUsageModal({
			item,
			onClose: () => {
				openModal({
					contentComponent: ({
						closeModal: newCloseModal,
					}: {
						closeModal: () => void;
					}) =>
						DeleteAssetEntriesBulkModalContent({
							closeModal: newCloseModal,
							confirmationMessage,
							selectedData,
							title,
						}),
					size: 'md',
					status: 'danger',
				});
			},
		});
	};

	const ItemFieldRenderer = ({
		itemData: {deletionType, id, title, usages},
	}: {
		itemData: {
			deletionType: string;
			id: number;
			title: string;
			usages: number;
		};
	}) => {
		const isRecycleBinEnabled = deletionType === 'RECYCLE_BIN';

		return (
			<div className="d-flex" key={id}>
				<span className="d-flex justify-content-center">
					<List.ItemField>
						<ClayIcon className="mt-1" symbol="web-content" />
					</List.ItemField>
				</span>

				<List.ItemField expand>
					<List.ItemTitle>{title}</List.ItemTitle>

					<List.ItemText>{`${usages} ${Liferay.Language.get('usages')}`}</List.ItemText>

					<List.ItemText>
						<Label
							displayType={
								isRecycleBinEnabled ? 'secondary' : 'danger'
							}
						>
							{isRecycleBinEnabled
								? Liferay.Language.get('recycle-bin')
								: Liferay.Language.get('permanent-deletion')}
						</Label>
					</List.ItemText>
				</List.ItemField>

				{/* <List.ItemField>
					<List.QuickActionMenu>
						<ClayTooltipProvider>
							<span>
								<List.QuickActionMenu.Item
									data-tooltip-align="top"
									aria-label="Usage"
									onClick={() => handleViewUsage({id, title})}
									symbol="list-ul"
									title={Liferay.Language.get('view-usage')}
								/>
							</span>
						</ClayTooltipProvider>
					</List.QuickActionMenu>
				</List.ItemField> */}
			</div>
		);
	};

	useEffect(() => {
		const itemsIds = selectedData.items.map(
			(item: any) => item.embedded.id
		);

		if (itemsIds.length) {
			fetchAssetDeletionOverviews(itemsIds).then((data) => {
				setAssetOverviews(data);
				setSelectedAssetIds(data.map(({id}) => id));
				setIsLoading(false);
			});
		}
		else {
			setIsLoading(false);
			dispatchAlert({type: 'SHOW_NO_ITEMS_SELECTED'});
		}
	}, [fetchAssetDeletionOverviews, selectedData.items]);

	console.log('selectedData', selectedData);

	return (
		<div>
			<ClayModal.Header>{title}</ClayModal.Header>

			<ClayModal.Body>
				<p>{confirmationMessage}</p>

				{alert.type !== alertStates.hidden && (
					<Alert
						displayType={alert.displayType}
						title={Liferay.Language.get(
							alert.displayType === 'danger' ? 'Error' : 'Warning'
						)}
					>
						{alert.type}
					</Alert>
				)}

				{isLoading ? (
					<div className="text-center">
						<ClayLoadingIndicator />
					</div>
				) : (
					<FrontendDataSet
						bulkActions={[{}]}
						id="delete-assets-list"
						items={assetOverviews}
						itemsActions={[
							{
								icon: 'list-ul',
								label: Liferay.Language.get('view-usage'),
								onClick: ({itemData}: {itemData: any}) =>
									handleViewUsage(itemData),
								type: 'item',
							},
						]}
						onSelectedItemsChange={handleSelectedItemsChange}
						pagination={{initialDelta: 20}}
						selectedItems={selectedAssetIds}
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
										component: ItemFieldRenderer,
									},
								},

								thumbnail: 'list',
							},
						]}
					/>
				)}
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							className="btn-cancel"
							displayType="secondary"
							onClick={closeModal}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton displayType="danger" onClick={handleDelete}>
							{isDeleting && (
								<span className="inline-item inline-item-before">
									<ClayLoadingIndicator size="sm" />
								</span>
							)}

							{Liferay.Language.get('delete-asset')}
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</div>
	);
}
