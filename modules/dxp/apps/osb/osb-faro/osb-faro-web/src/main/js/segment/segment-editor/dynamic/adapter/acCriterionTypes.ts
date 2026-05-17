import AccountInput from '../inputs/AccountInput';
import BehaviorInput from '../inputs/BehaviorInput';
import BooleanInput from '../inputs/BooleanInput';
import CustomBooleanInput from '../inputs/CustomBooleanInput';
import CustomDateInput from '../inputs/CustomDateInput';
import CustomDateTimeInput from '../inputs/CustomDateTimeInput';
import CustomNumberInput from '../inputs/CustomNumberInput';
import DateInput from '../inputs/DateInput';
import DateTimeInput from '../inputs/DateTimeInput';
import DurationInput from '../inputs/DurationInput';
import EventInput from '../inputs/EventInput';
import GeolocationInput from '../inputs/GeolocationInput';
import IndividualSelectInput from '../inputs/IndividualSelectInput';
import InterestBooleanInput from '../inputs/InterestBooleanInput';
import NumberInput from '../inputs/NumberInput';
import OrganizationSelectInput from '../inputs/OrganizationSelectInput';
import OrganizationTextInput from '../inputs/OrganizationTextInput';
import SessionInput from '../inputs/SessionInput';
import StringInput from '../inputs/StringInput';
import TagInput from '../inputs/TagInput';
import VocabularyInput from '../inputs/VocabularyInput';
import {ComponentType} from 'react';
import {CriterionTypeDef} from '@liferay/osb-faro-segment-builder-web';
import {PropertyTypes, SUPPORTED_OPERATORS_MAP} from '../utils/constants';

const operatorsFor = (type: string) =>
	(SUPPORTED_OPERATORS_MAP as Record<string, any>)[type] ?? [];

const def = (
	type: PropertyTypes,
	inputComponent: ComponentType<any>
): CriterionTypeDef => ({
	inputComponent,
	operators: operatorsFor(type),
	type
});

/**
 * Maps every Analytics Cloud `PropertyTypes` value to the input component
 * that edits it. The list is consumed by `CatalogRegistry` so `CriteriaRow`
 * can resolve a component without importing any specific input. Inputs read
 * their analytics-cloud props (`channelId`, `groupId`, `timeZoneId`,
 * `segmentType`) from the `RowContext` that `SegmentEditor` provides.
 */
export const acCriterionTypes: ReadonlyArray<CriterionTypeDef> = [
	def(PropertyTypes.AccountDate, AccountInput),
	def(PropertyTypes.AccountNumber, AccountInput),
	def(PropertyTypes.AccountText, AccountInput),
	def(PropertyTypes.Behavior, BehaviorInput),
	def(PropertyTypes.Boolean, BooleanInput),
	def(PropertyTypes.Date, DateInput),
	def(PropertyTypes.DateTime, DateTimeInput),
	def(PropertyTypes.Duration, DurationInput),
	def(PropertyTypes.Event, EventInput),
	def(PropertyTypes.Interest, InterestBooleanInput),
	def(PropertyTypes.Number, NumberInput),
	def(PropertyTypes.OrganizationBoolean, CustomBooleanInput),
	def(PropertyTypes.OrganizationDate, CustomDateInput),
	def(PropertyTypes.OrganizationDateTime, CustomDateTimeInput),
	def(PropertyTypes.OrganizationNumber, CustomNumberInput),
	def(PropertyTypes.OrganizationSelectText, OrganizationSelectInput),
	def(PropertyTypes.OrganizationText, OrganizationTextInput),
	def(PropertyTypes.SelectText, IndividualSelectInput),
	def(PropertyTypes.SessionDateTime, CustomDateTimeInput),
	def(PropertyTypes.SessionGeolocation, GeolocationInput),
	def(PropertyTypes.SessionNumber, SessionInput),
	def(PropertyTypes.SessionText, SessionInput),
	def(PropertyTypes.Tag, TagInput),
	def(PropertyTypes.Text, StringInput),
	def(PropertyTypes.Vocabulary, VocabularyInput)
];
