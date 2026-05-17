/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import React from 'react';

import PocBuilderSharedPage from './PocBuilderSharedPage';
import {FilterStringSerializer} from './filterStringSerializer';

export default function PocBuilderFilterStringDemoPage() {
	return (
		<PocBuilderSharedPage
			createUrlPath='/poc-builder-filter-string-format'
			heading='Segment Builder PoC — Filter String format'
			outputDescription='Drag a primitive criterion from the sidebar into the canvas. The output panel below renders the tree as an OData-flavoured filter string — the same shape analytics-cloud persists via buildQueryString.'
			outputLabel='Serialized output (filter string)'
			serializer={FilterStringSerializer}
		/>
	);
}
