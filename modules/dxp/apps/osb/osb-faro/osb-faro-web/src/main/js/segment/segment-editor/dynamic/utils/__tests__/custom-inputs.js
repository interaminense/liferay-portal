import {cleanup} from '@testing-library/react';
import {
	createCustomValueMap,
	getCompleteDate,
	getFilterCriterionIMap,
	getIndexFromPropertyName,
	getOperator,
	getPropertyValue,
	removeItemsByIndex,
	setCompleteDate,
	setOperator,
	setPropertyValue
} from '../custom-inputs';
import {RelationalOperators, TimeSpans} from '../../utils/constants';

const mockValue = createCustomValueMap([
	{
		key: 'criterionGroup',
		value: [
			{
				operatorName: RelationalOperators.EQ,
				propertyName: 'context/city',
				value: 'foo'
			},
			{
				operatorName: RelationalOperators.GT,
				propertyName: 'completeDate',
				value: TimeSpans.Last7Days
			}
		]
	}
]);

describe('Custom Inputs Util', () => {
	afterEach(cleanup);

	describe('createCustomValueMap', () => {
		afterEach(cleanup);

		// This unit test is skipped because uuid is generated every time test is run.

		it.skip('should create an immutable valueIMap from a given param array', () => {
			expect(
				createCustomValueMap([
					{
						key: 'criterionGroup',
						value: [
							{
								operatorName: RelationalOperators.EQ,
								propertyName: 'context/city',
								value: 'foo'
							},
							{
								operatorName: RelationalOperators.GT,
								propertyName: 'completeDate',
								value: TimeSpans.Last7Days
							}
						]
					}
				])
			).toMatchSnapshot();
		});
	});

	describe('getFilterCriterionIMap', () => {
		afterEach(cleanup);

		it('should return the Filter Criterion Immutable Map', () => {
			expect(
				getFilterCriterionIMap(mockValue, 1).get('propertyName')
			).toBe('completeDate');
		});
	});

	describe('getIndexFromPropertyName', () => {
		afterEach(cleanup);

		it('should return the index of the first entry in the criterion list that matches the propertyName', () => {
			expect(getIndexFromPropertyName(mockValue, 'completeDate')).toBe(1);
		});
	});

	describe('getOperator', () => {
		afterEach(cleanup);

		it('should return the operator', () => {
			expect(getOperator(mockValue, 0)).toBe(RelationalOperators.EQ);
		});
	});

	describe('getCompleteDate', () => {
		afterEach(cleanup);

		it('should return the time period', () => {
			expect(getCompleteDate(mockValue)).toBe('last7Days');
		});
	});

	describe('getPropertyValue', () => {
		afterEach(cleanup);

		it('should return the value', () => {
			expect(getPropertyValue(mockValue, 'value', 0)).toBe('foo');
		});
	});

	describe('removeItemsByIndex', () => {
		afterEach(cleanup);

		it('should remove items by index from the criteria list', () => {
			const indexToRemove = getIndexFromPropertyName(
				mockValue,
				'completeDate'
			);

			const updatedMockValue = removeItemsByIndex(mockValue, [
				indexToRemove
			]);

			expect(
				getIndexFromPropertyName(updatedMockValue, 'completeDate')
			).toBe(-1);
		});
	});

	describe('setOperator', () => {
		afterEach(cleanup);

		it('should set the operator', () => {
			const updatedValue = setOperator(
				mockValue,
				0,
				RelationalOperators.NE
			);

			expect(getOperator(updatedValue, 0)).toBe(RelationalOperators.NE);
		});
	});

	describe('setPropertyValue', () => {
		afterEach(cleanup);

		it('should update the value', () => {
			const newValue = 'new value foo';
			const updatedValue = setPropertyValue(
				mockValue,
				'value',
				0,
				newValue
			);

			expect(getPropertyValue(updatedValue, 'value', 0)).toBe(newValue);
		});
	});

	describe('setCompleteDate', () => {
		afterEach(cleanup);

		it('should update the time period', () => {
			const newTimePeriod = 'fooTimePeriod';
			const updatedValue = setCompleteDate(mockValue, newTimePeriod);

			expect(getCompleteDate(updatedValue)).toBe(newTimePeriod);
		});
	});
});
