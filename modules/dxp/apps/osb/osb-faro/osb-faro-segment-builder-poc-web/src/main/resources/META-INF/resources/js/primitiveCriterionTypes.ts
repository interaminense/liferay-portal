import {
	CriterionTypeDef,
	PrimitiveBooleanInput,
	PrimitiveDateInput,
	PrimitiveNumberInput,
	PrimitiveSelectInput,
	PrimitiveTextInput
} from '@liferay/osb-faro-segment-builder-web';

const op = (key: string, label: string) => ({key, label, name: key});

/**
 * Minimal `CriterionTypeDef` set for the poc-builder demo. The four
 * primitive types exercise the registry plumbing end-to-end without pulling
 * in any analytics-cloud machinery.
 */
export const primitiveCriterionTypes: ReadonlyArray<CriterionTypeDef> = [
	{
		defaultValue: '',
		inputComponent: PrimitiveTextInput,
		operators: [
			op('eq', 'is'),
			op('ne', 'is not'),
			op('contains', 'contains')
		],
		type: 'text'
	},
	{
		defaultValue: 0,
		inputComponent: PrimitiveNumberInput,
		operators: [
			op('eq', 'is equal to'),
			op('ne', 'is not equal to'),
			op('gt', 'greater than'),
			op('lt', 'less than')
		],
		type: 'number'
	},
	{
		defaultValue: 'true',
		inputComponent: PrimitiveBooleanInput,
		operators: [op('eq', 'is')],
		type: 'boolean'
	},
	{
		defaultValue: '',
		inputComponent: PrimitiveDateInput,
		operators: [
			op('eq', 'is'),
			op('lt', 'is before'),
			op('gt', 'is after')
		],
		type: 'date'
	},
	{
		defaultValue: '',
		inputComponent: PrimitiveSelectInput,
		operators: [op('eq', 'is'), op('ne', 'is not')],
		type: 'select'
	}
];
