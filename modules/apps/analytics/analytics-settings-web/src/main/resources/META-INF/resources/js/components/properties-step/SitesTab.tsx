/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import React from 'react';

import {TProperty} from '../../pages/wizard/PropertyStep';
import {fetchSites} from '../../utils/api';
import Tab, {TItem} from './Tab';

interface ISiteTabProps {
	onSitesChange: (items: TItem[]) => void;
	property: TProperty;
}

const SitesTab: React.FC<ISiteTabProps> = ({onSitesChange, property}) => (
	<Tab
		columns={['name', 'friendlyURL', 'channelName']}
		description="Channels can only be assigned to a single property at a time. Sites belonging to a channel will be automatically selected when a channel has been selected."
		emptyStateTitle={Liferay.Language.get('there-are-no-sites')}
		fetchFn={fetchSites}
		header={[
			{
				expanded: true,
				label: Liferay.Language.get('site-name'),
				value: 'siteName',
			},
			{
				expanded: true,
				label: Liferay.Language.get('friendly-url'),
				sortable: false,
				value: 'friendlyUrl',
			},
			{
				expanded: true,
				label: Liferay.Language.get('assigned-property'),
				value: 'assignedProperty',
			},
		]}
		onItemsChange={onSitesChange}
		property={property}
	/>
);

export default SitesTab;
