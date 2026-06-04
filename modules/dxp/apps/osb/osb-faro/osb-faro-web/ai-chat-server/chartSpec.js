/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const CHART_TYPES = ['line', 'bar', 'area', 'pie'];

/**
 * Validates a chart spec emitted by the assistant through the `render_chart`
 * tool before it is forwarded to the widget. A spec is never trusted blindly:
 * an invalid one becomes an `error` block instead of breaking the stream.
 *
 * @param {unknown} spec
 * @returns {{valid: boolean, errors: string[]}}
 */
function validateChartSpec(spec) {
	const errors = [];

	if (!spec || typeof spec !== 'object') {
		return {errors: ['Chart spec must be an object.'], valid: false};
	}

	const {data, series, title, type, xKey} = spec;

	if (!CHART_TYPES.includes(type)) {
		errors.push(`Chart "type" must be one of: ${CHART_TYPES.join(', ')}.`);
	}

	if (typeof title !== 'string' || title.trim() === '') {
		errors.push('Chart "title" must be a non-empty string.');
	}

	if (!Array.isArray(data) || data.length === 0) {
		errors.push('Chart "data" must be a non-empty array.');
	}

	if (typeof xKey !== 'string' || xKey.trim() === '') {
		errors.push('Chart "xKey" must be a non-empty string.');
	}

	if (!Array.isArray(series) || series.length === 0) {
		errors.push('Chart "series" must be a non-empty array.');
	} else if (!series.every(s => s && typeof s.key === 'string' && s.key)) {
		errors.push('Each chart "series" entry must have a string "key".');
	}

	return {errors, valid: errors.length === 0};
}

module.exports = {CHART_TYPES, validateChartSpec};
