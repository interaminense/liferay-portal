/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import AccountUserSessionQuery from '../AccountUserSessionQuery';

describe('AccountUserSessionQuery', () => {
	const queryString =

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(AccountUserSessionQuery as any).loc?.source?.body ?? '';

	it('includes includeWebhookEvents', () => {
		expect(queryString).toContain('includeWebhookEvents: true');
	});
});
