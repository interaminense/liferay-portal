import {buildQueryString} from '../utils/odata';
import {
	CriterionGroup,
	Serializer
} from '@liferay/osb-faro-segment-builder-web';

/**
 * Analytics-cloud serializer. Delegates to the existing `buildQueryString`
 * so the emitted filter string is byte-identical to what the segment editor
 * has historically produced — `buildQueryString` already routes through the
 * `REMOTE_CRITERION_TYPES` registry for tag/vocabulary, so this is just a
 * thin adapter to the public `Serializer` interface.
 */
export const ODataSerializer: Serializer<string> = {
	serialize(criteria: CriterionGroup | null): string {
		return criteria ? buildQueryString([criteria]) : '';
	}
};
