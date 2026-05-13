/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fetch} from 'frontend-js-web';

import {Property, PropertyGroup, PropertyType} from '../utils/types';

interface Field {
	example?: string;
	name: string;
	required?: boolean;
	selected?: boolean;
	source?: string;
	type: string;
}

const ENDPOINT = '/o/analytics-settings-rest/v1.0';

const MAX_PAGE_SIZE = 200;

async function fetchFields(path: string): Promise<Field[]> {
	const response = await fetch(`${ENDPOINT}${path}?pageSize=${MAX_PAGE_SIZE}`);

	if (!response.ok) {
		throw new Error(`${path} returned ${response.status}`);
	}

	const data = await response.json();

	return Array.isArray(data) ? data : data?.items ?? [];
}

function normalizeType(type: string): PropertyType {
	const normalized = (type || '').toLowerCase();

	if (normalized === 'boolean' || normalized === 'bool') {
		return 'boolean';
	}

	if (
		normalized === 'date' ||
		normalized === 'datetime' ||
		normalized === 'timestamp'
	) {
		return 'date';
	}

	if (
		normalized === 'integer' ||
		normalized === 'long' ||
		normalized === 'short' ||
		normalized === 'decimal' ||
		normalized === 'double' ||
		normalized === 'float' ||
		normalized === 'number'
	) {
		return 'number';
	}

	return 'text';
}

function humanize(name: string): string {
	const withSpaces = name
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[_-]+/g, ' ')
		.trim();

	if (!withSpaces) {
		return name;
	}

	return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function fieldToProperty(field: Field): Property {
	return {
		label: humanize(field.name),
		name: field.name,
		type: normalizeType(field.type),
	};
}

export async function fetchPropertyGroups(): Promise<PropertyGroup[]> {
	const [peopleFields, accountFields] = await Promise.all([
		fetchFields('/fields/people'),
		fetchFields('/fields/accounts'),
	]);

	const groups: PropertyGroup[] = [];

	if (peopleFields.length) {
		groups.push({
			label: Liferay.Language.get('individual'),
			properties: peopleFields.map(fieldToProperty),
			propertyKey: 'individual',
		});
	}

	if (accountFields.length) {
		groups.push({
			label: Liferay.Language.get('account'),
			properties: accountFields.map(fieldToProperty),
			propertyKey: 'account',
		});
	}

	return groups;
}
