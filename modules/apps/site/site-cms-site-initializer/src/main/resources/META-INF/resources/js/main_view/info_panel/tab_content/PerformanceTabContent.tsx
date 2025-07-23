/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {InContextAnalytics} from '@liferay/analytics-reports-js-components-web';
import React, {useContext} from 'react';

import {
	AssetTypeInfoPanelContext,
	IAssetTypeInfoPanelContext,
} from '../context';

const PerformanceTab = () => {
	const selectedAsset = useContext<IAssetTypeInfoPanelContext>(
		AssetTypeInfoPanelContext
	);

	return (
		<InContextAnalytics
			assetId={selectedAsset?.id}
			spaceId={selectedAsset?.objectEntries?.[0]?.embedded.scopeId}
		/>
	);
};

export default PerformanceTab;
