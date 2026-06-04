/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const assert = require('node:assert');
const {test} = require('node:test');

const {evaluateToolCall} = require('../readOnlyGuard');

const CALL = 'mcp__liferay-ac-stg__call-http-endpoint';
const CHART = 'mcp__faro_chart__render_chart';

test('allows a GET call-http-endpoint', () => {
	const result = evaluateToolCall(CALL, {method: 'GET', path: '/o/x'});

	assert.strictEqual(result.allow, true);
});

test('allows a call-http-endpoint with no method (read defaults to GET)', () => {
	const result = evaluateToolCall(CALL, {path: '/o/x'});

	assert.strictEqual(result.allow, true);
});

test('denies a POST call-http-endpoint', () => {
	const result = evaluateToolCall(CALL, {method: 'POST', path: '/o/x'});

	assert.strictEqual(result.allow, false);
	assert.match(result.reason, /read-only/i);
});

test('denies PUT, PATCH and DELETE call-http-endpoint', () => {
	for (const method of ['PUT', 'PATCH', 'DELETE']) {
		assert.strictEqual(
			evaluateToolCall(CALL, {method}).allow,
			false,
			`expected ${method} to be denied`
		);
	}
});

test('treats the method case-insensitively', () => {
	assert.strictEqual(evaluateToolCall(CALL, {method: 'post'}).allow, false);
	assert.strictEqual(evaluateToolCall(CALL, {method: 'get'}).allow, true);
});

test('allows the discovery tools get-openapis and get-openapi', () => {
	assert.strictEqual(
		evaluateToolCall('mcp__liferay-ac-stg__get-openapis', {}).allow,
		true
	);
	assert.strictEqual(
		evaluateToolCall('mcp__liferay-ac-stg__get-openapi', {name: 'x'}).allow,
		true
	);
});

test('allows the render_chart tool', () => {
	assert.strictEqual(
		evaluateToolCall(CHART, {type: 'bar', title: 't'}).allow,
		true
	);
});

test('denies any tool outside the allowlist (e.g. Bash)', () => {
	const result = evaluateToolCall('Bash', {command: 'ls'});

	assert.strictEqual(result.allow, false);
	assert.match(result.reason, /not allowed/i);
});
