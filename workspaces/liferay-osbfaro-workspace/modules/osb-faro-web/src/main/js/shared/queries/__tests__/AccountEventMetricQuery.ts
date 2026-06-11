/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import AccountEventMetricQuery from '../AccountEventMetricQuery';

describe('AccountEventMetricQuery', () => {
	const queryString =

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(AccountEventMetricQuery as any).loc?.source?.body ?? '';

	it('should include includeWebhookEvents', () => {
		expect(queryString).toContain('includeWebhookEvents: true');
	});
});
