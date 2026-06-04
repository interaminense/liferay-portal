/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import AiAssistantForm from './AiAssistantForm';
import BasePage from 'settings/components/base-page/BasePage';
import Card from 'shared/components/Card';
import React from 'react';

export const AiAssistant = () => (
	<BasePage
		pageDescription={Liferay.Language.get(
			'configure-the-anthropic-api-key-and-model-used-by-the-ai-assistant'
		)}
		pageTitle={Liferay.Language.get('ai-assistant')}
	>
		<Card pageDisplay>
			<AiAssistantForm />
		</Card>
	</BasePage>
);

export default AiAssistant;
