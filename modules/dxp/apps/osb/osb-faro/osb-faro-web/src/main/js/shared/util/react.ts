import {isEqual} from 'lodash';

export const getDisplayName = WrappedComponent =>
	WrappedComponent.displayName || WrappedComponent.name || 'Component';

type HasChanges = <T>(
	prev: T | any,
	next: T | any,
	...keys: string[]
) => boolean;

/**
 * Compare previous state or props object by provided keys to detect changes.
 * @deprecated
 */
export const hasChanges: HasChanges = (prev = {}, next = {}, ...keys) => {
	for (const key of keys) {
		if (key in next) {
			const newVal = next[key];

			const prevVal = prev[key];

			if (!isEqual(newVal, prevVal)) {
				return true;
			}
		}
	}

	return false;
};
