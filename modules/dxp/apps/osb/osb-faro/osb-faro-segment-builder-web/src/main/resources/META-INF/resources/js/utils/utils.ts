/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {every, isBoolean, isString, isUndefined} from 'lodash';
import {v4 as uuidv4} from 'uuid';

import {Conjunctions} from './constants';
import {Criteria, Criterion, CriterionGroup} from './types';

const GROUP_ID_NAMESPACE = 'group_';
const ROW_ID_NAMESPACE = 'row_';

/**
 * Generates a unique group id.
 */
export function generateGroupId(): string {
	return `${GROUP_ID_NAMESPACE}${uuidv4()}`;
}

/**
 * Generates a unique row id.
 */
export function generateRowId(): string {
	return `${ROW_ID_NAMESPACE}${uuidv4()}`;
}

/**
 * Checks if value is a CriterionGroup.
 */
export function isCriterionGroup(
	value: CriterionGroup | Criterion
): value is CriterionGroup {
	return !!value && (value as CriterionGroup).items !== undefined;
}

/**
 * Creates a new group object with items.
 */
export function createNewGroup(items: Criteria[]): CriterionGroup {
	return {
		conjunctionName: Conjunctions.And,
		criteriaGroupId: generateGroupId(),
		items,
	};
}

/**
 * Gets a list of group ids from a criteria object.
 * Used for disallowing groups to be moved into its own deeper nested groups.
 * Example of returned value: ['group_02', 'group_03']
 */
export function getChildGroupIds(criteria: Criteria): string[] {
	let childGroupIds: string[] = [];

	if (isCriterionGroup(criteria) && criteria.items.length) {
		childGroupIds = criteria.items.reduce(
			(groupIdList: string[], item) =>
				isCriterionGroup(item)
					? [
							...groupIdList,
							item.criteriaGroupId,
							...getChildGroupIds(item),
						]
					: groupIdList,
			[] as string[]
		);
	}

	return childGroupIds;
}

/**
 * Gets the property name from the propertyLabel string.
 */
export function getPropertyNameFromRaw(propertyLabel: string = ''): string {
	const properties = propertyLabel.split('/');

	return properties.length > 1 ? properties[1] : properties[0];
}

export function getPropertyContextFromRaw(
	propertyLabel: string = ''
): string | null {
	const properties = propertyLabel.split('/');

	return properties.length > 1 ? properties[0] : null;
}

/**
 * Converts an object of key value pairs to a form data object for passing
 * into a fetch body.
 */
export function objectToFormData(
	dataObject: Record<string, string | Blob>
): FormData {
	const formData = new FormData();

	Object.keys(dataObject).forEach((key) => {
		formData.set(key, dataObject[key]);
	});

	return formData;
}

/**
 * Parse an activityKey string into an object.
 */
export function parseActivityKey(activityKey: string = ''): {
	eventId: string;
	id: string;
	objectType: string;
} {
	const [objectType, eventId, id] = activityKey.split('#');

	return {eventId, id, objectType};
}

/**
 * Returns a YYYY-MM-DD date based on a JS Date object's local time.
 *
 * Uses local-time getters (not `toISOString().slice(0, 10)`, which is UTC
 * and would shift the date for users east/west of GMT) to preserve the
 * original `date-fns@1.x` format("YYYY-MM-DD") behaviour after we dropped
 * the dependency.
 */
export function jsDatetoYYYYMMDD(dateJsObject: Date): string {
	const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

	return `${dateJsObject.getFullYear()}-${pad(
		dateJsObject.getMonth() + 1
	)}-${pad(dateJsObject.getDate())}`;
}

/**
 * Check to see if the value is a valid input value.
 * The input value cannot be an empty string or undefined.
 */
export function isValid(value: any): boolean {
	return !(isUndefined(value) || (isString(value) && !value.length));
}

/**
 * Recursively check through all criteria to see if they're valid.
 */
export function validateSegmentInputs(criteria: Criteria): boolean {
	if (isCriterionGroup(criteria)) {
		const {items} = criteria;

		if (items.length) {
			return items.map(validateSegmentInputs).every(Boolean);
		}
	}
	else if (criteria) {
		if (isBoolean(criteria.valid)) {
			return criteria.valid;
		}

		return every(criteria.valid, Boolean);
	}

	return false;
}
