/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const assert = require('node:assert');
const {test} = require('node:test');

const {
	DEFAULT_MODEL,
	missingKeyError,
	resolveApiKey,
	resolveModel
} = require('../resolveConfig');

test('apiKey comes from the request', () => {
	assert.equal(resolveApiKey({apiKey: 'sk-req'}), 'sk-req');
});

test('apiKey is empty when the request has none; env is ignored', () => {
	assert.equal(resolveApiKey({}), '');

	// ANTHROPIC_API_KEY must NOT be consulted.
	assert.equal(
		resolveApiKey({apiKey: ''}, {ANTHROPIC_API_KEY: 'sk-env'}),
		''
	);
});

test('model comes from the request, else default; env is ignored', () => {
	assert.equal(resolveModel({model: 'm-req'}), 'm-req');
	assert.equal(resolveModel({}), DEFAULT_MODEL);

	// AC_CHAT_MODEL must NOT be consulted, even if present.
	assert.equal(resolveModel({}, {AC_CHAT_MODEL: 'm-env'}), DEFAULT_MODEL);
});

test('missingKeyError returns an error object when key is empty', () => {
	assert.deepEqual(missingKeyError(''), {
		error: 'API key is required.',
		ok: false
	});
});

test('missingKeyError returns null when a key is present', () => {
	assert.equal(missingKeyError('sk-x'), null);
});
