/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Analytics} from '../types';
import {convertMapToArr} from './map';
import {getItem, setItem} from './storage';

const getContexts = (contextStorageKey = Analytics.StorageKeys.Contexts) => {
	const storedContextKvArr =
		getItem<[string, Analytics.Context][]>(contextStorageKey);

	const storedContexts = new Map();

	if (storedContextKvArr) {
		storedContextKvArr.forEach(([key, value]: [string, object]) =>
			storedContexts.set(key, value)
		);
	}

	return storedContexts;
};

const setContexts = (
	contextsMap: Map<number, Analytics.Context>,
	contextStorageKey = Analytics.StorageKeys.Contexts
) => {
	const item = convertMapToArr(contextsMap);

	setItem<[number, unknown][]>(contextStorageKey, item);
};

export {getContexts, setContexts};
