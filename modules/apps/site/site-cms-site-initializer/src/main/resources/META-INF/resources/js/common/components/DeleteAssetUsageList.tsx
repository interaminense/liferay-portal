/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayModal from '@clayui/modal';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {openModal} from 'frontend-js-components-web';
import {fetch, sub} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import deleteItemAction from '../../main_view/props_transformer/actions/deleteItemAction';
import ApiHelper from '../services/ApiHelper';
import {AssetUsageTable} from './DeleteAssetUsageTable';
import {DeleteMultipleAssets} from './DeleteMultipleAssets';
import {DeleteSingleItem} from './DeleteSingleAsset';

export type AssetDeletionOverviewResponse = {
	items: Item[];
	lastPage: number;
	page: number;
	pageSize: number;
	totalCount: number;
};

export type Item = {
	deletionType: 'PERMANENT_DELETION' | 'RECYCLE_BIN';
	id: number;
	mimeType: string;
	title: string;
	usages: number;
};

export interface IDeleteProps {
	onClose: () => void;
	onDelete: () => void;
	onSelectItem: (id: number) => void;
}

export interface AssetUsageListProps {
	closeModal: () => void;
	itemsData: ItemData[];
	loadData?: () => {};
}

const AssetUsageList: React.FC<AssetUsageListProps> = ({
	closeModal,
	itemsData,
	loadData,
}) => {
	const [data, setData] = useState<AssetDeletionOverviewResponse | null>(
		null
	);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsageAssetData = async () => {
			const {data, error} =
				await ApiHelper.post<AssetDeletionOverviewResponse>(
					'/o/analytics-cms-rest/v1.0/asset-deletion-overviews',
					itemsData.map(({embedded: {id}}) => id)
				);

			if (error) {
				console.error(error);
			}

			if (data) {
				setData(data);
			}

			setLoading(false);
		};

		fetchUsageAssetData();
	}, [itemsData]);

	if (loading) {
		return <ClayLoadingIndicator />;
	}

	if (!data) {
		return null;
	}

	const handleOpenUsageModal = (item: Item) => {
		openModal({
			contentComponent: ({closeModal}: {closeModal: () => void}) =>
				AssetUsageTable({closeModal, item}) as React.JSX.Element,
			size: 'lg',
		});
	};

	return (
		<ClayTooltipProvider>
			<div>
				<ClayModal.Header>
					{data.items.length === 1
						? sub(
								Liferay.Language.get('delete-x'),
								`"${data.items[0].title}"`
							)
						: sub(Liferay.Language.get('delete-x-items'), [
								data.items.length,
							])}
				</ClayModal.Header>

				{data.items.length === 1 ? (
					<DeleteSingleItem
						item={data.items[0]}
						onClose={closeModal}
						onDelete={() => {
							closeModal();

							deleteItemAction(itemsData[0], loadData);
						}}
						onSelectItem={() => {
							closeModal();

							handleOpenUsageModal(data.items[0]);
						}}
					/>
				) : (
					<DeleteMultipleAssets
						data={data}
						onClose={closeModal}
						onDelete={async () => {
							closeModal();

							const bulkActionItems = itemsData.map((item) => ({
								classExternalReferenceCode:
									item.embedded.externalReferenceCode,
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

							loadData?.();
						}}
						onSelectItem={(selectedItemId) => {
							closeModal();

							const item = items.find(
								(item) => item.id === selectedItemId
							);

							handleOpenUsageModal(item as Item);
						}}
					/>
				)}
			</div>
		</ClayTooltipProvider>
	);
};

export {AssetUsageList};
