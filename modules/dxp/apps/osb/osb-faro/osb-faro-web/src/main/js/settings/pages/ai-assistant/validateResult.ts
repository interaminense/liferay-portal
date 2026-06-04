/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export interface Status {
	displayType: 'danger' | 'success';
	message: string;
}

export interface ValidateResult {
	error?: string;
	ok?: boolean;
}

/**
 * Maps the /ai-chat/validate response into an alert status. A successful check
 * yields a success alert; a failure surfaces the server-provided error, or a
 * generic message when none was given.
 */
export function toStatus(result: ValidateResult): Status {
	if (result.ok) {
		return {
			displayType: 'success',
			message: Liferay.Language.get('connection-successful')
		};
	}

	return {
		displayType: 'danger',
		message: result.error || Liferay.Language.get('connection-failed')
	};
}
