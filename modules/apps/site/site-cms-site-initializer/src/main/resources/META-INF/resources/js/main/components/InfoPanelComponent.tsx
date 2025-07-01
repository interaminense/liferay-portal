/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {SidePanel} from '@clayui/core';
import React from 'react';

type Item = {
	embedded: {
		content: string;
		contentRawText: string;
		content_i18n: Record<string, string>;
		creator: {
			additionalName: '';
			contentType: 'UserAccount';
			externalReferenceCode: string;
			familyName: string;
			givenName: string;
			id: number;
			name: string;
		};
		dateCreated: string;
		dateModified: string;
		defaultLanguageId: string;
		externalReferenceCode: string;
		friendlyUrlPath: string;
		id: number;
		keywords: string[];
		objectEntryFolderExternalReferenceCode: string;
		objectEntryFolderId: number;
		scopeId: number;
		scopeKey: string;
		status: {
			code: number;
			label: string;
			label_i18n: string;
		};
		systemProperties: {
			version: {
				number: number;
			};
		};
		taxonomyCategoryBriefs: any[];
		title: string;
		title_i18n: {
			en_US?: string;
		};
	};
};

export default function InfoPanelComponent({items}: {items: Item[]}) {

	// Workaround

	if (!items.length || items.length > 1) {
		return null;
	}

	const {embedded} = items[0];

	const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId();

	// @ts-ignore

	const title = embedded.title[defaultLanguageId] || embedded.title['en_US'];

	return (
		<>
			<SidePanel.Header>{title}</SidePanel.Header>

			<SidePanel.Body>hello, world!</SidePanel.Body>
		</>
	);
}
