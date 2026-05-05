/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export const CHART_PALETTE = [
	'#4B9BFF',
	'#FFB46E',
	'#FF5F5F',
	'#50D2A0',
	'#FF73C3',
	'#9CE269',
	'#B077FF',
	'#FFD76E',
	'#5FC8FF',
];

export const hexToRgb = (hex: string): string => {
	const cleaned = hex.replace('#', '').trim();

	if (cleaned.length !== 6) {
		return '11, 95, 255';
	}

	const r = Number.parseInt(cleaned.slice(0, 2), 16);
	const g = Number.parseInt(cleaned.slice(2, 4), 16);
	const b = Number.parseInt(cleaned.slice(4, 6), 16);

	if ([r, g, b].some((value) => Number.isNaN(value))) {
		return '11, 95, 255';
	}

	return `${r}, ${g}, ${b}`;
};

const NUMBER_FORMATTER = new Intl.NumberFormat();

export const toThousands = (value: number | null | undefined) =>
	value == null ? '0' : NUMBER_FORMATTER.format(value);

export const toRounded = (value: number | null | undefined, digits = 1) =>
	value == null ? '0' : value.toFixed(digits);

export const formatNumber = (value: number | null | undefined) =>
	value == null ? '—' : NUMBER_FORMATTER.format(Math.round(value));

export const formatPercentage = (
	value: number | null | undefined,
	digits = 1
) => (value == null ? '—' : `${value.toFixed(digits)}%`);

export const formatDuration = (seconds: number | null | undefined) => {
	if (seconds == null || !Number.isFinite(seconds)) {
		return '—';
	}

	const total = Math.round(seconds);

	if (total < 60) {
		return `${total}s`;
	}

	const minutes = Math.floor(total / 60);
	const remaining = total % 60;

	return remaining ? `${minutes}m ${remaining}s` : `${minutes}m`;
};

export const getPercentage = (
	value: number | null | undefined,
	total: number | null | undefined
) => {
	if (!total || !value) {
		return 0;
	}

	return (value / total) * 100;
};
