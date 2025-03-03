/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/**
 * Debounces function execution.
 */
function debounce(fn: Function, delay: number): Function {
	return function debounced() {
		const args = arguments;

		cancelDebounce(debounced);

		// TODO: find a way to type this debounced.id

		// @ts-ignore

		debounced.id = setTimeout(() => {
			fn.apply(null, args);
		}, delay);
	};
}

/**
 * Cancels the scheduled debounced function.
 * @param {function()} debounced
 */
function cancelDebounce(debounced: Function) {

	// TODO: find a way to type this debounced.id

	// @ts-ignore

	clearTimeout(debounced.id);
}

export default debounce;
export {cancelDebounce, debounce};
