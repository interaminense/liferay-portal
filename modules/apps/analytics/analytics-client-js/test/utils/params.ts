/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {getSearchParams} from '../../src/utils/params';

beforeEach(() => {
	delete window.location;

	window.location = {search: ''};
});

describe('getSearchParams', () => {
	test('should return an instance of URLSearchParams when available', () => {
		window.URLSearchParams = jest
			.fn()
			.mockImplementation(() => ({get: jest.fn(() => 'value')}));
		window.location.search = '?key=value';

		const params = getSearchParams();
		expect(params.get('key')).toBe('value');
	});

	test('should return an object when URLSearchParams is not available', () => {
		delete window.URLSearchParams;
		window.location.search = '?key=value';

		const params = getSearchParams();
		expect(params.get('key')).toBe('value');
	});

	test('should handle multiple parameters in the query string', () => {
		delete window.URLSearchParams;
		window.location.search = '?key1=value1&key2=value2';

		const params = getSearchParams();
		expect(params.get('key1')).toBe('value1');
		expect(params.get('key2')).toBe('value2');
	});

	test('should handle parameters without values', () => {
		delete window.URLSearchParams;
		window.location.search = '?key1=&key2';

		const params = getSearchParams();
		expect(params.get('key1')).toBe('');
		expect(params.get('key2')).toBe('');
	});

	test('should return an empty object when there are no parameters in the URL', () => {
		delete window.URLSearchParams;
		window.location.search = '';

		const params = getSearchParams();
		expect(params.get('key')).toBeUndefined();
	});
});
