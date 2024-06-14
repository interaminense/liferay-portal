import reducer from '../index';
import {cleanup} from '@testing-library/react';

describe('Index Reducer', () => {
	afterEach(cleanup);

	it('should be a function', () => {
		expect(typeof reducer).toBe('function');
	});
});
