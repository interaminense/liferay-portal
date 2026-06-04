/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const assert = require('node:assert');
const {test} = require('node:test');

const {validateChartSpec} = require('../chartSpec');

const VALID = {
	data: [
		{month: 'Jan', visitors: 10},
		{month: 'Feb', visitors: 20}
	],
	series: [{key: 'visitors', label: 'Visitors'}],
	title: 'Unique visitors',
	type: 'line',
	xKey: 'month'
};

test('accepts a well-formed chart spec', () => {
	const result = validateChartSpec(VALID);

	assert.strictEqual(result.valid, true);
	assert.deepStrictEqual(result.errors, []);
});

test('rejects an unknown chart type', () => {
	const result = validateChartSpec({...VALID, type: 'donut'});

	assert.strictEqual(result.valid, false);
	assert.ok(result.errors.some(e => /type/i.test(e)));
});

test('rejects a missing or empty title', () => {
	assert.strictEqual(validateChartSpec({...VALID, title: ''}).valid, false);
	assert.strictEqual(
		validateChartSpec({...VALID, title: undefined}).valid,
		false
	);
});

test('rejects empty or non-array data', () => {
	assert.strictEqual(validateChartSpec({...VALID, data: []}).valid, false);
	assert.strictEqual(
		validateChartSpec({...VALID, data: 'nope'}).valid,
		false
	);
});

test('rejects a missing xKey', () => {
	const result = validateChartSpec({...VALID, xKey: undefined});

	assert.strictEqual(result.valid, false);
	assert.ok(result.errors.some(e => /xKey/i.test(e)));
});

test('rejects an empty series list', () => {
	assert.strictEqual(validateChartSpec({...VALID, series: []}).valid, false);
});

test('rejects a series entry without a key', () => {
	const result = validateChartSpec({
		...VALID,
		series: [{label: 'no key here'}]
	});

	assert.strictEqual(result.valid, false);
	assert.ok(result.errors.some(e => /series/i.test(e)));
});

test('rejects a null/undefined spec', () => {
	assert.strictEqual(validateChartSpec(undefined).valid, false);
	assert.strictEqual(validateChartSpec(null).valid, false);
});
