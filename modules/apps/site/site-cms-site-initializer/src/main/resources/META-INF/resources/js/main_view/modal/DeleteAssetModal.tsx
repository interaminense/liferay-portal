/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openModal} from 'frontend-js-components-web';
import {sub} from 'frontend-js-web';
import React from 'react';

import {AssetUsageList} from '../../common/components/DeleteAssetUsageList';
import {AssetUsageTable} from '../../common/components/DeleteAssetUsageTable';

const openDeleteAssetModal = (itemsData: ItemData[], loadData?: () => {}) => {
	openModal({
		contentComponent: ({closeModal}: {closeModal: () => void}) =>
			AssetUsageList({
				closeModal,
				itemsData,
				loadData,
			}) as React.JSX.Element,
		size: 'lg',
		status: 'danger',
	});
};

const openAssetUsageModal = ({
	item,
	onClose,
}: {
	item: any;
	onClose?: () => void;
}) => {
	openModal({
		bodyComponent: AssetUsageTable,
		onClose,
		size: 'lg',
		title: sub(Liferay.Language.get('usages-of-x'), `"${item.title}"`),
	});
};

export {openDeleteAssetModal, openAssetUsageModal};
