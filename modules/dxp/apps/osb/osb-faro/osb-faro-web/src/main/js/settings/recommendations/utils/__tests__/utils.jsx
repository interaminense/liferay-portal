import * as utils from '../utils';
import {cleanup} from '@testing-library/react';

describe('utils', () => {
	afterEach(cleanup);

	describe('getPropertiesFromItems', () => {
		afterEach(cleanup);

		it('should convert Filter to JobProperty', () => {
			const filter = 'url ~ .*custom-assets';

			expect(
				utils.getPropertiesFromItems([
					{name: 'includeFilter', value: filter}
				])
			).toEqual([{filter, negate: false}]);
		});
	});

	describe('getFilterValueBreakdown', () => {
		afterEach(cleanup);

		expect(utils.getFilterValueBreakdown('url ~ .*custom-assets')).toEqual({
			exactMatchSign: '~',
			metadataTag: 'url',
			rule: '.*custom-assets'
		});
	});
});
