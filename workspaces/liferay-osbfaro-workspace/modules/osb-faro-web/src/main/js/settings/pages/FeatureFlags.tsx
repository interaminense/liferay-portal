/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayPanel from '@clayui/panel';
import React from 'react';
import BasePage from 'settings/components/base-page/BasePage';
import ToggleSwitch from 'shared/components/ToggleSwitch';
import {
	FEATURE_FLAGS,
	FeatureFlagKey,
	isFeatureFlagEnabled,
	setFeatureFlag,
} from 'shared/util/feature-flags';
import {reloadPage} from 'shared/util/router';

/**
 * Hidden, URL-only panel (`/workspace/:groupId/settings/feature-flags`) for
 * toggling the runtime feature flags defined in `shared/util/feature-flags.ts`.
 * Toggles are persisted to `localStorage`; since the flags are resolved at
 * module load, toggling one reloads the page so the change takes effect.
 */
const FeatureFlags = () => {
	const handleToggle =
		(key: FeatureFlagKey) => (event: React.FormEvent<HTMLInputElement>) => {
			setFeatureFlag(key, event.currentTarget.checked);

			reloadPage();
		};

	return (
		<BasePage pageTitle="Feature Flags">
			<ClayPanel.Group className="mb-4">
				{FEATURE_FLAGS.map(({key}) => (
					<ClayPanel displayType="secondary" key={key}>
						<ClayPanel.Header className="align-items-center d-flex justify-content-between">
							<span>{key}</span>

							<ToggleSwitch
								checked={isFeatureFlagEnabled(key)}
								name={key}
								onChange={handleToggle(key)}
							/>
						</ClayPanel.Header>
					</ClayPanel>
				))}
			</ClayPanel.Group>
		</BasePage>
	);
};

export default FeatureFlags;
