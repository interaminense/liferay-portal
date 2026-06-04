/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {toStatus} from '../validateResult';

describe('ai-assistant/validateResult', () => {
	it('maps ok to a success status', () => {
		expect(toStatus({ok: true})).toEqual({
			displayType: 'success',
			message: Liferay.Language.get('connection-successful')
		});
	});

	it('surfaces the server error on failure', () => {
		expect(
			toStatus({error: 'Anthropic API returned 401.', ok: false})
		).toEqual({
			displayType: 'danger',
			message: 'Anthropic API returned 401.'
		});
	});

	it('falls back to a generic message when no error is given', () => {
		expect(toStatus({ok: false})).toEqual({
			displayType: 'danger',
			message: Liferay.Language.get('connection-failed')
		});
	});
});
