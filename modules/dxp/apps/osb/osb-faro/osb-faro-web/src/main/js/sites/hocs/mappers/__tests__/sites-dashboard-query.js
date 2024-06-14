import {cleanup} from '@testing-library/react';
import {mapResultToProps} from '../sites-dashboard-query';

const mockData = {
	dataSources: [{foo: 'foo'}]
};

describe('Sites Dashboard Query Mapper', () => {
	afterEach(cleanup);

	describe('mapResultToProps', () => {
		afterEach(cleanup);

		it('should map sites dashboard query result to props', () => {
			expect(mapResultToProps({data: mockData})).toEqual(
				expect.objectContaining({sites: expect.any(Array)})
			);
		});
	});
});
