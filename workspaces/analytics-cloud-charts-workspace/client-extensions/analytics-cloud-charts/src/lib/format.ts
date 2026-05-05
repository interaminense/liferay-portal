/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	month: 'short',
	year: 'numeric',
});

export const formatDate = (raw: string | null) => {
	if (!raw) {
		return '—';
	}

	const parsed = new Date(raw);

	return Number.isNaN(parsed.getTime()) ? raw : DATE_FORMATTER.format(parsed);
};

export const formatKey = (key: string | null) => {
	if (!key) {
		return '—';
	}

	return key
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
};
