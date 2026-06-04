/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const PREFIX = 'Basic ';

export interface BasicCredentials {
	password: string;
	username: string;
}

/**
 * Builds the `Basic <base64>` Authorization header from a username/password.
 * Returns '' when both are empty so "no auth" is represented uniformly.
 */
export function encodeBasic({password, username}: BasicCredentials): string {
	if (!username && !password) {
		return '';
	}

	return `${PREFIX}${btoa(`${username}:${password}`)}`;
}

/**
 * Parses a `Basic <base64>` header back into its username/password (splitting on
 * the first colon). Returns empty fields for anything that is not a well-formed
 * Basic header.
 */
export function decodeBasic(header: string): BasicCredentials {
	if (!header || !header.startsWith(PREFIX)) {
		return {password: '', username: ''};
	}

	try {
		const decoded = atob(header.slice(PREFIX.length));
		const separator = decoded.indexOf(':');

		if (separator === -1) {
			return {password: '', username: decoded};
		}

		return {
			password: decoded.slice(separator + 1),
			username: decoded.slice(0, separator)
		};
	} catch (error) {
		return {password: '', username: ''};
	}
}
