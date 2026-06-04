/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {decodeBasic, encodeBasic} from '../basicAuth';

describe('ai-assistant/basicAuth', () => {
	it('encodes username and password into a Basic header', () => {
		expect(
			encodeBasic({password: 'test', username: 'me@liferay.com'})
		).toBe(`Basic ${btoa('me@liferay.com:test')}`);
	});

	it('returns an empty string when both fields are empty', () => {
		expect(encodeBasic({password: '', username: ''})).toBe('');
	});

	it('round-trips through decode, splitting on the first colon', () => {
		const header = encodeBasic({password: 'p:w', username: 'user'});

		expect(decodeBasic(header)).toEqual({
			password: 'p:w',
			username: 'user'
		});
	});

	it('returns empty fields for a non-Basic or empty header', () => {
		expect(decodeBasic('Bearer xyz')).toEqual({
			password: '',
			username: ''
		});
		expect(decodeBasic('')).toEqual({password: '', username: ''});
	});
});
