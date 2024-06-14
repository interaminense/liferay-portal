import {cleanup} from '@testing-library/react';
import {getVariableDefinitions, removeUnusedVariables} from '../graphql';

const mockGQLQuery = {
	definitions: [
		{
			variableDefinitions: [
				{
					variable: {
						name: {
							value: 'name'
						}
					}
				},
				{
					variable: {
						name: {
							value: 'rangeKey'
						}
					}
				}
			]
		}
	]
};

const mockVariables = {
	name: 'Tester',
	rangeKey: '30',
	test: 'no'
};

describe('GraphQL Utils', () => {
	afterEach(cleanup);

	describe('getVariableDefinitions', () => {
		afterEach(cleanup);

		it('Returns the variable definitions from a GQLQuery', () => {
			expect(getVariableDefinitions(mockGQLQuery)).toEqual({
				name: true,
				rangeKey: true
			});
		});
	});

	describe('removeUnusedVariables', () => {
		afterEach(cleanup);

		it('Returns only the variables that exist in the variableDefinitions', () => {
			expect(
				removeUnusedVariables(mockVariables, {
					name: true,
					rangeKey: true
				})
			).toEqual({
				name: 'Tester',
				rangeKey: '30'
			});
		});
	});
});
