/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {STORAGE_KEY_CONTEXTS} from './constants';
import {convertMapToArr} from './map';
import {getItem, setItem} from './storage';
import {
	getItem as getItemFromCookie,
	setItem as setItemFromCookie,
} from './storage-cookie';

const getContexts = (contextStorageKey = STORAGE_KEY_CONTEXTS) => {
	const storedContextKvArr = getItemFromCookie(contextStorageKey);

	const storedContexts = new Map();

	if (storedContextKvArr) {
		storedContextKvArr.forEach(([key, value]) =>
			storedContexts.set(key, value)
		);
	}

	return storedContexts;
};

const setContexts = (contextsMap, contextStorageKey = STORAGE_KEY_CONTEXTS) => {
	setItemFromCookie(contextStorageKey, convertMapToArr(contextsMap));
};

export {getContexts, setContexts};
